const QOI = require("../node_modules/qoijs");

const elementMutated = (mutationList) => {
    for (var i = 0; i < mutationList.length; i++) {
        var mutation = mutationList[i];
        updateElement(mutation.target);
    }
};

const convertQOI = (element, url, onload) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = (ev) => {
        var target = ev.target;
        if (target.status == 200) {
            const imgData = QOI.decode(target.response, null, null, 4);

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = imgData.width;
            canvas.height = imgData.height;

            var ctxImageData = ctx.createImageData(
                imgData.width,
                imgData.height
            );
            for (var i = 0; i < imgData.data.length; i++) {
                ctxImageData.data[i] = imgData.data[i];
            }

            ctx.putImageData(ctxImageData, 0, 0);
            if (typeof onload === "function") {
                const dataURL = canvas.toDataURL();
                canvas.remove();
                onload(dataURL, element);
            }
        }
    };
    xhr.send();
};

const updateElement = (element) => {
    if (element.hasAttribute) {
        if (element.hasAttribute("src") && element.src.slice(-4) === ".qoi") {
            convertQOI(element, element.src, (dataURL, element) => {
                element.src = dataURL;
            });
        } else if (
            element.hasAttribute("href") &&
            element.href.slice(-4) === ".qoi"
        ) {
            convertQOI(element, element.href, (dataURL, element) => {
                element.href = dataURL;
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // iterate through all elements when the page was loaded
    const allImages = document.getElementsByTagName("*");
    for (var i = 0; i < allImages.length; i++) {
        updateElement(allImages[i]);
    }

    // convert QOI images when elements are added/mutated
    if (!MutationObserver) return;

    var observer = new MutationObserver(elementMutated);
    var targetNode = document.body;

    observer.observe(targetNode, {
        attributes: true,
        childList: true,
        subtree: true,
    });
});
