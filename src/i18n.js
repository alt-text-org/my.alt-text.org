const uploadLbl = document.getElementById("upload-label")
const filterInput = document.getElementById("filter-input")
const topUploadLbl = document.getElementById('open-file-lbl')
const closeImgBtn = document.getElementById('clear-image')
const pageLangName = document.getElementById("page-lang-name")
const helpBtn = document.getElementById("help-button")

const localizableElements = {}
registerLocalizableStatics()

function onElementRemoved(element, callback) {
    new MutationObserver(function(mutations) {
        if(!document.body.contains(element)) {
            callback();
            this.disconnect();
        }
    }).observe(element.parentElement, {childList: true});
}

function registerLocalizedElement(elem, elemKey, i18nKey) {
    let localizationId = makeId()
    elem.localizationId = localizationId
    localizableElements[localizationId] = {elem, elemKey, i18nKey}
    if (elem.parentElement) {
        onElementRemoved(elem, function() {
            delete localizableElements[localizationId]
        });
    } else {
        console.log(`Can't automate cleanup for elem with i18n key: ${i18nKey}`)
    }

    return getLocalized(i18nKey)
}

function getLocalized(key) {
    return MyAltTextOrg.i18n[key] || i18nText[DEFAULT_PAGE_LANG][key]
}

function updatePageLanguage(isoLang) {
    MyAltTextOrg.i18n = i18nText[isoLang] || i18nText[DEFAULT_PAGE_LANG]
    for (let localizedElem of Object.values(localizableElements)) {
        localizedElem.elem[localizedElem.elemKey] = getLocalized(localizedElem.i18nKey)
    }
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