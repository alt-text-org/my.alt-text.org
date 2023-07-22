const uploadLbl = document.getElementById("upload-label")
const filterInput = document.getElementById("filter-input")
const topUploadLbl = document.getElementById('open-file-lbl')
const closeImgBtn = document.getElementById('clear-image')
const pageLangName = document.getElementById("page-lang-name")
const helpBtn = document.getElementById("help-button")

const localizableElements = []
registerLocalizableStatics()

function registerLocalizedElement(elem, elemKey, i18nKey) {
    localizableElements.push({elem, elemKey, i18nKey})
    return getLocalized(i18nKey)
}

function getLocalized(key) {
    return MyAltTextOrg.i18n[key] || i18nText[DEFAULT_PAGE_LANG][key]
}

function updatePageLanguage(isoLang) {
    MyAltTextOrg.i18n = i18nText[isoLang] || i18nText[DEFAULT_PAGE_LANG]
    for (let localizedElem of localizableElements) {
        localizedElem.elem[localizedElem.elemKey] = getLocalized(localizedElem.i18nKey)
    }
}

async function updateExtractionLanguage(langCode) {

}

function registerLocalizableStatics() {
    helpBtn.innerText = registerLocalizedElement(helpBtn, "innerText", "help")
    pageLangName.innerText = registerLocalizedElement(pageLangName, "innerText", "langButtonPrefixTxt")
    extractBtn.innerText = registerLocalizedElement(extractBtn, "innerText", "extractBtnTxt")
    uploadLbl.innerText = registerLocalizedElement(uploadLbl, "innerText", "centralUploadInstr")
    topUploadLbl.innerText = registerLocalizedElement(topUploadLbl, "innerText", "topUploadLbl")
    filterInput.placeholder = registerLocalizedElement(filterInput, "placeholder", "searchPrompt")
    closeImgBtn.innerText = registerLocalizedElement(closeImgBtn, "innerText", 'closeImage')
}