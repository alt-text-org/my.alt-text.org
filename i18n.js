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

const tesseractLanguageList = Object.keys(tesseractLangs)
tesseractLanguageList.sort()

const DEFAULT_LANG = 'en'
const i18nText = {
    en: {
        displayName: "English",
        uploadInstr: 'Upload File or Paste Image',
        usageInstr: 'Try clicking extract, then manipulate the dashed red box, click extract again and see what changes 💜',
        extractBtnTxt: 'Extract Text',
        copyBtnTxt: 'Copy',
        copiedTxt: 'Copied!',
        clearBtnTxt: 'Clear',
        extractLangLbl: 'Extraction Language:',
        pageLangLbl: 'Page Language:'
    }
}
const i18nOptions = {}
Object.entries(i18nText).forEach(lang => {
    i18nOptions[lang[1].displayName] = lang[0]
})
const pageLanguageList = Object.keys(i18nOptions)
pageLanguageList.sort()

function openDropdown(elem) {

}

function changePageLanguage() {

}

function filterPageLangs() {

}

async function changeExtractionLanguage() {

}

function filterExtractionLangs() {

}
