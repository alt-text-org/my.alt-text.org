
MyAltTextOrg.inFlight = []

function addBlankInFlight() {
    let name = MyAltTextOrg.currImage ? MyAltTextOrg.currImage.name || "" : ""
    let imgHash = MyAltTextOrg.currImage ? MyAltTextOrg.currImage.hash || null : null
    MyAltTextOrg.inFlight.push({
        name,
        imgHash,
        lang: MyAltTextOrg.i18n.isoCode,
        text: ""
    })
    renderInFlight()
}

function addInFlight(text, id, name, imgHash, lang, maxLen) {
    let ifName = name || (MyAltTextOrg.currImage ? MyAltTextOrg.currImage.name : "")
    let ifHash = imgHash || (MyAltTextOrg.currImage ? MyAltTextOrg.currImage.hash : null)
    let ifLang = lang || (MyAltTextOrg.currImage ? MyAltTextOrg.currImage.lang : MyAltTextOrg.i18n.isoCode)
    MyAltTextOrg.inFlight.push({
        id,
        text, 
        name: ifName,
        imgHash: ifHash,
        lang: ifLang,
        maxLen: maxLen
    })
    renderInFlight(id)
}

function duplicateChunk(idx) {
    const src = MyAltTextOrg.inFlight[idx]
    const dst = {
        id: src.id,
        text: src.text,
        name: src.name,
        imgHash: src.imgHash,
        lang: src.lang,
        maxLen: src.maxLen
    }
    MyAltTextOrg.inFlight.push(dst)
    renderInFlight()
}

function saveInFlight(idx) {
    if (MyAltTextOrg.inFlight[idx]) {
        addDescription(MyAltTextOrg.inFlight[idx])
        removeInFlight(idx)
    }
}

function saveAllInFlight() {
    for (let chunk of MyAltTextOrg.inFlight) {
        if (chunk) {
            addDescription(chunk)
        }
    }
    clearInFlight()
}

function removeInFlight(idx) {
    MyAltTextOrg.inFlight[idx] = null
    renderInFlight()
}

function clearInFlight() {
    MyAltTextOrg.inFlight.length = 0
    renderInFlight()
}

function renderInFlight(id) {
    const inFlightEle = document.getElementById('in-flight')

    inFlightEle.innerHTML = ""
    MyAltTextOrg.inFlight.reverse().forEach((chunk, idx) => {
        if (chunk) {
            const elem = buildInFlightItem(idx, chunk)
            inFlightEle.appendChild(elem)
            if (id === chunk.id) {
                let text = elem.querySelector(".in-flight-text");
                text.selectionEnd = 0
                text.focus()
            }
        }
    })
}

function buildInFlightItem(idx, chunk) {
    const outer = document.createElement("div")
    outer.classList.add("in-flight-item")
    outer.classList.add("display-item")

    const nameInput = document.createElement("input")
    nameInput.classList.add("name-input")
    nameInput.value = chunk.name
    nameInput.type = "text"
    nameInput.placeholder = getLocalized("untitledName")
    nameInput.ariaLabel = getLocalized("nameLabel")
    nameInput.onchange = () => MyAltTextOrg.inFlight[idx].name = nameInput.value
    outer.appendChild(nameInput)

    const charCounter = document.createElement("div")
    charCounter.classList.add("char-counter")

    const textArea = document.createElement("textarea")
    textArea.classList.add("in-flight-text")
    textArea.ariaLabel = getLocalized("inFlightItemTextArea")
    textArea.rows = 4
    textArea.cols = 1
    textArea.value = chunk.text
    textArea.onchange = () => MyAltTextOrg.inFlight[idx].text = textArea.value
    charCounter.innerText = `${textLen(textArea.value)}`
    textArea.oninput = () => charCounter.innerText = `${textLen(textArea.value)}`
    outer.appendChild(textArea)

    const controls = document.createElement("div")
    controls.classList.add("in-flight-item-controls")

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("page-button", "emoji-button")
    trashBtn.innerText = "🚮"
    trashBtn.title = "Delete"
    trashBtn.ariaLabel = getLocalized("deleteChunk")
    trashBtn.onclick = () => removeInFlight(idx)
    controls.appendChild(trashBtn)

    const copyBtn = document.createElement("button")
    copyBtn.classList.add("page-button", "emoji-button")
    copyBtn.innerText = "👯"
    copyBtn.title = "Duplicate"
    copyBtn.ariaLabel = getLocalized("copyChunk")
    copyBtn.onclick = () => duplicateChunk(idx)
    controls.appendChild(copyBtn)

    const cutButton = document.createElement("button")
    cutButton.classList.add("page-button", "emoji-button")
    cutButton.innerText = "✂️"
    cutButton.title = "Cut"
    cutButton.ariaLabel = "Cut text"
    cutButton.onclick = async () => {
        await navigator.clipboard.writeText(textArea.value)
        removeInFlight(idx)
    }
    controls.appendChild(cutButton)

    const saveBtn = document.createElement("button")
    saveBtn.classList.add("page-button", "emoji-button")
    saveBtn.innerText = "💾"
    saveBtn.title = "Save"
    saveBtn.ariaLabel = getLocalized("saveChunk")
    saveBtn.onclick = () => saveInFlight(idx)
    controls.appendChild(saveBtn)

    controls.appendChild(charCounter)
    outer.appendChild(controls)

    return outer
}