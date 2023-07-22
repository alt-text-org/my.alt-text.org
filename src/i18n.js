const uploadLbl = document.getElementById("upload-label")
const currPageLangEle = document.getElementById("current-page-lang")
const filterInput = document.getElementById("filter-input")
const translationLink = document.getElementById('add-translation-link')
const topUploadLbl = document.getElementById('open-file-lbl')
const closeImgBtn = document.getElementById('clear-image')

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
    extractBtn.innerText = registerLocalizedElement(extractBtn, "innerText", "extractBtnTxt")
    uploadLbl.innerText = registerLocalizedElement(uploadLbl, "innerText", "centralUploadInstr")
    topUploadLbl.innerText = registerLocalizedElement(topUploadLbl, "innerText", "topUploadLbl")
    filterInput.placeholder = registerLocalizedElement(filterInput, "placeholder", "searchPrompt")
    closeImgBtn.innerText = registerLocalizedElement(closeImgBtn, "innerText", 'closeImage')
}