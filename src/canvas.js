const explanation = document.getElementById("explanation")
const uploadWrapper = document.getElementById("upload-wrapper")
const upload = document.getElementById('upload');
const extractBtn = document.getElementById("extract-btn")
const canvasWrapper = document.getElementById("cvs-wrapper")
const canvas = new fabric.Canvas("cvs", {
    uniformScaling: false
})

const cropRects =

window.onresize = () => scaleCanvas(canvas.backgroundImage)

canvas.on('selection:cleared', () => {
    let cropper = canvas.item(0);
    if (cropper) {
        canvas.setActiveObject(cropper)
        canvas.renderAll()
    }
});

document.onpaste = function (event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.kind === 'file') {
            loadFile("Unknown", item.getAsFile())
        }
    }
};

upload.addEventListener('dragenter', () => {
    upload.parentNode.className = 'area dragging';
}, false);

upload.addEventListener('dragleave', () => {
    upload.parentNode.className = 'area';
}, false);

upload.addEventListener('dragdrop', () => {
    const file = upload.files[0]
    loadFile(file)
}, false);

upload.addEventListener('change', async () => {
    const file = upload.files[0]
    await loadFile(file)
}, false);

async function loadFile(file) {
    const objUrl = URL.createObjectURL(file);
    canvas.hash = await hashImage(file)

    fabric.Image.fromURL(objUrl, img => {
        uploadWrapper.style.display = "none"
        canvas.clear()
        const ratio = scaleCanvas(img)

        const cropRect = new fabric.Rect({
            left: 15,
            top: 15,
            width: img.width + 5,
            height: img.height + 5,
            fill: 'transparent',
            stroke: '#FF0000',
            strokeWidth: 3 / ratio,
            strokeDashArray: [5 / ratio, 3 / ratio],
            strokeUniform: true,
            uniformScaling: false,
        })

        canvas.setBackgroundImage(img, null, {
            top: 20,
            left: 20
        })

        canvas.add(cropRect)
        cropRect.on('moving', handleCropMoving)
        cropRect.on('scaling', handleCropScaling)

        canvas.setActiveObject(canvas.item(0))
        canvas.renderAll()

        extractBtn.disabled = false
        explanation.style.display = "block"
    });
}

function scaleCanvas(img) {
    if (!img) {
        return
    }

    const ratio = Math.min(
        Math.min(canvasWrapper.clientWidth / (img.width + 40), 1),
        Math.min(canvasWrapper.clientHeight / (img.height + 40), 1),
    );
    window.MyAltTextOrg.canvasRatio = ratio
    canvas.setZoom(ratio)
    canvas.setDimensions({width: (img.width + 40) * ratio, height: (img.height + 40) * ratio})

    return ratio
}

function handleCropMoving() {
    const cropRect = canvas.item(0)
//TODO: Fix, can't move to bottom or right sides
    if ((cropRect.left * window.MyAltTextOrg.canvasRatio) < 10) {
        cropRect.left = 10
    }

    if ((cropRect.left + cropRect.width * cropRect.scaleX) * window.MyAltTextOrg.canvasRatio > canvas.width - 20) {
        cropRect.left = canvas.width - 20 - cropRect.width * cropRect.scaleX
    }

    if ((cropRect.top * window.MyAltTextOrg.canvasRatio) < 10) {
        cropRect.top = 10
    }

    if ((cropRect.top + cropRect.height * cropRect.scaleY) * window.MyAltTextOrg.canvasRatio > canvas.height - 20) {
        cropRect.top = canvas.height - 20 - cropRect.height * cropRect.scaleY
    }
}

function handleCropScaling() {
    //TODO: Prevent scaling outside canvas
}



async function crop() {
    const cropRect = canvas.item(0)

    cropRect.opacity = 0

    canvas.setZoom(1)
    const dataUrl = canvas.toDataURL({
        left: cropRect.left,
        top: cropRect.top,
        width: cropRect.width * cropRect.scaleX,
        height: cropRect.height * cropRect.scaleY
    })
    canvas.setZoom(window.MyAltTextOrg.canvasRatio)
    cropRect.opacity = 1

    return dataUrl
}
