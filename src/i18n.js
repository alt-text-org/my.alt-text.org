const pageLangOptionsEle = document.getElementById("page-lang-options")
const pageLangBtn = document.getElementById("page-lang-btn")
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
            pageLangDropdown.hidden = true
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

function openDropdown(id) {
    const elem = document.getElementById(id)
    elem.style.hidden = false
}

const extractBtn = document.getElementById("extract-btn")
const uploadLbl = document.getElementById("upload-label")
const explanationEle = document.getElementById("explanation")
const currPageLangEle = document.getElementById("current-page-lang")
function updatePageLanguage() {
    currPageLangEle.innerText = window.i18n.displayName
    extractBtn.innerText = window.i18n.extractBtnTxt
    uploadLbl.innerText = window.i18n.uploadInstr
    explanationEle.innerText = window.i18n.usageInstr
}

function filterPageLangs() {
    let prefix = pageLangText.value.toLowerCase()
    let foundLanguages = pageLanguageList.filter(humanName => humanName.toLowerCase().startsWith(prefix))

    pageLangOptionsEle.innerHTML = ""
    if (foundLanguages.length) {
        foundLanguages.forEach(humanLang => {
            const langCode = i18nOptions[humanLang]
            addDropdownOption(pageLangOptionsEle, )
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
