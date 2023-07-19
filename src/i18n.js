const uploadLbl = document.getElementById("upload-label")
const explanationEle = document.getElementById("explanation")
const currPageLangEle = document.getElementById("current-page-lang")
const filterInput = document.getElementById("filter-input")
const translationLink = document.getElementById('add-translation-link')

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
            window.i18n = i18nText[langCode]
            pageLangDropdown.style.visibility = "hidden"
            updatePageLanguage()
        })
    })

    // tesseractLanguageList.forEach(humanLang => {
    //     const langCode = tesseractLangs[humanLang]
    //     addDropdownOption(extractionLangEle)
    // })
}

function addDropdownOption(ele, langCode, humanLang, onClick) {
    const option = document.createElement("button")
    option.classList.add("dropdown-option")
    option.innerText = humanLang
    option.onclick = () => onClick()
    ele.appendChild(option)
}

function openDropdown(id, search, mask) {
    const elem = document.getElementById(id)
    elem.style.visibility = "visible"

    const maskEle = document.getElementById(mask)
    maskEle.style.visibility = "visible"

    const searchInput = document.getElementById(search)
    searchInput.focus()
}

function closeDropdown(id, mask) {
    const elem = document.getElementById(id)
    elem.style.visibility = "hidden"

    const maskEle = document.getElementById(mask)
    maskEle.style.visibility = "hidden"
}

function updatePageLanguage() {
    translationLink.innerText = window.i18n.addTranslationTxt
    currPageLangEle.innerText = window.i18n.displayName
    extractBtn.innerText = window.i18n.extractBtnTxt
    uploadLbl.innerText = window.i18n.uploadInstr
    explanationEle.innerText = window.i18n.usageInstr
    filterInput.placeholder = window.i18n.searchPrompt
}

function filterPageLangs() {
    let prefix = pageLangText.value.toLowerCase()
    let foundLanguages = pageLanguageList.filter(humanName => humanName.toLowerCase().startsWith(prefix))

    pageLangOptionsEle.innerHTML = ""
    if (foundLanguages.length) {
        foundLanguages.forEach(humanLang => {
            const langCode = i18nOptions[humanLang]
            addDropdownOption(pageLangOptionsEle, langCode, humanLang, () => {
                window.i18n = i18nText[langCode]
                pageLangDropdown.hidden = true
                updatePageLanguage()
            })
        })
    } else {
        const noLangFound = document.createElement("div")
        noLangFound.classList.add("no-lang-found")
        noLangFound.innerText = window.i18n.noLangsFound
        pageLangOptionsEle.appendChild(noLangFound)
    }
}

async function updateExtractionLanguage(langCode) {

}

function filterExtractionLangs() {

}
