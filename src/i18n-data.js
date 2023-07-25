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
