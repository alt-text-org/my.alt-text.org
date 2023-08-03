import { MyAltTextOrg } from "./first.js"
import { initOcr } from "./tesseract.js"
import { updatePageLanguage } from "./i18n.js"
import { initializeSearch, updateDescriptionDisplay } from "./descriptions.js"
import { hashIndexDescriptions } from "./storage.js"
import {
    addDots,
    listenForKeys,
    addWorkAreaButtons,
    cropExtractAndAddInFlight,
    addKeyboardCommand,
    showExecMenu
} from "./core.js"
import { buildComplexDropdownMenu, hideEscapable } from "./dropdowns.js"
import { initPalette } from "./palette.js"

;(async () => {
    const CURRENT_SPLASH = 1;

    await initOcr()
    // await initStoredImage()

    let userLang = window.navigator.language.split('-')[0];
    updatePageLanguage(MyAltTextOrg.i18n.pageText[userLang] ? userLang : MyAltTextOrg.const.DEFAULT_PAGE_LANG)
    initializeSearch()
    updateDescriptionDisplay()
    hashIndexDescriptions()
    addDots()
    addWorkAreaButtons()
    initPalette()

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
        hideEscapable()
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

    document.body.addEventListener("wheel", (e) => {
        if (!e.target || !e.altKey) {
            return
        }

        let computedStyle = window.getComputedStyle(e.target);
        const fontSize = computedStyle.getPropertyValue("font-size")
        if (!e.target.sizeDelta) {
            e.target.sizeDelta = 0
            e.target.origWidth = computedStyle.getPropertyValue("width")
            e.target.origHeight = computedStyle.getPropertyValue("height")
        }

        //TODO: Do we need to account for delta mode here?
        const fontDelta = e.deltaY * 0.1;
        e.target.sizeDelta += e.deltaY * 3;

        const [_, numStr, unit] = fontSize.match(/([\d.]+)([a-z]+)?/)
        const newNum = parseFloat(numStr) + fontDelta
        e.target.style.fontSize = `${newNum}${unit}`
        e.target.style.width = `calc(${e.target.origWidth} + ${e.target.sizeDelta}px})`
        e.target.style.height = `calc(${e.target.origHeight} + ${e.target.sizeDelta}px})`
    })

    listenForKeys(document, [{
        keyCode: 8, // Backspace
        invoke: () => {
            let activeObject = MyAltTextOrg.canvas.getActiveObject();
            if (activeObject) {
                MyAltTextOrg.canvas.remove(activeObject)
            }
        }
    }])

    document.getElementById("main").style.display = "flex"
});


