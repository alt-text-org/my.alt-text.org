MyAltTextOrg.const.CVS_PADDING = 0

MyAltTextOrg.canvas = new fabric.Canvas("cvs", {
    uniformScaling: false
})

window.onresize = () => {
    if (MyAltTextOrg.canvas.backgroundImage) {
        MyAltTextOrg.currImage.scale = scaleCanvas(MyAltTextOrg.canvas.backgroundImage)
    }
}

MyAltTextOrg.canvas.selectionColor = 'transparent'
MyAltTextOrg.canvas.selectionBorderColor = "transparent"


document.onpaste = function (event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.kind === 'file') {
            loadFile(item.getAsFile())
        }
    }
};

(() => {
    const upload = document.getElementById('upload');
    const topUpload = document.getElementById('top-upload')

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

    topUpload.addEventListener('change', async () => {
        const file = topUpload.files[0]
        await loadFile(file)
    }, false);
})()

async function loadFile(file) {
    const objUrl = URL.createObjectURL(file);
    if (MyAltTextOrg.c.discardCropsOnNewImg) {
        MyAltTextOrg.canvas.clear()
    }

    fabric.Image.fromURL(objUrl, async img => {
        const extractBtn = document.getElementById("extract-btn")
        const uploadWrapper = document.getElementById("upload-wrapper")
        const canvasWrapper = document.getElementById("cvs-wrapper")

        uploadWrapper.style.display = "none"
        canvasWrapper.style.display = "flex"

        MyAltTextOrg.currImage = {
            hash: await hashImage(file),
            name: file.name,
            scale: scaleCanvas(img)
        }

        MyAltTextOrg.canvas.setBackgroundImage(img, null, {
            top: MyAltTextOrg.const.CVS_PADDING,
            left: MyAltTextOrg.const.CVS_PADDING
        })

        //TODO: don't let crops outside canvas
        // cropRect.on('moving', handleCropMoving)
        // cropRect.on('scaling', handleCropScaling)

        MyAltTextOrg.canvas.renderAll()
        updateDescriptionDisplay()

        closeImgBtn.disabled = false
        extractBtn.disabled = false
    });
}

function clearImage() {
    const uploadWrapper = document.getElementById("upload-wrapper")
    const extractBtn = document.getElementById("extract-btn")
    const canvasWrapper = document.getElementById("cvs-wrapper")

    MyAltTextOrg.canvas.clear()
    uploadWrapper.style.display = "flex"
    canvasWrapper.style.display = "none"
    MyAltTextOrg.currImage = null
    closeImgBtn.disabled = true
    extractBtn.disabled = true
    updateDescriptionDisplay()
}

let primaryMouseButtonDown = false;

function setPrimaryButtonState(e) {
    const flags = e.buttons !== undefined ? e.buttons : e.which;
    primaryMouseButtonDown = (flags & 1) === 1;
}

document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);


// canvas.on('mouse:move', handleMouseMove)
// canvas.on('mouse:up', handleMouseUp)
// canvas.on('mouse:down', handleMouseDown)
// canvas.on('mouse:over', handleMouseOver)
// canvas.on('mouse:out', handleMouseOut)

MyAltTextOrg.crops.active = {
    currRect: null,
    currRectStart: null,
    lastPoint: null,
    justEntered: false
}

function handleMouseDown(e) {
    console.log(`Down: ${JSON.stringify(e.pointer)}`)
    if (e.button !== 1 || isOverActiveObject(e.pointer) || MyAltTextOrg.crops.active.currRect) {
        return
    }

    addRect(e.pointer)
}

function handleMouseMove(e) {
    // console.log(`Move: ${JSON.stringify(e.pointer)}`)
    if (e.pointer) {
        MyAltTextOrg.crops.active.lastPoint = e.pointer
    }

    if (!primaryMouseButtonDown || !MyAltTextOrg.crops.active.currRect) {
        return
    }

    renderRect(e.pointer)
}

function handleMouseUp(e) {
    console.log(`Up: ${JSON.stringify(e.pointer)}`)

    MyAltTextOrg.crops.active.currRect = null
    MyAltTextOrg.crops.active.currRectStart = null
}

function handleMouseOver(e) {
    console.log(`Over`)
    MyAltTextOrg.crops.active.justEntered = true
}

function handleMouseOut(e) {
    console.log(`Out: ${JSON.stringify(MyAltTextOrg.crops.active.lastPoint)}`)

    if (primaryMouseButtonDown && MyAltTextOrg.crops.active.currRect) {
        renderRect(MyAltTextOrg.crops.active.lastPoint)
    }
}

function addRect(pointer) {
    const cropRect = new fabric.Rect({
        left: pointer.x * MyAltTextOrg.currImage.scale,
        top: pointer.y * MyAltTextOrg.currImage.scale,
        width: 1,
        height: 1,
        fill: 'transparent',
        stroke: '#FF0000',
        strokeWidth: 3 / MyAltTextOrg.currImage.scale,
        strokeDashArray: [5 / MyAltTextOrg.currImage.scale, 3 / MyAltTextOrg.currImage.scale],
        strokeUniform: true,
        uniformScaling: false,
    })
    MyAltTextOrg.canvas.add(cropRect)
    MyAltTextOrg.crops.active.currRect = cropRect
    MyAltTextOrg.crops.active.currRectStart = {
        x: pointer.x,
        y: pointer.y
    }
}

function isOverActiveObject(pointer) {
    const active = MyAltTextOrg.canvas.getActiveObject()
    if (!active) {
        return
    }

    return pointer.x >= active.left && pointer.x <= (active.left + active.width) * active.scaleX
        && pointer.y >= active.top && pointer.y <= (active.top + active.height) * active.scaleY
}

function renderRect(pointer) {
    let currRect = MyAltTextOrg.crops.active.currRect
    currRectStart = MyAltTextOrg.crops.active.currRectStart
    currRect.scale(1)
    currRect.left = Math.min(pointer.x, currRectStart.x) * MyAltTextOrg.currImage.scale
    currRect.top = Math.min(pointer.y, currRectStart.y) * MyAltTextOrg.currImage.scale
    currRect.width = (Math.max(pointer.x, currRectStart.x) - currRect.left) * MyAltTextOrg.currImage.scale
    currRect.height = (Math.max(pointer.y, currRectStart.y) - currRect.top) * MyAltTextOrg.currImage.scale
    MyAltTextOrg.canvas.renderAll()
}

function scaleCanvas(img) {
    const canvasWrapper = document.getElementById("cvs-wrapper")

    if (!img) {
        return
    }

    const ratio = Math.min(
        Math.min(canvasWrapper.clientWidth / img.width, 1),
        Math.min(canvasWrapper.clientHeight / img.height, 1),
    );
    MyAltTextOrg.canvas.setZoom(ratio)
    MyAltTextOrg.canvas.setDimensions({
        width: img.width * ratio + MyAltTextOrg.const.CVS_PADDING * 2,
        height: img.height * ratio + MyAltTextOrg.const.CVS_PADDING * 2
    })
    MyAltTextOrg.canvas.renderAll()
    return ratio
}

function handleCropMoving() {
    const cropRect = MyAltTextOrg.canvas.getActiveObject()
    //TODO: Can't move to bottom or right sides
    if ((cropRect.left * MyAltTextOrg.currImage.scale) < 10) {
        cropRect.left = 10
    }

    if ((cropRect.left + cropRect.width * cropRect.scaleX) * MyAltTextOrg.currImage.scale > MyAltTextOrg.canvas.width - 20) {
        cropRect.left = MyAltTextOrg.canvas.width - 20 - cropRect.width * cropRect.scaleX
    }

    if ((cropRect.top * MyAltTextOrg.currImage.scale) < 10) {
        cropRect.top = 10
    }

    if ((cropRect.top + cropRect.height * cropRect.scaleY) * MyAltTextOrg.currImage.scale > MyAltTextOrg.canvas.height - 20) {
        cropRect.top = MyAltTextOrg.canvas.height - 20 - cropRect.height * cropRect.scaleY
    }
}

function handleCropScaling() {
    //TODO: Prevent scaling outside canvas
}

function crop() {
    MyAltTextOrg.canvas.setZoom(1)
    let crops = MyAltTextOrg.canvas.getActiveObject()
        ? [MyAltTextOrg.canvas.getActiveObject()]
        : MyAltTextOrg.canvas.getObjects("rect");

    if (crops.length > 0) {
        const result = []
        for (let crop of crops) {
            crop.opacity = 0
            const dataUrl = MyAltTextOrg.canvas.toDataURL({
                left: crop.left,
                top: crop.top,
                width: crop.width * crop.scaleX,
                height: crop.height * crop.scaleY
            })
            crop.opacity = 1
            result.push(dataUrl)
        }

        MyAltTextOrg.canvas.setZoom(MyAltTextOrg.currImage.scale)
        return result
    } else {
        MyAltTextOrg.canvas.setZoom(MyAltTextOrg.currImage.scale)
        return [MyAltTextOrg.canvas.toDataURL()]
    }
}
