(async () => {
    const CURRENT_SPLASH = 1;

    await initOcr()
    // await initStoredImage()

    let userLang = window.navigator.language.split('-')[0];
    updatePageLanguage(MyAltTextOrg.i18n.pageText[userLang] ? userLang : MyAltTextOrg.const.DEFAULT_PAGE_LANG)
    initializeSearch()
    updateDescriptionDisplay()
    hashIndexDescriptions()
    addDots()
    addButtons()
    
    const splashSeen = parseInt(window.localStorage.getItem("user.splash_seen") || "0")
    if (splashSeen < CURRENT_SPLASH) {
        showSplash()
        window.localStorage.setItem("user.splash_seen", `${CURRENT_SPLASH}`)
    }
})().then(() => {
    const filterInput = document.getElementById("filter-input")
    filterInput.addEventListener("focus", () => {
        MyAltTextOrg.desc.resultIsDown = true
        updateDescriptionDisplay()
    })

    document.querySelectorAll("input[type=file]:not(#upload)").forEach(input => {
        input.labels.forEach(label => {
            input.addEventListener("focus", () => {
                label.classList.add("focused")
            })
            input.addEventListener("blur", () => {
                label.classList.remove("focused")
            })
        });
    })


    MyAltTextOrg.exec.push(...[
        {
            display: "Extract Text",
            closeMenu: true,
            onclick: cropExtractAndAddInFlight,
        }
    ])
    MyAltTextOrg.exec.forEach(option => option.sortKey = null)

    const execButton = document.createElement("button")
    const execWrapper = document.getElementById("exec-wrapper")
    const execMenu = buildComplexDropdownMenu(execButton, MyAltTextOrg.exec);
    execMenu.id = "exec"
    execWrapper.appendChild(execMenu)
    execWrapper.addEventListener("click", () => {
        hideEscapable(execWrapper)
    })

    addKeyboardCommand({
        altKey: true,
        keyCode: 82 // R
    }, showExecMenu(execWrapper, execButton))

    addKeyboardCommand({
        altKey: true,
        keyCode: 84 // T
    }, cropExtractAndAddInFlight)

    addKeyboardCommand({
        keyCode: 27 // Escape
    }, hideEscapable)

    document.body.addEventListener("keyup", (e) => {
        if (e.isComposing) {
            return
        }

        for (let command of MyAltTextOrg.cmd) {
            if (
                command.key.keyCode === e.keyCode
                && !command.key.altKey === !e.altKey
                && !command.key.ctrlKey === !e.ctrlKey
                && !command.key.metaKey === !e.metaKey
                && !command.key.shiftKey === !e.shiftKey
            ) {
                command.invoke()
            }
        }
    })


    document.getElementById("main").style.display = "flex"
});

