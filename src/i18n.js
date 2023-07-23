
MyAltTextOrg.i18n.localizableElements = {}

function onElementRemoved(element, callback) {
    new MutationObserver(function() {
        if(!document.body.contains(element)) {
            callback();
            this.disconnect();
        }
    }).observe(element.parentElement, {childList: true});
}

function registerLocalizedElement(elem, elemKey, i18nKey) {
    let localizationId = makeId()
    elem.localizationId = localizationId
    MyAltTextOrg.i18n.localizableElements[localizationId] = {elem, elemKey, i18nKey}
    if (elem.parentElement) {
        onElementRemoved(elem, () => delete MyAltTextOrg.i18n.localizableElements[localizationId]);
    } else {
        console.log(`Can't automate cleanup for elem with i18n key: ${i18nKey}`)
    }

    return getLocalized(i18nKey)
}

function getLocalized(key) {
    return MyAltTextOrg.i18n.current[key]
        || MyAltTextOrg.i18n.pageText[MyAltTextOrg.const.DEFAULT_PAGE_LANG][key]
}

function initPageLanguage(isoLang) {
    MyAltTextOrg.i18n.current = MyAltTextOrg.i18n.pageText[isoLang] || MyAltTextOrg.i18n.pageText[MyAltTextOrg.const.DEFAULT_PAGE_LANG]
}

function updatePageLanguage(isoLang) {
    initPageLanguage(isoLang)
    for (let localizedElem of Object.values(MyAltTextOrg.i18n.localizableElements)) {
        localizedElem.elem[localizedElem.elemKey] = getLocalized(localizedElem.i18nKey)
    }
}
