const textIndex = new FlexSearch.Index({});
const textSearchIndices = []
let textNextSearchIdx = 0

const nameIndex = new FlexSearch.Index({});
const nameSearchIndices = []
let nameNextSearchIdx = 0

let displayDescriptions = []

const descriptionsEle = document.getElementById("descriptions")
const resultFilter = document.getElementById("filter-input")
resultFilter.oninput = () => updateDisplayDescriptions()

updateDisplayDescriptions()

function updateDisplayDescriptions() {
    if (MyAltTextOrg.currImage && resultFilter.value) {
        displayDescriptions = searchArchive(resultFilter.value, MyAltTextOrg.currImage.hash)
    } else if (MyAltTextOrg.currImage) {
        displayDescriptions = getRecentDescriptions(100, MyAltTextOrg.currImage.hash)
    } else if (resultFilter.value) {
        displayDescriptions = searchArchive(resultFilter.value)
    } else {
        displayDescriptions = getRecentDescriptions(100)
    }

    renderDescriptions()
}

function searchArchive(search, imgHash) {
    let hashDescs = null
    if (imgHash) {
        hashDescs = getDescriptionsForHash(imgHash)
        if (!hashDescs) {
            return []
        }
    }

    const foundIds = []
    const foundByName = nameIndex.search(search);
    for (let byName of foundByName) {
        console.log(JSON.stringify(byName))
    }

    // let remaining = limit ? limit - foundByName.length : null
    let foundByText = textIndex.search(search);
    for (let byText of foundByText) {
        console.log(JSON.stringify(byText))
    }

    return foundIds.filter(id => hashDescs ? hashDescs[id] : true)
}

function addDescription(chunk) {
    const desc = {
        name: chunk.name || "",
        lang: chunk.lang,
        imgHash: chunk.imgHash,
        text: chunk.text,
        maxLen: chunk.maxLen || 0,
        mtime: Date.now()
    }
    const descId = saveDescription(desc)
    addSearch(descId, chunk.name, chunk.text)
    updateDisplayDescriptions()
}

function addSearch(descId, imgHash, name, text) {
    textSearchIndices[textNextSearchIdx] = descId
    textIndex.add(textNextSearchIdx, text)
    textNextSearchIdx++

    nameSearchIndices[nameNextSearchIdx] = descId
    nameIndex.add(nameNextSearchIdx, name)
    nameNextSearchIdx++
}

function updateDescription(descId, desc) {
    saveDescription(desc)
    updateDisplayDescriptions()
}

function editDescription(descId) {
    const desc = getDescription(descId)
    addInFlight(desc.text, desc.name, desc.imgHash, desc.lang, desc.maxLen)
}

function textLen(text) {
    //TODO: Handle sites that treat unicode as multiple chars
    return text.length
}

function combineDescriptions(srcId, dstId) {
    const dst = getDescription(dstId)
    const src = getDescription(srcId)

    dst.text += src.text
    dst.name = dst.name || src.name
    dst.imgHash = dst.imgHash || src.imgHash
    dst.lang = dst.lang || src.lang
    dst.maxLen = dst.maxLen || src.maxLen

    updateDescription(dstId, dst)
    deleteDescription(srcId)
    updateDisplayDescriptions()
}

function removeDescription(descId) {
    deleteDescription(descId)
    updateDisplayDescriptions()
}

function renderDescriptions() {
    const scrollPx = descriptionsEle.scrollHeight
    descriptionsEle.innerHTML = ""

    displayDescriptions.forEach(descId => {
        let description = getDescription(descId);
        let descEle = makeDescriptionEle(description)
        descriptionsEle.appendChild(descEle)
    })

    descriptionsEle.scrollHeight = scrollPx
}

function makeDescriptionEle(description) {
    const name = document.createElement("input")
    name.classList.add("description-name")
    name.placeholder =
        name.type = "text"
    name.value = description.name
    name.onchange = () => {
        updateDescription(description.imgHash, name.value, null, null)
    }

    const wrapper = document.createElement("div")
    wrapper.innerText = description.name || getLocalized("untitledName")
    wrapper.classList.add("description-wrapper")
    wrapper.appendChild(name)
    wrapper.appendChild(makeTextSection(description))
    return wrapper
}

function makeTextSection(description) {
    const textSection = document.createElement("div")
    textSection.classList.add("description-text-section")

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

        const controls = document.createElement("div")
        controls.classList.add("text-part-controls")
        if (idx > 0) {
            const auxImage = getAuxCanvas(description.lang,)
            const imgButton = document.createElement("button")
            imgButton.classList.add("emoji-button")
            imgButton.innerHTML = `<img src="${auxImage.toDataURL()}" alt="Additional alt text image ${idx + 1} of ${textParts.length}">`
            imgButton.onclick = () => {
                //TODO: Popup copy/download
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
        textSection.appendChild(textPartWrapper)
    })

    textSection.appendChild(makeFooter(description))

    return textSection
}

function makeFooter(description) {
    const footer = document.createElement("div")
    footer.classList.add("description-footer")

    const maxLenEle = document.createElement("input")
    maxLenEle.classList.add("maxlen-field")
    maxLenEle.type = "text"
    maxLenEle.placeholder = MyAltTextOrg.i18n.maxLenTxt
    maxLenEle.oninput = () => maxLenEle.value = filterNonDigits(maxLenEle.value)
    maxLenEle.onchange = () => {
        description.maxLen = parseInt(maxLenEle.value)
        updateDescription(description.id, description)
        renderDescriptions()
    }
    if (description.maxLen) {
        maxLenEle.value = `${description.maxLen}`
    }

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("emoji-button")
    trashBtn.innerText = "🚮"
    trashBtn.onclick = () => removeDescription(description.id)

    footer.appendChild(maxLenEle)
    footer.appendChild(trashBtn)
    return footer
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