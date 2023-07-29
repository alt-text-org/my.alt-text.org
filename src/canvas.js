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
    const centralUpload = document.getElementById('central-upload')

    centralUpload.addEventListener('dragenter', () => {
        upload.parentNode.className = 'area dragging';
    }, false);

    centralUpload.addEventListener('dragleave', () => {
        upload.parentNode.className = 'area';
    }, false);

    centralUpload.addEventListener('dragdrop', async () => {
        const file = upload.files[0]
        await loadFile(file)
    }, false);

    upload.addEventListener('change', async () => {
        const file = upload.files[0]
        await loadFile(file)
    }, false);
})();

async function loadDataUrl(dataUrl, name) {
    const file = await srcToFile(
        dataUrl,
        name || "",
        dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"))
    )

    await loadFile(file)
}

async function loadFile(file) {
    const url = URL.createObjectURL(file);
    if (MyAltTextOrg.c.discardCropsOnNewImg) {
        MyAltTextOrg.canvas.clear()
    }

    fabric.Image.fromURL(url, async img => {
        const extractBtn = document.getElementById("extract-btn")
        const uploadWrapper = document.getElementById("upload-wrapper")
        const canvasWrapper = document.getElementById("cvs-wrapper")
        uploadWrapper.style.display = "none"
        canvasWrapper.style.display = "flex"

        MyAltTextOrg.canvas.setBackgroundImage(img, null, {
            top: MyAltTextOrg.const.CVS_PADDING,
            left: MyAltTextOrg.const.CVS_PADDING
        })

        let fullDataUrl = MyAltTextOrg.canvas.toDataURL();
        MyAltTextOrg.currImage = {
            hash: await hashImage(file),
            name: file.name,
            scale: scaleCanvas(img),
            dataUrl: fullDataUrl
        }
        // saveImageTemp()

        //TODO: don't let crops outside canvas
        // cropRect.on('moving', handleCropMoving)
        // cropRect.on('scaling', handleCropScaling)

        MyAltTextOrg.canvas.renderAll()
        setImageFilter(true)
        updateDescriptionDisplay()

        extractBtn.style.display = "block"
    });
}

MyAltTextOrg.const.STORED_IMG = "curr_img"

function saveImageTemp() {
    if (MyAltTextOrg.currImage) {
        try {
            window.sessionStorage.setItem(MyAltTextOrg.const.STORED_IMG, JSON.stringify(MyAltTextOrg.currImage))
        } catch (e) {
            console.log("Couldn't save aside image in session storage")
            console.log(e)
        }
    }
}

async function initStoredImage() {
    const storedImg = window.sessionStorage.getItem(MyAltTextOrg.const.STORED_IMG)
    if (storedImg) {
        const parsed = JSON.parse(storedImg)
        await loadDataUrl(parsed.dataUrl)
    }
}

function srcToFile(src, fileName, mimeType) {
    return (fetch(src)
            .then(res => res.arrayBuffer())
            .then(buf => new File([buf], fileName, {type: mimeType}))
    );
}

function clearImage() {
    const toggleBtn = document.getElementById("image-filter-toggle")
    const uploadWrapper = document.getElementById("upload-wrapper")
    const extractBtn = document.getElementById("extract-btn")
    const canvasWrapper = document.getElementById("cvs-wrapper")

    MyAltTextOrg.canvas.clear()
    uploadWrapper.style.display = "flex"
    canvasWrapper.style.display = "none"
    MyAltTextOrg.currImage = null
    extractBtn.style.display = "none"
    toggleBtn.disabled = true
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


MyAltTextOrg.crops.active = {
    currRect: null,
    currRectStart: null,
    lastPoint: null,
    justEntered: false
}
MyAltTextOrg.canvas.on('mouse:move', handleMouseMove)
MyAltTextOrg.canvas.on('mouse:up', handleMouseUp)
MyAltTextOrg.canvas.on('mouse:down', handleMouseDown)
MyAltTextOrg.canvas.on('mouse:over', handleMouseOver)
MyAltTextOrg.canvas.on('mouse:out', handleMouseOut)

function scalePointer(pointer) {
    return {
        x: pointer.x / MyAltTextOrg.currImage.scale,
        y: pointer.y / MyAltTextOrg.currImage.scale
    }
}

function handleMouseDown(e) {
    if (e.button !== 1 || isOverActiveObject(e.pointer) || MyAltTextOrg.crops.active.currRect) {
        return
    }

    addRect(scalePointer(e.pointer))
}

function handleMouseMove(e) {
    if (!primaryMouseButtonDown || !MyAltTextOrg.crops.active.currRect || MyAltTextOrg.canvas.getActiveObject()) {
        return
    }

    let scaled = scalePointer(e.pointer);
    MyAltTextOrg.crops.active.lastPoint = scaled
    renderRect(scaled)
}

function handleMouseUp(e) {
    MyAltTextOrg.canvas.discardActiveObject(null);
    MyAltTextOrg.crops.active.currRect = null
    MyAltTextOrg.crops.active.currRectStart = null
}

function handleMouseOver(e) {
    MyAltTextOrg.crops.active.justEntered = true
}

function handleMouseOut(e) {
    if (primaryMouseButtonDown && MyAltTextOrg.crops.active.currRect) {
        renderRect(MyAltTextOrg.crops.active.lastPoint)
    }
}

function addRect(pointer, width, height) {
    const cropRect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: width || 1,
        height: height || 1,
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
    let currRectStart = MyAltTextOrg.crops.active.currRectStart
    currRect.scale(1)
    currRect.left = Math.min(pointer.x, currRectStart.x)
    currRect.top = Math.min(pointer.y, currRectStart.y)
    currRect.width = Math.max(pointer.x, currRectStart.x) - currRect.left
    currRect.height = Math.max(pointer.y, currRectStart.y) - currRect.top
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
