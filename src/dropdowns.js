addDropdown(
    "page-lang-dropdown",
    "page-lang-btn",
    "page-lang-lbl",
    MyAltTextOrg.i18n.displayName,
    i18nOptions,
    (display, isoLang) => {
        const label = document.getElementById("page-lang-lbl")
        label.innerText = display
        updatePageLanguage(isoLang)
    },
    makePageLangFooter(),
    {
        searchPlaceholder: "langSearchPlaceholder",
        searchLabel: "pageLangSearchLbl",
        notFound: "noLangsFound"
    }
)


addDropdown(
    "extract-lang-dropdown",
    "extract-lang-btn",
    "extract-lang-lbl",
    DEFAULT_EXTRACTION_LANG_HUMAN,
    tesseractLangs,
    async (display, tessLang) => {
        const label = document.getElementById("extract-lang-lbl")
        label.innerText = display
        await setExtractionLang(tessLang)
    },
    null,
    {
        searchPlaceholder: "langSearchPlaceholder",
        searchLabel: "pageLangSearchLbl",
        notFound: "noLangsFound"
    }
)


function addDropdown(
    parentId,
    buttonId,
    buttonLabelId,
    buttonDefault,
    options,
    onSelection,
    footer,
    i18nKeys,
) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("dropdown")

    const openDropdownBtn = document.createElement("button")
    openDropdownBtn.id = buttonId
    openDropdownBtn.classList.add("drop-btn")
    openDropdownBtn.innerHTML =
        `<img src="images/dropdown.svg" class="inline-icon rotated" aria-hidden="true" alt="">`
    const displayVal = document.createElement("span");
    displayVal.id = buttonLabelId
    displayVal.innerText = buttonDefault

    openDropdownBtn.appendChild(displayVal)
    wrapper.appendChild(openDropdownBtn)

    const dropdown = document.createElement("div")
    dropdown.classList.add("dropdown-content")

    const searchWrapper = document.createElement("div")
    searchWrapper.classList.add("search-wrapper", "rounded-top")
    searchWrapper.innerHTML = `<img src="images/dropdown.svg" class="inline-icon" aria-hidden="true" alt="">`

    const dropdownOptions = document.createElement("div")
    dropdownOptions.classList.add("dropdown-options")
    Object.entries(options).forEach(kv => {
        dropdownOptions.appendChild(makeDropdownOption(dropdown, kv[1], kv[0], onSelection))
    })

    const search = document.createElement("input")
    search.classList.add("search-input")
    search.type = "text"
    search.placeholder = registerLocalizedElement(search, "placeholder", i18nKeys.searchPlaceholder)
    search.ariaLabel = registerLocalizedElement(search, "ariaLabel", i18nKeys.searchLabel)
    search.oninput = () => {
        function compare(a, b) {
            if (a[1] < b[1]) {
                return -1;
            } else if (a[1] > b[1]) {
                return 1;
            } else {
                return 0;
            }
        }

        let prefix = search.value.toLowerCase()
        let searchResult = Object.entries(options)
            .filter(kv => kv[0].toLowerCase().startsWith(prefix))
        searchResult.sort(compare)

        dropdownOptions.innerHTML = ""
        if (searchResult.length) {
            searchResult.forEach(kv => {
                dropdownOptions.appendChild(makeDropdownOption(dropdown, kv[1], kv[0], onSelection))
            })
        } else {
            const notFound = document.createElement("div")
            notFound.classList.add("not-found")
            notFound.innerText = getLocalized(i18nKeys.notFound)
            dropdownOptions.appendChild(notFound)
        }
    }

    searchWrapper.appendChild(search)
    dropdown.appendChild(searchWrapper)
    dropdown.appendChild(dropdownOptions)

    if (footer) {
        dropdown.appendChild(footer)
    } else {
        const padFooter = document.createElement("div")
        padFooter.classList.add("dropdown-footer")
        dropdown.appendChild(padFooter)
    }

    openDropdownBtn.onclick = () => {
        showOverlay();
        dropdown.style.visibility = "visible"
        search.focus()
    }
    wrapper.appendChild(dropdown)

    const parent = document.getElementById(parentId)
    parent.appendChild(wrapper)
}

function makeDropdownOption(dropdown, value, display, onClick) {
    const option = document.createElement("button")
    option.classList.add("dropdown-option")
    option.innerText = display
    option.onclick = () => {
        closeDropdowns()
        onClick(display, value)
    }

    return option
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

function closeDropdowns() {
    hideOverlay();
    document.querySelectorAll(".dropdown-content")
        .forEach(elem => elem.style.visibility = "hidden")
}


function makePageLangFooter() {
    const link = document.createElement("a")
    link.classList.add("dropdown-footer")
    link.target = "_blank"
    link.rel = "noreferrer noopener"
    link.href = "https://github.com/alt-text-org/ocrop/issues/new?&template=translation.md&title=%5BTranslation%5D+Language"
    link.innerText = registerLocalizedElement(link, "innerText", "addTranslationTxt")

    return link
}