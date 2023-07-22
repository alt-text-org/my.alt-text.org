const uploadLbl = document.getElementById("upload-label")
const currPageLangEle = document.getElementById("current-page-lang")
const filterInput = document.getElementById("filter-input")
const translationLink = document.getElementById('add-translation-link')
const topUploadLbl = document.getElementById('open-file-lbl')
const closeImgBtn = document.getElementById('clear-image')

const pageLangOptionsEle = document.getElementById("page-lang-options")
const pageLangText = document.getElementById("page-lang-text")
const pageLangDropdown = document.getElementById("page-lang-dropdown")

// const extractionLangEle = document.getElementById("")

populateDropdowns()
updatePageLanguage()

function populateDropdowns() {
    pageLanguageList.forEach(humanLang => {
        const langCode = i18nOptions[humanLang]
        addDropdownOption(pageLangOptionsEle, langCode, humanLang, () => {
            MyAltTextOrg.i18n = i18nText[langCode]
            
            pageLangDropdown.style.visibility = "hidden"
            updatePageLanguage()
        })
    })

    // tesseractLanguageList.forEach(humanLang => {
    //     const langCode = tesseractLangs[humanLang]
    //     addDropdownOption(extractionLangEle)
    // })
}

function getLocalized(key) {
    return MyAltTextOrg.i18n[key] || i18nText[DEFAULT_PAGE_LANG][key]
}

function addDropdownOption(ele, langCode, humanLang, onClick) {
    const option = document.createElement("button")
    option.classList.add("dropdown-option")
    option.innerText = humanLang
    option.onclick = () => onClick()
    ele.appendChild(option)
}

function showOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block"
    overlay.classList.add("visible");
}

function hideOverlay() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none"
    overlay.classList.remove("visible");
}

function openDropdown(id, search) {
    showOverlay();
    const elem = document.getElementById(id)
    elem.style.visibility = "visible"

    const searchInput = document.getElementById(search)
    searchInput.focus()
}

function closeDropdown() {
    hideOverlay();
    // hardcode closing second dropdown here
    const elem = document.getElementById('page-lang-dropdown')
    elem.style.visibility = "hidden"
}

function updatePageLanguage() {
    translationLink.innerText = getLocalized("addTranslationTxt")
    currPageLangEle.innerText = `${getLocalized("langButtonPrefixTxt")}: ${getLocalized("displayName")}`
    extractBtn.innerText = getLocalized("extractBtnTxt")
    uploadLbl.innerText = getLocalized("centralUploadInstr")
    topUploadLbl.innerText = getLocalized("topUploadLbl")
    filterInput.placeholder = getLocalized("searchPrompt")
    closeImgBtn.innerText = getLocalized('closeImage')
    
    for (let inFlightName of document.querySelectorAll('.name-input')) {
        inFlightName.placeholder = getLocalized("untitledName")
        inFlightName.ariaLabel = getLocalized("nameLabel")
    }

    for (let textArea of document.querySelectorAll('.in-flight-text')) {
        textArea.ariaLabel = getLocalized("inFlightItemTextArea")
    }

}

function filterPageLangs() {
    let prefix = pageLangText.value.toLowerCase()
    let foundLanguages = pageLanguageList.filter(humanName => humanName.toLowerCase().startsWith(prefix))

    pageLangOptionsEle.innerHTML = ""
    if (foundLanguages.length) {
        foundLanguages.forEach(humanLang => {
            const langCode = i18nOptions[humanLang]
            addDropdownOption(pageLangOptionsEle, langCode, humanLang, () => {
                MyAltTextOrg.i18n = i18nText[langCode]
                pageLangDropdown.hidden = true
                updatePageLanguage()
            })
        })
    } else {
        const noLangFound = document.createElement("div")
        noLangFound.classList.add("no-lang-found")
        noLangFound.innerText = MyAltTextOrg.i18n.noLangsFound || MyAltTextOrg.defaultI18.noLangsFound
        pageLangOptionsEle.appendChild(noLangFound)
    }
}

async function updateExtractionLanguage(langCode) {

}

function filterExtractionLangs() {

}
