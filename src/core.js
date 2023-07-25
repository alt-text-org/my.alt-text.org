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

function addExecCommand(display, onclick, makeElem, keyCombo) {
    if (MyAltTextOrg.cmd[display]) {
        console.log(`Got conflicting commands for ${display}`)
    }

    MyAltTextOrg.cmd[display] = {
        display,
        onclick,
        makeElem,
        keyCombo,
        sortKey: display
    }
}

function showHelp() {
    const help = document.querySelector(".help-dialog")

    help?.showModal()
    help?.addEventListener("click", () => {
        help.close()
    })
}

function focusClick(id) {
    document.getElementById(id).click();
}

function addDots() {
    const options = {
        "Open&nbsp;File": {
            display: "Open&nbsp;File",
            sortKey: "AAA",
            closeMenu: true,
            makeElement: () => {
                const wrapper = document.createElement("div")
                wrapper.classList.add("file-uploader", "dropdown-option")

                const inputName = "dots-open-file";
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.name = inputName
                wrapper.appendChild(input)

                const lbl = document.createElement("label")
                lbl.classList.add("dropdown-option")
                lbl.htmlFor = inputName
                lbl.innerHTML = "Open&nbsp;File"
                wrapper.appendChild(lbl)

                input.addEventListener("change", async () => {
                    const file = input.files[0]
                    await loadFile(file)
                })

                return wrapper
            }
        },
        "Close&nbsp;File": {
            display: "Close&nbsp;File",
            sortKey: "BBB",
            closeMenu: true,
            onclick: () => clearImage()
        },
        "Page&nbsp;Language": {
            display: "Page&nbsp;Language", closeMenu: false, idx: 2, makeElement: () => {
                let dropdown = buildDropdown(
                    "page-lang-btn",
                    "page-lang-lbl",
                    "Page&nbspLanguage",
                    "dropdown-option",
                    "right-side-dropdown",
                    MyAltTextOrg.i18n.pageOptions,
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
                );
                dropdown.classList.add("dropdown-option")
                return dropdown
            }
        }
        ,
        "Text&nbsp;Extraction&nbsp;Language": {
            display: "Text&nbsp;Extraction&nbsp;Language",
            closeMenu: false,
            sortKey: "CCC",
            makeElement: () => {
                let dropdown = buildDropdown(
                    "extract-lang-btn",
                    "extract-lang-lbl",
                    "Text&nbsp;Extraction&nbsp;Language",
                    "dropdown-option",
                    "right-side-dropdown",
                    MyAltTextOrg.tesseract.humanToTesseractLang,
                    async (display, tessLang) => {
                        const label = document.getElementById("extract-lang-lbl")
                        label.innerText = display
                        await setExtractionLang(tessLang)
                    },
                    null,
                    {
                        searchPlaceholder: "langSearchPlaceholder",
                        searchLabel: "extractionLangSearchLbl",
                        notFound: "noLangsFound"
                    }
                );
                dropdown.classList.add("dropdown-option")
                return dropdown
            }
        },
        "Help": {
            display: "Help",
            closeMenu: true,
            sortKey: "DDD",
            onclick: () => showHelp(),
        },
        "Announcements": {
            display: "Announcements",
            closeMenu: true,
            sortKey: "EEE",
            onclick: () => showSplash()
        }
    }

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

    const dotsButton = buildDropdown(
        "dots-btn",
        "dots-lbl",
        `<img id="dots-btn-img" src="images/dots.svg" alt="" aria-hidden="true" width="32" height="32">`,
        "",
        "below-dropdown",
        options,
        () => {
        },
        footer,
        {},
        true
    )

    document.getElementById("dots-btn-wrapper").appendChild(dotsButton)
}

