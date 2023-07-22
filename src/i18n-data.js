const DEFAULT_PAGE_LANG = 'en'
const DEFAULT_ADDTL_IMAGE_TXT = "en"
const DEFAULT_EXTRACTION_LANG_ISO = "en"
const DEFAULT_EXTRACTION_LANG_HUMAN = "English"

const i18nText = {
    en: {
        isoCode: "en",
        displayName: "English",
        centralUploadInstr: 'Open File or Paste Image',
        topUploadLbl: 'Open File',
        noLangsFound: 'No supported matching languages found.',
        langButtonPrefixTxt: 'Page',
        langSearchPlaceholder: 'Language',
        pageLangSearchLbl: 'Page Language',
        extractBtnTxt: 'Extract',
        additionalImageTag: "Alt Text Continued",
        addTranslationTxt: "Add Translation",
        searchPrompt: "Search Your Archive",
        maxLenTxt: "Max Length",
        popupCopyText: "Copy Text",
        popupCopyImage: "Copy Image",
        untitledName: "Untitled",
        nameLabel: "Chunk name",
        inFlightItemTextArea: "Chunk text",
        deleteChunk: "Delete Chunk",
        saveChunk: "Save Chunk",
        copyChunk: "Copy Chunk",
        closeImage: "Close Image",
        textButtonDemo: "Text Button",
        help: "Help",
        importBtn: "Import",
        exportBtn: "Export"
    }
}

const i18nOptions = {}
const pageLanguageList = Object.keys(i18nOptions)
Object.entries(i18nText).forEach(lang => i18nOptions[lang[1].displayName] = lang[0])
pageLanguageList.sort()

const additionalImageText = {
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


const tesseractLangs = {
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

const iso639_2ToTesseract = {
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
    'zh': 'chi_sim',
    'cy': 'cym',
    'da': 'dan',
    'de': 'deu',
    'dz': 'dzo',
    'el': 'ell',
    'en': 'eng',
    'eo': 'epo',
    'et': 'est',
    'eu': 'eus',
    'fa': 'fas',
    'fi': 'fin',
    'fr': 'fra',
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
    'es': 'spa',
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
}

const tesseractToIso639_2 = {}
for (let [iso, tess] of Object.entries(iso639_2ToTesseract)) {
    tesseractToIso639_2[tess] = iso
}

const tesseractLanguageList = Object.keys(tesseractLangs)
tesseractLanguageList.sort()

const isoPageLang = window.navigator.language || DEFAULT_PAGE_LANG
MyAltTextOrg.i18n = i18nText[isoPageLang] || i18nText[DEFAULT_PAGE_LANG]
MyAltTextOrg.defaultI18n = i18nText[DEFAULT_PAGE_LANG]

const isoTesseractLang = window.navigator.language || DEFAULT_EXTRACTION_LANG_ISO
MyAltTextOrg.tesseract.isoLang = iso639_2ToTesseract[isoTesseractLang] ? isoTesseractLang : DEFAULT_EXTRACTION_LANG_ISO
