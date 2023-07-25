function buildSimpleDropdownMenu(openMenuButton, options, footer, onSelection, dropdownClass) {
    const complexified = []
    Object.entries(options).forEach(([display, value]) => {
        complexified.push({
            display,
            sortKey: display,
            closeMenu: true,
            makeElement: () => {
                const option = document.createElement("button")
                option.classList.add("dropdown-option")
                option.innerHTML = display
                option.addEventListener("click", () => {
                    onSelection(value)
                })

                return option
            }
        })
    })

    return buildDropdownMenu(openMenuButton, complexified, footer, dropdownClass)
}

function buildComplexDropdownMenu(openMenuButton, options, footer, dropdownClass) {
    const standardized = []
    options.forEach(option => {
        standardized.push({
            display: option.display,
            sortKey: option.sortKey,
            closeMenu: option.closeMenu,
            makeElement: option.makeElement || (() => {
                const optionEle = document.createElement("button")
                optionEle.classList.add("dropdown-option")
                optionEle.innerHTML = option.display
                optionEle.addEventListener("click", () => {
                    option.onclick()
                })

                return optionEle
            })
        })
    })

    return buildDropdownMenu(openMenuButton, standardized, footer, dropdownClass)
}

function buildDropdownMenu(openMenuButton, options, footer, dropdownClass) {
    const activeOptions = []

    options.sort((a, b) => compareStr(a.sortKey, b.sortKey))

    const wrapper = document.createElement("div")
    wrapper.classList.add("dropdown")
    wrapper.appendChild(openMenuButton)

    const dropdown = document.createElement("div")
    dropdown.classList.add("dropdown-content", "openable")
    if (dropdownClass) {
        dropdown.classList.add(dropdownClass)
    }

    const searchWrapper = document.createElement("div")
    searchWrapper.classList.add("search-wrapper", "rounded-top")
    searchWrapper.innerHTML = `<img src="images/magnifying.svg" class="inline-icon" aria-hidden="true" alt="">`

    const search = document.createElement("input")
    search.classList.add("search-input")
    search.type = "text"
    search.placeholder = "Search Options"
    searchWrapper.appendChild(search)

    const dropdownOptions = document.createElement("div")
    dropdownOptions.classList.add("dropdown-options")
    options.forEach(option => {
        let optionEle = option.makeElement();
        option.elem = optionEle
        option.searchable = option.display.toLowerCase().replaceAll(/\s/g, ' ')
        let focusable = getFocusable(optionEle);
        focusable.addEventListener("focus", () => {
            optionEle.classList.add("focused")
        })
        focusable.addEventListener("blur", () => {
            optionEle.classList.remove("focused")
        })



        listenForKeys(focusable, [
            {
                keyCode: 38, // Arrow up
                invoke: () => crawlUp(optionEle, search)
            },
            {
                keyCode: 40, // Arrow down
                invoke: () => crawlDown(optionEle)
            },
        ])

        if (option.closeMenu) {
            optionEle.addEventListener("click", () => hideEscapable())
        }

        dropdownOptions.appendChild(optionEle)
    })
    listenForKeys(search, [
        {
            keyCode: 40, // Arrow down
            invoke: () => crawlDownFrom(dropdownOptions.firstChild)
        },
        {
            keyCode: 13, // Enter
            invoke: () => {
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
    ])

    const notFound = document.createElement("div")
    notFound.classList.add("not-found")
    notFound.innerText = "No menu items found"
    dropdownOptions.appendChild(notFound)

    search.addEventListener("input", (e) => {
        activeOptions.length = 0
        console.log(`Search input: ${e.keyCode}`)

        const searchTerm = search.value.toLowerCase()
        options.forEach(option => {
            if (option.searchable.indexOf(searchTerm) >= 0) {
                activeOptions.push(option)
                option.elem.style.display = "flex"
            } else {
                option.elem.style.display = "none"
            }
        })

        if (activeOptions.length > 0) {
            notFound.style.display = "none"
        } else {
            notFound.style.display = "block"
        }
    })

    dropdown.appendChild(search)
    dropdown.appendChild(dropdownOptions)
    if (footer) {
        dropdown.appendChild(footer)
    } else {
        const padFooter = document.createElement("div")
        padFooter.classList.add("dropdown-footer")
        dropdown.appendChild(padFooter)
    }

    listenForKeys(openMenuButton, [
        {
            keyCode: 39, // Right arrow
            invoke: () => openMenuButton.click()
        }
    ])

    listenForKeys(dropdown, [
        {
            keyCode: 37, // Left arrow
            invoke: () => {
                hideEscapable(dropdown)
                openMenuButton.focus()
            }
        }
    ])

    openMenuButton.addEventListener("click", () => {
        showEscapable(dropdown)
        search.focus()
    })

    wrapper.appendChild(dropdown)
    return wrapper
}

function crawlDown(elem, footer) {
    let next = elem.nextElementSibling
    crawlDownFrom(next, footer)
}

function crawlDownFrom(elem) {
    console.log(`Crawling down: ${elem.tagName}:{${elem.classList}}`)

    while (elem) {
        if (elem.style.display !== "none" && !elem.classList.contains("not-found")) {
            getFocusable(elem)?.focus()
            return
        }
        elem = elem.nextElementSibling
    }
}

function crawlUp(elem, search) {
    let prev = elem.previousElementSibling
    crawlUpFrom(prev, search)
}

function crawlUpFrom(elem, search) {
    while (elem) {
        if (elem.style.display !== "none") {
            getFocusable(elem)?.focus()
            return
        }
        elem = elem.previousElementSibling
    }

    search.focus()
}

function getFocusable(elem) {
    let focusedElement = elem
    if (elem.tagName === "DIV") {
        const innerButton = elem.querySelector("button")
        const innerInput = elem.querySelector("input")
        const innerLink = elem.querySelector("a")
        if (innerButton) {
            focusedElement = innerButton
        } else if (innerInput) {
            focusedElement = innerInput
        } else if (innerLink) {
            focusedElement = innerLink
        } else {
            console.log(`Couldn't find focusable item in:\n${elem.outerHTML}`)
        }
    }

    return focusedElement
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