import { MyAltTextOrg } from "./first.js"

export async function hashImage(file) {
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

MyAltTextOrg.const.AUX_IMG_EDGE_PX = 1000;
MyAltTextOrg.const.AUX_IMG_FONT_PX = 100

function getAuxCanvas(lang, num, total) {
    const canvas = document.createElement("canvas")
    canvas.width = MyAltTextOrg.const.AUX_IMG_EDGE_PX
    canvas.height = MyAltTextOrg.const.AUX_IMG_EDGE_PX
    const ctx = canvas.getContext('2d');
    const text = MyAltTextOrg.i18n.additionalImageText[lang]
        || MyAltTextOrg.i18n.additionalImageText[MyAltTextOrg.const.DEFAULT_ADDTL_IMAGE_TXT]

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, MyAltTextOrg.const.AUX_IMG_EDGE_PX, MyAltTextOrg.const.AUX_IMG_EDGE_PX)

    ctx.fillStyle = "black"
    ctx.font = `bold ${MyAltTextOrg.const.AUX_IMG_FONT_PX}px sans-serif`;

    window.canvasTxt.drawText(ctx, text, {
        width: MyAltTextOrg.const.AUX_IMG_EDGE_PX - 100,
        height: MyAltTextOrg.const.AUX_IMG_EDGE_PX - 100,
        x: 50,
        y: 50,
        align: 'center',
        vAlign: 'middle',
        fontSize: 100,
        fontStyle: "bold",
    })

    ctx.textAlign = "right"
    ctx.textBaseline = "bottom"
    ctx.font = `${MyAltTextOrg.const.AUX_IMG_FONT_PX / 2}px sans-serif`
    ctx.fillText(`${num}/${total}`, MyAltTextOrg.const.AUX_IMG_EDGE_PX - 20, MyAltTextOrg.const.AUX_IMG_EDGE_PX - 20)

    return canvas
}
