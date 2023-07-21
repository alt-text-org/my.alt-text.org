const textIndex = new FlexSearch.Index({});
const textSearchIndices = []
let textNextSearchIdx = 0

const nameIndex = new FlexSearch.Index({});
const nameSearchIndices = []
let nameNextSearchIdx = 0

let displayDescriptions = []

const descriptionsEle = document.getElementById("descriptions")
const resultFilter = document.getElementById("filter-input")
resultFilter.oninput = () => searchArchive(resultFilter.value)

loadDescriptions()

// updateMtimeOrderedDescs()



function updateMtimeOrderedDescs() {
    const mtimeDescriptions = Object.values(userDescriptions)
    mtimeDescriptions.sort((a, b) => a.mtime - b.mtime)
    displayDescriptions = mtimeDescriptions.slice(0, 100)
    renderDescriptions()
}

function searchArchive(search, limit) {
    displayDescriptions.length = 0

    const foundIds = []
    const foundByName = nameIndex.search(search, limit);
    for (let byName of foundByName) {
        console.log(JSON.stringify(byName))
    }

    let remaining = limit ? limit - foundByName.length : null
    let foundByText = textIndex.search(search, remaining);
    for (let byText of foundByText) {
        console.log(JSON.stringify(byText))
    }

    renderDescriptions()
}

function addDescription(chunk) {
    const desc = {
        name: chunk.name || getLocalized(),
        lang: chunk.lang,
        imgHash: chunk.hash,
        text: chunk.text,
        maxLen: 0,
        mtime: Date.now()
    }
    const descId = saveDescription(desc)
    addSearch(descId, chunk.name, chunk.text)
}

function addSearch(descId, hash, name, text) {
    textSearchIndices[textNextSearchIdx] = descId
    textIndex.add(textNextSearchIdx, text)
    textNextSearchIdx++

    nameSearchIndices[nameNextSearchIdx] = descId
    nameIndex.add(nameNextSearchIdx, name)
    nameNextSearchIdx++
}

function updateDescription(hash, name, text, maxLen) {
    const description = userDescriptions[hash]
    description.name = name || description.name
    description.text = text || description.text
    description.maxLen = maxLen || description.maxLen
    description.mtime = Date.now()
    saveDescriptions()
    renderDescriptions()
}

function combineDescriptions(srcHash, dstHash) {
    const dest = userDescriptions[dstHash]
    const src = userDescriptions[srcHash]

    updateDescription(dstHash, null, dest.text + src.text, null)
    deleteDescription(srcHash)
}

function addBlankDescription() {

}

function renderDescriptions() {
    const scrollPx = descriptionsEle.scrollHeight
    descriptionsEle.innerHTML = ""

    displayDescriptions.forEach(descHash => {
        let descEle = makeDescriptionEle(userDescriptions[descHash])
        descriptionsEle.appendChild(descEle)
    })

    descriptionsEle.scrollHeight = scrollPx
}

function makeDescriptionEle(description) {
    const name = document.createElement("input")
    name.classList.add("description-name")
    name.type = "text"
    name.value = description.name
    name.onchange = () => {
        updateDescription(description.hash, name.value, null, null)
    }

    const wrapper = document.createElement("div")
    wrapper.classList.add("description-wrapper")
    wrapper.appendChild(name)
    wrapper.appendChild(makeTextSection(description))
    return wrapper
}

function makeTextSection(description) {
    const textSection = document.createElement("div")
    textSection.classList.add("description-text-section")

    let liquify = () => {
        const counter = document.createElement("span")
        counter.classList.add("char-counter")
        counter.innerText = description.text.length

        const editor = document.createElement("textarea")
        editor.classList.add("description-composer")
        editor.value = description.text
        editor.cols = 42

        editor.oninput = () => counter.innerText = `${editor.value.length}`
        editor.onblur = () => updateDescription(description.hash, null, editor.value, null)
        textSection.innerHTML = ""
        textSection.appendChild(editor)
        textSection.appendChild(counter)
    }

    makeAtRestText(textSection, description, liquify)

    return textSection
}

function makeAtRestText(ele, description, liquify) {
    let textParts
    if (description.maxLen) {
        textParts = splitText(description.text, description.maxLen)
    } else {
        textParts = [description.text]
    }

    textParts.forEach((part, idx) => {
        const textPartWrapper = document.createElement("div")
        textPartWrapper.classList.add("text-part-wrapper")

        const textArea = document.createElement("textarea")
        textArea.classList.add("frozen-text-part")
        textArea.value = part
        textArea.readOnly = true
        textArea.onclick = liquify

        const controls = document.createElement("div")
        controls.classList.add("text-part-controls")
        if (idx > 0) {
            const imgButton = document.createElement("button")
            imgButton.classList.add("emoji-button")
            imgButton.innerText = "🌠"
            imgButton.onclick = () => {
                popupAuxImage(description.lang, part, idx, textParts.length)
            }
            controls.appendChild(imgButton)
        }

        let copyAck = null
        const copyBtn = document.createElement("button")
        copyBtn.classList.add("emoji-button")
        copyBtn.innerText = "📋"
        copyBtn.onclick = () => {
            if (copyAck) {
                clearTimeout(copyAck)
            }
            window.navigator.clipboard.writeText(part)
            copyBtn.innerText = "✅"
            copyAck = setTimeout(() => copyBtn.innerText = "📋", 2500)
        }

        textPartWrapper.appendChild(textArea)
        textPartWrapper.appendChild(controls)
        ele.appendChild(textPartWrapper)
    })

    ele.appendChild(makeFooter(description))
}

function popupAuxImage(lang, textPart, partNum, numParts) {
    let auxCanvas = getAuxCanvas(lang, partNum + 1, numParts);

    const popup = document.createElement("div")
    popup.classList.add("aux-image-popup")
    popup.appendChild(auxCanvas)

    const textPartEle = document.createElement("textarea")
    textPartEle.classList.add("popup-text-part")
    textPartEle.cols = 64
    textPartEle.rows = 4
    textPartEle.readOnly = true
    textPartEle.value = textPart
    popup.appendChild(textPartEle)

    const controls = document.createElement("div")
    controls.classList.add("popup-controls")

    const copyImageBtn = document.createElement("button")
    copyImageBtn.innerText = MyAltTextOrg.i18n.popupCopyImage
    copyImageBtn.onclick = () => {
        auxCanvas.toBlob(function (blob) {
            const item = new ClipboardItem({"image/png": blob});
            navigator.clipboard.write([item]);
        });
    }
    controls.appendChild(copyImageBtn)

    const copyTextBtn = document.createElement("button")
    copyTextBtn.innerText = MyAltTextOrg.i18n.popupCopyText
    copyTextBtn.onclick = () => {
        navigator.clipboard.writeText(textPart)
    }
    controls.appendChild(copyTextBtn)
    popup.appendChild(controls)

    const close = () => {
        document.removeChild(popup)
    }

    const closeX = document.createElement("button")
    closeX.classList.add("popup-close-x")
    closeX.onclick = close
    popup.appendChild(closeX)

    const clickOut = document.createElement("div")
    clickOut.classList.add("popup-click-out")
    closeX.innerText = "❎"
    clickOut.onclick = close
    popup.appendChild(clickOut)
}

function makeFooter(description) {
    const footer = document.createElement("div")
    footer.classList.add("description-footer")

    const maxLenEle = document.createElement("input")
    maxLenEle.classList.add("maxlen-field")
    maxLenEle.type = "text"
    maxLenEle.placeholder = MyAltTextOrg.i18n.maxLenTxt
    maxLenEle.oninput = () => maxLenEle.value = filterNonDigits(maxLenEle.value)
    maxLenEle.onchange = () => renderDescriptions()
    if (description.maxLen) {
        maxLenEle.value = `${description.maxLen}`
    }

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("emoji-button")
    trashBtn.innerText = "🚮"
    trashBtn.onclick = () => deleteDescription(description.hash)

    footer.appendChild(maxLenEle)
    footer.appendChild(trashBtn)
    return footer
}

function loadDescriptions() {
    userDescriptions = JSON.parse(window.localStorage.getItem("results") || "{}")
    Object.entries(userDescriptions).forEach(description => {
        textIndex.add(description[0], description[1].text)
        textIndex.add(`${description[0]}-name`, description[1].name)
    })
}

function filterNonDigits(str) {
    return str.replaceAll(/[^0-9]/g, '')
}


function focusFilter() {
    filterInput.focus()
}

function splitText(text, maxLen) {
    let result = [];
    let lastSpan = {end: 0};
    let lenBase = 0;
    let split = Array.from(splitter.findSpans(text));
    split.forEach(span => {
        if (span.end - lenBase > maxLen) {
            result.push(text.substring(lenBase, lastSpan.end));
            lenBase = span.start;
        }
        lastSpan = span;
    });

    if (text.length > lenBase) {
        result.push(text.substring(lenBase, text.length));
    }

    return result;
}