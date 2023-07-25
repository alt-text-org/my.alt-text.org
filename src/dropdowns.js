

function buildDropdown(
    buttonId,
    buttonLabelId,
    buttonDefault,
    openButtonClass,
    dropdownClass,
    options,
    onSelection,
    footer,
    i18nKeys,
    skipArrow,
) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("dropdown")

    const openDropdownBtn = document.createElement("button")
    openDropdownBtn.id = buttonId
    if (openButtonClass) {
        openDropdownBtn.classList.add("drop-btn", openButtonClass)
    } else {
        openDropdownBtn.classList.add("drop-btn")
    }
    if (!skipArrow) {
        openDropdownBtn.innerHTML =
            `<img src="images/dropdown.svg" width="10" height="6" class="dropdown-img rotated text-color-svg" aria-hidden="true" alt="">`
    }
    const displayVal = document.createElement("span");
    displayVal.id = buttonLabelId
    displayVal.innerHTML = buttonDefault

    openDropdownBtn.prepend(displayVal)
    wrapper.appendChild(openDropdownBtn)

    const dropdown = document.createElement("div")
    dropdown.classList.add("dropdown-content", "openable", dropdownClass)

    const searchWrapper = document.createElement("div")
    searchWrapper.classList.add("search-wrapper", "rounded-top")

    const search = document.createElement("input")
    const dropdownOptions = document.createElement("div")
    dropdownOptions.classList.add("dropdown-options")
    Object.entries(options).forEach(([display, val]) => {
        dropdownOptions.appendChild(makeDropdownOption(dropdown, val, display, onSelection))
    })

    search.addEventListener("keyup", (e) => {
        if (e.isComposing) {
            return
        }

        if (e.keyCode === 40) { // Arrow down
            const firstOption = dropdownOptions.firstChild
            if (firstOption) {
                firstOption.focus()
            }
        }
    })

    if (footer) {
        footer.addEventListener("keyup", (e) => {
            if (e.isComposing) {
                return
            }

            if (e.keyCode === 38) { // Arrow up
                const lastOption = dropdownOptions.lastChild
                if (lastOption) {
                    lastOption.focus()
                }
            }
        })
    }

    let activeOptions = {}
    search.classList.add("search-input")
    search.type = "text"
    search.oninput = () => {
        function compareStr(a, b) {
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        }

        let searchTerm = search.value.toLowerCase()
        let searchResult = Object.entries(options)
            .filter(([display, _]) => display.toLowerCase().indexOf(searchTerm) >= 0)

        if (searchResult.length > 0) {
            if (typeof searchResult[0] === 'string') {
                searchResult.sort((a, b) => {
                    return compareStr(a[0], b[0]);
                })
            } else {
                searchResult.sort(([_, objA], [__, objB]) => {
                    return compareStr(objA.sortKey || objA.display, objB.sortKey || objB.display);
                })
            }
        }


        dropdownOptions.innerHTML = ""
        activeOptions = {}
        if (searchResult.length) {
            searchResult.forEach(([display, value]) => {
                let option = makeDropdownOption(dropdown, value, display, onSelection);
                activeOptions[display.toLowerCase()] = option
                dropdownOptions.appendChild(option)
            })
        } else {
            const notFound = document.createElement("div")
            notFound.classList.add("not-found")
            notFound.innerHTML = getLocalized(i18nKeys.notFound)
            dropdownOptions.appendChild(notFound)
        }
    }
    search.onkeyup = (e) => {
        if (e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return
        }

        if (e.keyCode === 13) {
            let searchTerm = search.value.toLowerCase()
            if (activeOptions[searchTerm]) {
                activeOptions[searchTerm].click()
                return
            }

            let searchResult = Object.entries(activeOptions)
                .filter(kv => kv[0].toLowerCase().indexOf(searchTerm) >= 0)
                .map(kv => kv[1])

            if (searchResult.length === 1) {
                searchResult[0].click()
            }
        }
    }

    searchWrapper.innerHTML = `<img src="images/magnifying.svg" class="inline-icon" aria-hidden="true" alt="">`
    searchWrapper.appendChild(search)
    search.placeholder = "Search Options"//registerLocalizedElement(search, "placeholder", i18nKeys.searchPlaceholder)
    search.ariaLabel = registerLocalizedElement(search, "ariaLabel", i18nKeys.searchLabel)

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
        showEscapable(dropdown)
        search.focus()
    }
    openDropdownBtn.addEventListener("keyup", (e) => {
        if (e.isComposing) {
            return
        }

        if (e.keyCode === 39) { // Right arrow
            openDropdownBtn.click()
        }
    })

    dropdown.addEventListener("keyup", (e) => {
        if (e.isComposing) {
            return
        }

        if (e.keyCode === 37) { // Left arrow
            hideEscapable(dropdown)
            openDropdownBtn.focus()
        }
    })


    wrapper.appendChild(dropdown)

    return wrapper
}

function makeDropdownOption(val, display, onClick, search, footer) {

    let ele
    if (typeof val === "string") {
        ele = makeBasicDropdownOption(display);
    } else {
        if (val.makeElement) {
            ele = val.makeElement(display)
        } else {
            ele = makeBasicDropdownOption(val.display);
        }
    }

    ele.addEventListener("keyup", (e) => {
        if (e.isComposing) {
            return
        }

        if (e.keyCode === 38) { // Arrow up
            if (ele.previousElementSibling) {
                ele.previousElementSibling.focus()
            } else {
                search.focus()
            }
        } else if (e.keyCode === 40) { // Arrow down
            if (ele.nextElementSibling) {
                ele.nextElementSibling.focus()
            } else if (footer) {
                footer.focus()
            }
        }
    })

    if (typeof val === "string") {
        ele.onclick = () => {
            hideEscapable()
            onClick(display, val)
        }
    } else if (val.onclick) {
        ele.onclick = () => {
            if (val.closeMenu) {
                hideEscapable()
            }
            val.onclick()
        }
    } else {

    }
}

function makeBasicDropdownOption(display) {
    const option = document.createElement("button")
    option.classList.add("dropdown-option")
    option.innerHTML = display

    return option
}

const toEscape = []
function showEscapable(elem, skipOverlay) {
    if (!skipOverlay) {
        const overlay = document.getElementById("overlay");
        overlay.classList.add("open");
    }
    elem.classList.add("open");
    toEscape.push(elem)
}

function hideEscapable(elem) {
    const overlay = document.getElementById("overlay");
    if (elem) {
        elem.classList.remove("open")
    } else {
        overlay.classList.remove("open");
        toEscape.forEach(elem => {
            if (elem) {
                elem.classList.remove("open")
            }
        })
        toEscape.length = 0
    }

}

function makePageLangFooter() {
    const link = document.createElement("a")
    link.classList.add("dropdown-footer")
    link.target = "_blank"
    link.rel = "noreferrer noopener"
    link.href = "https://github.com/alt-text-org/ocrop/issues/new?&template=translation.md&title=%5BTranslation%5D+Language"
    link.innerHTML = registerLocalizedElement(link, "innerHTML", "addTranslationTxt")

    return link
}