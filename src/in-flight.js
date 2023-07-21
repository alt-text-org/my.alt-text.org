const inFlightEle = document.getElementById('in-flight')

const inFlight = []

function addBlankInFlight() {
    let name = MyAltTextOrg.currImage ? MyAltTextOrg.currImage.name || getLocalized("untitledName") : getLocalized("untitledName")
    let hash = MyAltTextOrg.currImage ? MyAltTextOrg.currImage.hash || null : null
    inFlight.push({
        name,
        hash,
        lang: MyAltTextOrg.i18n.isoCode,
        text: ""
    })
    renderInFlight()
}

function addInFlight(text) {
    let name = MyAltTextOrg.currImage.name || ""
    let hash = MyAltTextOrg.currImage.hash || null
    let lang = MyAltTextOrg.currImage.lang || MyAltTextOrg.i18n.isoCode
    inFlight.push({name, hash, lang, text})
}

function saveInFlight(idx) {
    if (inFlight[idx]) {
        addDescription(inFlight[idx])
        removeInFlight(idx)
    }
}

function saveAllInFlight() {
    for (let chunk of inFlight) {
        if (chunk) {
            addDescription(chunk)
        }
    }
    clearInFlight()
}

function removeInFlight(idx) {
    inFlight[idx] = null
    renderInFlight()
}

function clearInFlight() {
    inFlight.length = 0
    renderInFlight()
}

function renderInFlight() {
    inFlightEle.innerHTML = ""
    inFlight.reverse().forEach((chunk, idx) => {
        if (chunk) {
            const elem = buildInFlightItem(idx, chunk)
            inFlightEle.appendChild(elem)
        }
    })
}

function buildInFlightItem(idx, chunk) {
    const outer = document.createElement("div")
    outer.classList.add("in-flight-item")

    const nameInput = document.createElement("input")
    nameInput.classList.add("name-input")
    nameInput.value = chunk.name
    nameInput.type = "text"
    nameInput.placeholder = getLocalized("untitledName")
    nameInput.ariaLabel = getLocalized("nameLabel")
    nameInput.onchange = () => inFlight[idx].name = nameInput.value
    outer.appendChild(nameInput)

    const charCounter = document.createElement("div")
    charCounter.classList.add("char-counter")

    const textArea = document.createElement("textarea")
    textArea.classList.add("in-flight-text")
    textArea.ariaLabel = getLocalized("inFlightItemTextArea")
    textArea.rows = 4
    textArea.cols = 1
    textArea.value = chunk.text
    textArea.onchange = () => inFlight[idx].text = textArea.value
    charCounter.innerText = `${textArea.value.length}`
    textArea.oninput = () => charCounter.innerText = `${textArea.value.length}`
    outer.appendChild(textArea)

    const controls = document.createElement("div")
    controls.classList.add("in-flight-item-controls")

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("emoji-button")
    trashBtn.innerText = "🚮"
    trashBtn.ariaLabel = getLocalized("deleteChunk")
    trashBtn.onclick = () => removeInFlight(idx)
    controls.appendChild(trashBtn)

    const saveBtn = document.createElement("button")
    saveBtn.classList.add("emoji-button")
    saveBtn.innerText = "💾"
    saveBtn.ariaLabel = getLocalized("saveChunk")
    saveBtn.onclick = () => saveInFlight(idx)
    controls.appendChild(saveBtn)

    controls.appendChild(charCounter)
    outer.appendChild(controls)

    return outer
}