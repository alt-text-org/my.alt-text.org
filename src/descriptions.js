MyAltTextOrg.desc.textIndex = new FlexSearch.Index({});
MyAltTextOrg.desc.textSearchIndices = []
MyAltTextOrg.desc.textNextSearchIdx = 0

MyAltTextOrg.desc.nameIndex = new FlexSearch.Index({});
MyAltTextOrg.desc.nameSearchIndices = []
MyAltTextOrg.desc.nameNextSearchIdx = 0

MyAltTextOrg.desc.displayDescriptions = []

MyAltTextOrg.desc.resultIsDown = false
MyAltTextOrg.desc.imageFilter = false

MyAltTextOrg.desc.resultFilter = document.getElementById("filter-input")
MyAltTextOrg.desc.resultFilter.oninput = () => updateDescriptionDisplay()

function toggleSearchResults(btn) {
    MyAltTextOrg.desc.resultIsDown = !MyAltTextOrg.desc.resultIsDown
    if (MyAltTextOrg.desc.resultIsDown) {
        const main = document.getElementById("main-area")
        updateDescriptionDisplay()
        main.scrollHeight = 0
    } else {
        hideResultDisplay()
    }
}

function toggleImageFilter() {
    setImageFilter(!MyAltTextOrg.desc.imageFilter)
}

function setImageFilter(bool) {
    const toggleBtn = document.getElementById("image-filter-toggle")
    toggleBtn.disabled = false
    MyAltTextOrg.desc.imageFilter = bool
    if (MyAltTextOrg.desc.imageFilter) {
        toggleBtn.classList.remove("depressed")
    } else {
        toggleBtn.classList.add("depressed")
    }

    updateDescriptionDisplay()
}

function updateDescriptionDisplay() {
    if (!MyAltTextOrg.desc.resultIsDown) {
        hideResultDisplay()
        return
    }

    if ((MyAltTextOrg.currImage && MyAltTextOrg.desc.imageFilter) && MyAltTextOrg.desc.resultFilter.value) {
        MyAltTextOrg.desc.displayDescriptions = searchArchive(MyAltTextOrg.desc.resultFilter.value, MyAltTextOrg.currImage.hash)
    } else if (MyAltTextOrg.currImage) {
        MyAltTextOrg.desc.displayDescriptions = getRecentDescriptions(100,
            MyAltTextOrg.desc.imageFilter
                ? MyAltTextOrg.currImage.hash
                : null
        )
    } else if (MyAltTextOrg.desc.resultFilter.value) {
        MyAltTextOrg.desc.displayDescriptions = searchArchive(MyAltTextOrg.desc.resultFilter.value)
    } else {
        MyAltTextOrg.desc.displayDescriptions = getRecentDescriptions(100)
    }

    renderDescriptions()
}

function hideResultDisplay() {
    const status = document.getElementById("search-dropdown-indicator")
    let descriptions = document.getElementById("descriptions");
    status.classList.add("rotated")
    descriptions.style.display = "none"
}

function initializeSearch() {
    let descriptions = getAllDescriptions();
    Object.values(descriptions).forEach(desc => indexForSearch(desc.id, desc.name, desc.text))
}

function searchArchive(search, imgHash) {
    let hashDescs = null
    if (imgHash) {
        hashDescs = getDescriptionsForHash(imgHash)
        if (!hashDescs) {
            return []
        }
    }

    const foundIds = {}
    const foundByName = MyAltTextOrg.desc.nameIndex.search(search);
    for (let key of foundByName) {
        foundIds[MyAltTextOrg.desc.nameSearchIndices[key]] = true
    }

    let foundByText = MyAltTextOrg.desc.textIndex.search(search);
    for (let key of foundByText) {
        foundIds[MyAltTextOrg.desc.textSearchIndices[key]] = true
    }

    return Object.keys(foundIds).filter(id => hashDescs ? hashDescs[id] : true)
}

function addDescription(chunk) {
    const desc = {
        id: chunk.id || null,
        name: chunk.name || "",
        lang: chunk.lang,
        imgHash: chunk.imgHash,
        text: chunk.text,
        maxLen: chunk.maxLen || 0,
        mtime: Date.now()
    }
    const descId = saveDescription(desc)
    indexForSearch(descId, chunk.name, chunk.text)
    updateDescriptionDisplay()
}

function indexForSearch(descId, name, text) {
    if (name) {
        MyAltTextOrg.desc.nameSearchIndices[MyAltTextOrg.desc.nameNextSearchIdx] = descId
        MyAltTextOrg.desc.nameIndex.add(MyAltTextOrg.desc.nameNextSearchIdx, name)
        MyAltTextOrg.desc.nameNextSearchIdx++
    }

    if (text) {
        MyAltTextOrg.desc.textSearchIndices[MyAltTextOrg.desc.textNextSearchIdx] = descId
        MyAltTextOrg.desc.textIndex.add(MyAltTextOrg.desc.textNextSearchIdx, text)
        MyAltTextOrg.desc.textNextSearchIdx++
    }
}

function updateDescription(descId, desc) {
    saveDescription(desc)
    updateDescriptionDisplay()
}

function editDescription(descId) {
    const desc = getDescription(descId)
    addInFlight(desc.text, desc.id, desc.name, desc.imgHash, desc.lang, desc.maxLen)
}

function duplicateDescription(id) {
    const desc = getDescription(id)
    const copy = {
        name: desc.name,
        lang: desc.lang,
        imgHash: desc.imgHash,
        text: desc.text,
        maxLen: desc.maxLen,
        mtime: Date.now()
    }
    saveDescription(copy)
    updateDescriptionDisplay()
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
    updateDescriptionDisplay()
}

function removeDescription(descId) {
    deleteDescription(descId)
    updateDescriptionDisplay()
}

function renderDescriptions() {
    const descriptionsEle = document.getElementById("descriptions")
    const descriptionStateImg = document.getElementById("search-dropdown-indicator")
    descriptionStateImg.classList.remove("rotated")

    if (MyAltTextOrg.desc.displayDescriptions.length === 0) {
        descriptionsEle.innerHTML = ""
        descriptionsEle.classList.add("nothing-found")
    } else {
        descriptionsEle.classList.remove("nothing-found")
        const scrollPx = descriptionsEle.scrollHeight
        descriptionsEle.innerHTML = ""

        MyAltTextOrg.desc.displayDescriptions.forEach(descId => {
            let description = getDescription(descId);
            let descEle = makeDescriptionEle(description)
            descriptionsEle.appendChild(descEle)
        })

        descriptionsEle.scrollHeight = scrollPx
    }
    descriptionsEle.style.display = "flex"
}

function makeDescriptionEle(description) {
    const name = document.createElement("input")
    name.classList.add("description-name")
    name.placeholder = getLocalized("untitledName")
    name.type = "text"
    name.value = description.name
    name.onchange = () => {
        updateDescription(description.id, description)
    }

    const wrapper = document.createElement("div")
    wrapper.classList.add("description-wrapper")
    wrapper.classList.add("display-item")
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
        textArea.rows = 5
        textArea.value = part
        textArea.readOnly = true

        const controls = document.createElement("div")
        controls.classList.add("text-part-controls")
        if (idx > 0) {
            const auxImage = getAuxCanvas(description.lang, idx + 1, textParts.length)
            const imgButton = document.createElement("button")
            imgButton.classList.add("aux-image-button")
            imgButton.innerHTML = `<img src="${auxImage.toDataURL()}" class="aux-image" alt="Additional alt text image ${idx + 1} of ${textParts.length}">`
            imgButton.onclick = () => {
                //TODO: Popup copy/download
            }
            controls.appendChild(imgButton)
            textPartWrapper.classList.add("addtl-text-part-wrapper")
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
        controls.appendChild(copyBtn)

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

    const editBtn = document.createElement('button')
    editBtn.classList.add("emoji-button")
    editBtn.innerText = "📝"
    editBtn.onclick = () => editDescription(description.id)
    footer.appendChild(editBtn)

    const copyBtn = document.createElement("button")
    copyBtn.classList.add("emoji-button")
    copyBtn.innerText = "👯"
    copyBtn.onclick = () => duplicateDescription(description.id)
    footer.appendChild(copyBtn)

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("emoji-button")
    trashBtn.innerText = "🚮"
    trashBtn.onclick = () => removeDescription(description.id)
    footer.appendChild(trashBtn)

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
    footer.appendChild(maxLenEle)

    return footer
}

function filterNonDigits(str) {
    return str.replaceAll(/[^0-9]/g, '')
}

function focusFilter() {
    const filterInput = document.getElementById("filter-input")
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