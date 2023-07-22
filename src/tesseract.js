initOcr()

async function initOcr() {
    const isoExtractionLang = window.navigator.language || DEFAULT_EXTRACTION_LANG_ISO
    const initialExtractionLang = iso639_2ToTesseract[isoExtractionLang] || iso639_2ToTesseract[DEFAULT_EXTRACTION_LANG_ISO]

    const worker = await Tesseract.createWorker();
    await worker.loadLanguage(initialExtractionLang);
    await worker.initialize(initialExtractionLang);

    MyAltTextOrg.tesseract = {
        worker
    }
}

async function extractText(dataUrl) {
    const {data: {text}} = await MyAltTextOrg.tesseract.worker.recognize(dataUrl);
    MyAltTextOrg.currImage.lang = MyAltTextOrg.tesseract.isoLang
    return [text]
}

async function setExtractionLang(tesseractCode) {
    await MyAltTextOrg.tesseract.worker.loadLanguage(tesseractCode);
    await MyAltTextOrg.tesseract.worker.initialize(tesseractCode);
}
