MyAltTextOrg.const.DEFAULT_PAGE_LANG = 'en'
MyAltTextOrg.const.DEFAULT_PAGE_LANG_HUMAN = 'English'
MyAltTextOrg.const.DEFAULT_ADDTL_IMAGE_TXT = "en"
MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_ISO = "en"
MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_HUMAN = "English"

MyAltTextOrg.i18n.pageText = {
    en: {
        isoCode: "en",
        displayName: "English",
        centralUploadInstr: 'Open File or Paste Image',
        topUploadLbl: 'Open&nbsp;File',
        noLangsFound: 'No supported matching languages found.',
        langButtonPrefixTxt: 'Page',
        langSearchPlaceholder: 'Language',
        pageLangSearchLbl: 'Page&nbsp;Language',
        extractionLangSearchLbl: 'Text&nbsp;Extraction&nbsp;Language',
        extractBtnTxt: 'Extract',
        additionalImageTag: "Alt Text Continued",
        addInFlightBtnTxt: "Add Chunk",
        saveInFlightBtnTxt: "Save All",
        addTranslationTxt: "Add&nbsp;Translation",
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
        closeImage: "Close&nbsp;Image",
        textButtonDemo: "Text Button",
        help: "Help",
        importBtn: "Import",
        importArchiveBtn: "Import&nbsp;My.Alt-Text.org&nbsp;Archive",
        importMastoBtn: "Import&nbsp;Mastodon&nbsp;Archive",
        exportBtn: "Export"
    }
}

MyAltTextOrg.i18n.pageLanguageList = Object.keys(MyAltTextOrg.i18n.pageText)
MyAltTextOrg.i18n.pageLanguageList.sort()
MyAltTextOrg.i18n.pageOptions = {}
Object.entries(MyAltTextOrg.i18n.pageText).forEach(lang => {
    MyAltTextOrg.i18n.pageOptions[lang[1].displayName] = lang[0]
})

MyAltTextOrg.i18n.additionalImageText = {
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

MyAltTextOrg.i18n.isoPageLang = window.navigator.language || MyAltTextOrg.const.DEFAULT_PAGE_LANG
MyAltTextOrg.i18n.defaultText = MyAltTextOrg.i18n.pageText[MyAltTextOrg.const.DEFAULT_PAGE_LANG]

MyAltTextOrg.i18n.localizedLanguageNames= {
    "sl": "Slovenščina",
    "sk": "Slovenčina",
    "ur": "اردو",
    "zh-Hans": "简体中文",
    "zh-Hant": "繁體中文",
    "sw": "Kiswahili",
    "fa-AF": "دری",
    "de-AT": "Österreichisches Deutsch",
    "sd": "سنڌي",
    "uz": "O‘zbek",
    "pl": "Polski",
    "vi": "Tiếng Việt",
    "sq": "Shqip",
    "sv": "Svenska",
    "ga": "Gaeilge",
    "he": "עברית",
    "ms": "Melayu",
    "km": "ខ្មែរ",
    "hy": "հայերեն",
    "am": "አማርኛ",
    "nn": "Norsk Nynorsk",
    "be": "беларуская",
    "da": "Dansk",
    "mr": "मराठी",
    "kk": "қазақ тілі",
    "no": "Norsk",
    "ky": "кыргызча",
    "gu": "ગુજરાતી",
    "mn": "монгол",
    "ja": "日本語",
    "el": "Ελληνικά",
    "ig": "Igbo",
    "lv": "latviešu",
    "it": "Italiano",
    "ca": "Català",
    "is": "íslenska",
    "cs": "čeština",
    "es-MX": "Español de México",
    "te": "తెలుగు",
    "en-AU": "Australian English",
    "ru": "русский",
    "en-GB": "British English",
    "tk": "Türkmen dili",
    "hi-Latn": "Hindi (Latin)",
    "kok": "कोंकणी",
    "ro": "Română",
    "yo": "Èdè Yorùbá",
    "zu": "IsiZulu",
    "yue": "粵語",
    "so": "Soomaali",
    "pt": "Português",
    "ps": "پښتو",
    "fr-CH": "Français suisse",
    "fr-CA": "Français canadien",
    "zh": "中文",
    "uk": "українська",
    "sr": "српски",
    "en-CA": "Canadian English",
    "pcm": "Naijíriá Píjin",
    "pa": "ਪੰਜਾਬੀ",
    "pt-PT": "Português Europeu",
    "si": "සිංහල",
    "ml": "മലയാളം",
    "mk": "македонски",
    "ha": "Hausa",
    "kn": "ಕನ್ನಡ",
    "bs": "Bosanski",
    "my": "မြန်မာ",
    "ar": "العربية",
    "gl": "Galego",
    "hr": "Hrvatski",
    "hu": "Magyar",
    "nl": "Nederlands",
    "bg": "български",
    "bn": "বাংলা",
    "ne": "नेपाली",
    "fil": "Filipino",
    "af": "Afrikaans",
    "nb": "Norsk Bokmål",
    "hi": "हिन्दी",
    "ka": "ქართული",
    "de": "Deutsch",
    "as": "অসমীয়া",
    "az": "azərbaycan",
    "gd": "Gàidhlig",
    "es-419": "español latinoamericano",
    "ko": "한국어",
    "fi": "suomi",
    "id": "Indonesia",
    "fr": "français",
    "es": "español",
    "et": "eesti",
    "en": "English",
    "fa": "فارسی",
    "lt": "lietuvių",
    "or": "ଓଡ଼ିଆ",
    "cy": "Cymraeg",
    "eu": "euskara",
    "lo": "ລາວ",
    "jv": "Jawa",
    "de-CH": "Schweizer Hochdeutsch",
    "ta": "தமிழ்",
    "th": "ไทย",
    "nl-BE": "Vlaams",
    "tr": "Türkçe"
}