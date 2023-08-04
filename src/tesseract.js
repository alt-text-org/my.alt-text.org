import { MyAltTextOrg } from "./first.js"

export async function initOcr() {
    const isoExtractionLang =
        (window.navigator.language || MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_ISO).split('-')[0]

    const initialExtractionLang = MyAltTextOrg.tesseract.iso639_2ToTesseract[isoExtractionLang]
        || MyAltTextOrg.tesseract.iso639_2ToTesseract[MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_ISO]

    const worker = await Tesseract.createWorker();
    await worker.loadLanguage(initialExtractionLang);
    await worker.initialize(initialExtractionLang);

    MyAltTextOrg.tesseract.worker = worker
}

export async function extractText(dataUrl) {
    const {data: {text}} = await MyAltTextOrg.tesseract.worker.recognize(dataUrl);
    MyAltTextOrg.currImage.lang = MyAltTextOrg.tesseract.isoLang
    return [text]
}

export async function setExtractionLang(tesseractCode) {
    await MyAltTextOrg.tesseract.worker.loadLanguage(tesseractCode);
    await MyAltTextOrg.tesseract.worker.initialize(tesseractCode);
}

MyAltTextOrg.tesseract.humanToTesseractLang = {
    'Afrikaans': 'afr',
    'Amharic': 'amh',
    'Arabic': 'ara',
    'Assamese': 'asm',
    'Azerbaijani': 'aze',
    'Azerbaijani, Cyrillic': 'aze_cyrl',
    'Belarusian': 'bel',
    'Bengali': 'ben',
    'Tibetan': 'bod',
    'Bosnian': 'bos',
    'Bulgarian': 'bul',
    'Catalan': 'cat',
    'Cebuano': 'ceb',
    'Czech': 'ces',
    'Chinese, Simplified': 'chi_sim',
    'Chinese, Traditional': 'chi_tra',
    'Cherokee': 'chr',
    'Welsh': 'cym',
    'Danish': 'dan',
    'German': 'deu',
    'Dzongkha': 'dzo',
    'Greek, Modern': 'ell',
    'English': 'eng',
    'English, Middle': 'enm',
    'Esperanto': 'epo',
    'Estonian': 'est',
    'Basque': 'eus',
    'Persian': 'fas',
    'Finnish': 'fin',
    'French': 'fra',
    'Frankish': 'frk',
    'French, Middle': 'frm',
    'Irish': 'gle',
    'Galician': 'glg',
    'Greek, Ancient': 'grc',
    'Gujarati': 'guj',
    'Haitian': 'hat',
    'Hebrew': 'heb',
    'Hindi': 'hin',
    'Croatian': 'hrv',
    'Hungarian': 'hun',
    'Inuktitut': 'iku',
    'Indonesian': 'ind',
    'Icelandic': 'isl',
    'Italian': 'ita',
    'Italian, Old': 'ita_old',
    'Javanese': 'jav',
    'Japanese': 'jpn',
    'Kannada': 'kan',
    'Georgian': 'kat',
    'Georgian, Old': 'kat_old',
    'Kazakh': 'kaz',
    'Khmer, Central': 'khm',
    'Kirghiz': 'kir',
    'Korean': 'kor',
    'Kurdish': 'kur',
    'Lao': 'lao',
    'Latin': 'lat',
    'Latvian': 'lav',
    'Lithuanian': 'lit',
    'Malayalam': 'mal',
    'Marathi': 'mar',
    'Macedonian': 'mkd',
    'Maltese': 'mlt',
    'Malay': 'msa',
    'Burmese': 'mya',
    'Nepali': 'nep',
    'Flemish': 'nld',
    'Dutch': 'nld',
    'Norwegian': 'nor',
    'Oriya': 'ori',
    'Panjabi': 'pan',
    'Punjabi': 'pan',
    'Polish': 'pol',
    'Portuguese': 'por',
    'Pushto': 'pus',
    'Pashto': 'pus',
    'Moldovan': 'ron',
    'Moldavian': 'ron',
    'Romanian': 'ron',
    'Russian': 'rus',
    'Sanskrit': 'san',
    'Sinhala': 'sin',
    'Sinhalese': 'sin',
    'Slovak': 'slk',
    'Slovenian': 'slv',
    'Spanish': 'spa',
    'Castilian': 'spa',
    'Spanish, Old': 'spa_old',
    'Albanian': 'sqi',
    'Serbian': 'srp',
    'Serbian, Latin': 'srp_latn',
    'Swahili': 'swa',
    'Swedish': 'swe',
    'Syriac': 'syr',
    'Tamil': 'tam',
    'Telugu': 'tel',
    'Tajik': 'tgk',
    'Tagalog': 'tgl',
    'Thai': 'tha',
    'Tigrinya': 'tir',
    'Turkish': 'tur',
    'Uighur': 'uig',
    'Uyghur': 'uig',
    'Ukrainian': 'ukr',
    'Urdu': 'urd',
    'Uzbek': 'uzb',
    'Uzbek, Cyrillic': 'uzb_cyrl',
    'Vietnamese': 'vie',
    'Yiddish': 'yid',
}

MyAltTextOrg.tesseract.iso639_2ToTesseract = {
    'af': 'afr',
    'am': 'amh',
    'ar': 'ara',
    'as': 'asm',
    'az': 'aze',
    'be': 'bel',
    'bn': 'ben',
    'bo': 'bod',
    'bs': 'bos',
    'bg': 'bul',
    'ca': 'cat',
    'cs': 'ces',
    'cy': 'cym',
    'da': 'dan',
    'de': 'deu',
    'de-AT': 'deu',
    'de-CH': 'deu',
    'dz': 'dzo',
    'el': 'ell',
    'en': 'eng',
    'eo': 'epo',
    'es': 'spa',
    'es-MX': 'spa',
    'et': 'est',
    'eu': 'eus',
    'fa': 'fas',
    'fa-AF': 'fas',
    'fi': 'fin',
    'fr': 'fra',
    'fr-CA': 'fra',
    'ga': 'gle',
    'gl': 'glg',
    'gu': 'guj',
    'ht': 'hat',
    'he': 'heb',
    'hi': 'hin',
    'hr': 'hrv',
    'hu': 'hun',
    'iu': 'iku',
    'id': 'ind',
    'is': 'isl',
    'it': 'ita',
    'jv': 'jav',
    'ja': 'jpn',
    'kn': 'kan',
    'ka': 'kat',
    'kk': 'kaz',
    'km': 'khm',
    'ky': 'kir',
    'ko': 'kor',
    'ku': 'kur',
    'lo': 'lao',
    'la': 'lat',
    'lv': 'lav',
    'lt': 'lit',
    'ml': 'mal',
    'mr': 'mar',
    'mk': 'mkd',
    'mt': 'mlt',
    'ms': 'msa',
    'my': 'mya',
    'ne': 'nep',
    'nl': 'nld',
    'nl-BE': 'nld',
    'no': 'nor',
    'or': 'ori',
    'pa': 'pan',
    'pl': 'pol',
    'pt': 'por',
    'ps': 'pus',
    'ro': 'ron',
    'ru': 'rus',
    'sa': 'san',
    'si': 'sin',
    'sk': 'slk',
    'sl': 'slv',
    'sq': 'sqi',
    'sr': 'srp',
    'sw': 'swa',
    'sv': 'swe',
    'ta': 'tam',
    'te': 'tel',
    'tg': 'tgk',
    'tl': 'tgl',
    'th': 'tha',
    'ti': 'tir',
    'tr': 'tur',
    'ug': 'uig',
    'uk': 'ukr',
    'ur': 'urd',
    'uz': 'uzb',
    'vi': 'vie',
    'yi': 'yid',
    'zh-Hans': 'chi_sim',
    "zh-Hant": 'chi_tra'
}

Object.entries(MyAltTextOrg.i18n.localizedLanguageNames).forEach(([isoLang, localName]) => {
    if (MyAltTextOrg.tesseract.iso639_2ToTesseract[isoLang]) {
        MyAltTextOrg.tesseract.humanToTesseractLang[localName] = MyAltTextOrg.tesseract.iso639_2ToTesseract[isoLang]
    }
})

MyAltTextOrg.tesseract.tesseractToIso639_2 = {}
for (let [iso, tess] of Object.entries(MyAltTextOrg.tesseract.iso639_2ToTesseract)) {
    MyAltTextOrg.tesseract.tesseractToIso639_2[tess] = iso
}
MyAltTextOrg.tesseract.tesseractLanguageList = Object.keys(MyAltTextOrg.tesseract.humanToTesseractLang)
MyAltTextOrg.tesseract.isoTesseractLang = window.navigator.language || MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_ISO
MyAltTextOrg.tesseract.isoLang = MyAltTextOrg.tesseract.iso639_2ToTesseract[MyAltTextOrg.tesseract.isoTesseractLang]
    ? MyAltTextOrg.tesseract.isoTesseractLang
    : MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_ISO

