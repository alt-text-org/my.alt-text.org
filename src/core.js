async function cropExtractAndAddInFlight() {
    const extractBtn = document.getElementById("extract-btn")

    extractBtn.classList.add("loading")
    let cropped = crop()
    let allExtracted = []
    for (let crop of cropped) {
        let extracted = await extractText(crop);
        extracted.forEach(e => allExtracted.push(e))
    }

    for (let text of allExtracted.reverse()) {
        if (text) {
            addInFlight(text)
        }
    }
    extractBtn.classList.remove("loading")
}

function showSplash() {
    const dialog = document.querySelector("dialog.splash")

    dialog?.showModal()
    dialog?.addEventListener("click", function onclick() {
        dialog.close()
    })
}

function listenForKeys(elem, keys) {
    const keyMap = {}
    keys.forEach(key => {
        keyMap[key.keyCode] = keyMap[key.keyCode] || []
        keyMap[key.keyCode].push(key)
    })

    elem.addEventListener("keyup", (e) => {
        if (e.isComposing) {
            return
        }

        const commandsForKey = keyMap[e.keyCode]
        if (commandsForKey) {
            for (let command of commandsForKey) {
                if (
                    !command.altKey === !e.altKey
                    && !command.ctrlKey === !e.ctrlKey
                    && !command.metaKey === !e.metaKey
                    && !command.shiftKey === !e.shiftKey
                ) {
                    command.invoke()
                }
            }
        }
    })
}

function compareStr(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

function addKeyboardCommand(key, invoke) {
    MyAltTextOrg.cmd.push({
        key,
        invoke
    })
}

function showHelp() {
    const help = document.querySelector(".help-dialog")

    help?.showModal()
    help?.addEventListener("click", () => {
        help.close()
    })
}

function showExecMenu(overlay, button) {
    return () => {
        showEscapable(overlay, true)
        button.click()
    }
}

function focusClick(id) {
    document.getElementById(id).click();
}

function addDots() {
    let openLangMenu = null
    const options = [
        {
            display: "Open&nbsp;File",
            sortKey: "AAA",
            closeMenu: true,
            keyCmd: {
                alt: true,
                keyCode: 79 // O
            },
            makeElement: () => {
                const wrapper = document.createElement("div")
                wrapper.classList.add("file-uploader", "dropdown-option")

                const inputName = "dots-open-file";
                const input = document.createElement("input")
                input.id = inputName
                input.type = "file"
                input.accept = "image/*"
                input.name = inputName
                wrapper.appendChild(input)

                const lbl = document.createElement("label")
                lbl.htmlFor = inputName
                lbl.innerHTML = "Open&nbsp;File"
                wrapper.appendChild(lbl)

                lbl.addEventListener("click", () => input.click())
                input.addEventListener("change", async () => {
                    const file = input.files[0]
                    await loadFile(file)
                })

                return wrapper
            }
        },
        {
            display: "Close&nbsp;File",
            sortKey: "BBB",
            closeMenu: true,
            keyCmd: {
                altKey: true,
                keyCode: 81 // Q
            },
            onclick: clearImage
        },
        {
            display: "Clear&nbsp;Work&nbsp;Area",
            sortKey: "BBC",
            closeMenu: true,
            keyCmd: {
                altKey: true,
                keyCode: 87 // W
            },
            onclick: clearInFlight
        },
        {
          display: "Set&nbsp;Site&nbsp;Colors",
          sortKey: "BBD",
          closeMenu: true,
          onclick: showPaletteChooser
        },
        {
            display: "Page&nbsp;Language",
            closeMenu: false,
            sortKey: "CCC",

            makeElement: () => {
                const button = document.createElement("button")
                button.classList.add("submenu-button")
                button.innerHTML = `
                    <span>Page&nbsp;Language</span>
                    <img src="images/dropdown.svg" class="inline-icon dropdown-img rotated text-svg" aria-hidden="true" alt="">`

                let dropdown = buildSimpleDropdownMenu(
                    button,
                    MyAltTextOrg.i18n.pageOptions,
                    makePageLangFooter(),
                    updatePageLanguage,
                    "side-dropdown"
                )
                dropdown.firstChild.addEventListener("click", () => {
                    if (openLangMenu) {
                        hideEscapable(openLangMenu)
                    }
                    openLangMenu = dropdown.querySelector(".dropdown-content")
                })

                dropdown.classList.add("dropdown-option")
                return dropdown
            }
        },
        {
            display: "Text&nbsp;Extraction&nbsp;Language",
            closeMenu: false,
            sortKey: "DDD",
            makeElement: () => {
                const button = document.createElement("button")
                button.classList.add("submenu-button")
                button.innerHTML = `
                    <span>Text&nbsp;Extraction&nbsp;Language</span>
                    <img src="images/dropdown.svg" class="inline-icon dropdown-img rotated text-svg" aria-hidden="true" alt="">`

                let dropdown = buildSimpleDropdownMenu(
                    button,
                    MyAltTextOrg.tesseract.humanToTesseractLang,
                    null,
                    setExtractionLang,
                    "side-dropdown"
                )
                dropdown.firstChild.addEventListener("click", () => {
                    if (openLangMenu) {
                        hideEscapable(openLangMenu)
                    }
                    openLangMenu = dropdown.querySelector(".dropdown-content")
                })

                dropdown.classList.add("dropdown-option")
                return dropdown
            }
        },
        {
            display: "Help",
            closeMenu: true,
            sortKey: "EEE",
            keyCmd: {
                altKey: true,
                keyCode: 72 // W
            },
            onclick: showHelp,
        },
        {
            display: "Announcements",
            closeMenu: true,
            sortKey: "FFF",
            onclick: showSplash
        }
    ]

    const footer = document.createElement("div")
    footer.classList.add("links")
    footer.innerHTML = `
                <a href="https://alt-text.org" target="_blank"><img class="link-logo" src="images/alt-text-org.svg"
                                                                    alt="Alt-Text.org"></a>
                <a href="https://github.com/alt-text-org/my.alt-text.org" target="_blank"><img class="link-logo"
                                                                                               src="images/github.svg"
                                                                                               alt="GitHub"></a>
                <a href="https://social.alt-text.org/@hannah" target="_blank"><img class="link-logo" src="images/masto.svg"
                                                                                   alt="Mastodon"></a>`

    let button = document.createElement("button")
    button.classList.add("page-button", "dots-btn")
    button.ariaLabel = "General Menu"
    button.innerHTML = `<img id="dots-btn-img" src="images/dots.svg" class="text-svg" alt="" aria-hidden="true" width="32" height="32">`

    const dots = buildComplexDropdownMenu(button, options, footer)
    document.getElementById("dots-btn-placeholder").appendChild(dots)

    MyAltTextOrg.exec.push(...options)
    options.forEach(option => {
        if (!option.keyCmd) {
            return
        }

        let cmd = option.onclick
        if (!cmd) {
            let elem = option.makeElement()
            cmd = () => elem.click()
        }

        addKeyboardCommand(option.keyCmd, cmd)
    })
}

function addWorkAreaButtons () {
    let addBtn = document.createElement("button");
    addBtn.classList.add("page-button", "emoji-button", "large-emoji");
    addBtn.ariaLabel = getLocalized("addInFlightBtnTxt");
    addBtn.textContent = "+";
    addBtn.addEventListener("click", addBlankInFlight);

    let saveBtn = document.createElement("button");
    saveBtn.classList.add("page-button", "emoji-button", "large-emoji");
    saveBtn.ariaLabel = getLocalized("saveInFlightBtnTxt");
    saveBtn.textContent = "💾";
    saveBtn.addEventListener("click", saveAllInFlight);

    const addInFlightContainer = document.getElementById("add-in-flight");
    const inFlightControlsContainer = document.getElementById("in-flight-controls");
    addInFlightContainer.appendChild(addBtn);
    inFlightControlsContainer.appendChild(saveBtn);
}

