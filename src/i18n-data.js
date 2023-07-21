const DEFAULT_PAGE_LANG = 'en'
const i18nText = {
    en: {
        displayName: "English",
        uploadInstr: 'Upload File or Paste Image',
        usageInstr: 'Try clicking extract, then manipulate the dashed red box, click extract again and see what change.',
        noLangsFound: 'No supported matching languages found.',
        langButtonPrefixTxt: 'Page',
        langSearchPlaceholder: 'Language',
        extractBtnTxt: 'Extract',
        additionalImageTag: "Alt Text Continued",
        addTranslationTxt: "Add Translation",
        searchPrompt: "Search Your Archive",
        maxLenTxt: "Max Length",
        popupCopyText: "Copy Text",
        popupCopyImage: "Copy Image",
    }
}

const i18nOptions = {}
Object.entries(i18nText).forEach(lang => {
    i18nOptions[lang[1].displayName] = lang[0]
})
const pageLanguageList = Object.keys(i18nOptions)
pageLanguageList.sort()

