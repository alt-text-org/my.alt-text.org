async function hashImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = async function () {
            let hash = await crypto.subtle.digest("SHA-256", reader.result);
            resolve(hash)
        };
    })
}

const additionalImageText = {
    default: "Alt Text Continued",
    ca: "Continuació de la descripció de les imatges",
    de: "Bildbeschreibung fortgesetzt",
    en: "Alt Text Continued",
    es: "Continuación de la descripción de las imágenes",
    fa: "توضیحات عکس ادامه دارد",
    fr: "Description de l'image, suite",
    ja: "画像の説明（続き",
    nl: "Overloop van tekst uit het vorige plaatje",
    pt: "Descrição da imagem continuação"
}

const auxImageEdgeLength = 1000;
const auxImageFontPixels = 100

function getAuxCanvas(lang, num, total) {
    const canvas = document.createElement("canvas")
    canvas.width = auxImageEdgeLength
    canvas.height = auxImageEdgeLength
    const ctx = canvas.getContext('2d');
    const text = (i18nText[lang] || window.MyAltTextOrg.i18n || i18nText[DEFAULT_EXTRACTION_LANG_ISO]).additionalImageTag

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, auxImageEdgeLength, auxImageEdgeLength)

    ctx.fillStyle = "black"
    ctx.font = `bold ${auxImageFontPixels}px sans-serif`;

    window.canvasTxt.fontSize = 100
    window.canvasTxt.fontStyle = "bold"
    window.canvasTxt.align = "center"
    window.canvasTxt.vAlign = "middle"
    window.canvasTxt.drawText(ctx, text, 50, 0, auxImageEdgeLength - 100, auxImageEdgeLength - 100)

    ctx.textAlign = "right"
    ctx.textBaseline = "bottom"
    ctx.font = `${auxImageFontPixels / 2}px sans-serif`
    ctx.fillText(`${num}/${total}`, auxImageEdgeLength - 20, auxImageEdgeLength - 20)

    return canvas
}
