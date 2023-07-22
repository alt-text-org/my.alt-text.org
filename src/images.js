async function hashImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async function () {
            let imgHashArr = await crypto.subtle.digest("SHA-256", reader.result);
            let imgHash = [...new Uint8Array(imgHashArr)]
                .map(b => b.toString(16).padStart(2, "0"))
                .join("");
            resolve(imgHash)
        };
    })
}

const auxImageEdgeLength = 1000;
const auxImageFontPixels = 100

function getAuxCanvas(lang, num, total) {
    const canvas = document.createElement("canvas")
    canvas.width = auxImageEdgeLength
    canvas.height = auxImageEdgeLength
    const ctx = canvas.getContext('2d');
    const text = additionalImageText[lang] || additionalImageText[DEFAULT_ADDTL_IMAGE_TXT]

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, auxImageEdgeLength, auxImageEdgeLength)

    ctx.fillStyle = "black"
    ctx.font = `bold ${auxImageFontPixels}px sans-serif`;

    window.canvasTxt.drawText(ctx, text, {
        width: auxImageEdgeLength - 100,
        height: auxImageEdgeLength - 100,
        x: 50,
        y: 50,
        align: 'center',
        vAlign: 'middle',
        fontSize: 100,
        fontStyle: "bold",
    })

    ctx.textAlign = "right"
    ctx.textBaseline = "bottom"
    ctx.font = `${auxImageFontPixels / 2}px sans-serif`
    ctx.fillText(`${num}/${total}`, auxImageEdgeLength - 20, auxImageEdgeLength - 20)

    return canvas
}
