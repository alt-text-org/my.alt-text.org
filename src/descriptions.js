import { MyAltTextOrg } from "./first.js"
import {
    getAllDescriptions,
    saveDescription,
    getRecentDescriptions,
    getDescription,
    getDescriptionsForHash,
    deleteDescription
} from "./storage.js"
import { getLocalized } from "./i18n.js"
import { addInFlight } from "./in-flight.js"

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

export function toggleSearchResults(btn) {
    MyAltTextOrg.desc.resultIsDown = !MyAltTextOrg.desc.resultIsDown
    if (MyAltTextOrg.desc.resultIsDown) {
        const main = document.getElementById("main-area")
        updateDescriptionDisplay()
        main.scrollHeight = 0
    } else {
        hideResultDisplay()
    }
}

export function toggleImageFilter() {
    setImageFilter(!MyAltTextOrg.desc.imageFilter)
}

export function setImageFilter(bool) {
    const toggleBtn = document.getElementById("image-filter-toggle")
    toggleBtn.disabled = false
    MyAltTextOrg.desc.imageFilter = bool
    if (MyAltTextOrg.desc.imageFilter) {
        toggleBtn.classList.add("depressed")
    } else {
        toggleBtn.classList.remove("depressed")
    }

    updateDescriptionDisplay()
}

export function updateDescriptionDisplay() {
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
    const descriptionWrapper = document.getElementById("description-wrapper");
    status.classList.add("rotated")
    descriptionWrapper.style.display = "none"
}

export function initializeSearch() {
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

export function addDescription(chunk) {
    let ctime = Date.now();
    const desc = {
        id: chunk.id || null,
        name: chunk.name || "",
        lang: chunk.lang,
        imgHash: chunk.imgHash,
        text: chunk.text,
        maxLen: chunk.maxLen || 0,
        ctime: ctime,
        mtime: ctime,
        atime: ctime
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

export function textLen(text) {
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
    const descriptionWrapper = document.getElementById("description-wrapper");
    const descriptionsEle = document.getElementById("descriptions")
    const descriptionStateImg = document.getElementById("search-dropdown-indicator")
    const notFound = document.getElementById("not-found-display");
    descriptionStateImg.classList.remove("rotated")

    if (MyAltTextOrg.desc.displayDescriptions.length === 0) {
        descriptionsEle.innerHTML = ""
        notFound.style.display = "flex"
        descriptionWrapper.classList.add("disabled")
    } else {
        descriptionWrapper.classList.remove("disabled")
        notFound.style.display = "none"
        const scrollPx = descriptionsEle.scrollHeight
        descriptionsEle.innerHTML = ""

        MyAltTextOrg.desc.displayDescriptions.forEach(descId => {
            let description = getDescription(descId);
            let descEle = makeDescriptionEle(description)
            descriptionsEle.appendChild(descEle)
        })

        descriptionsEle.scrollHeight = scrollPx
    }
    descriptionWrapper.style.display = "flex"
}

function makeDescriptionEle(description) {
    const name = document.createElement("input")
    name.classList.add("name-input")
    name.placeholder = getLocalized("untitledName")
    name.type = "text"
    name.readOnly = true
    name.value = description.name

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
            let dataUrl = auxImage.toDataURL();
            imgButton.innerHTML = `<img src="${dataUrl}" class="aux-image" alt="Additional alt text image ${idx + 1} of ${textParts.length}">`

            const imageTransmission = buildSimpleDropdownMenu(
                imgButton,
                {
                    "Copy Image": "copy",
                    "Download Image": "download"
                },
                null,
                deliverAuxImage(dataUrl, `addtl-alt-text-${idx + 1}-of-${textParts.length}.png`)
            )

            controls.appendChild(imageTransmission)
            textPartWrapper.classList.add("addtl-text-part-wrapper")
        }

        let copyAck = null
        const copyBtn = document.createElement("button")
        copyBtn.classList.add("page-button", "emoji-button")
        copyBtn.innerText = "📋"
        copyBtn.title = "Copy Text"
        copyBtn.onclick = () => {
            if (copyAck) {
                clearTimeout(copyAck)
            }
            window.navigator.clipboard.writeText(part).then(() => {
                    copyBtn.innerText = "✅"
                    copyAck = setTimeout(() => copyBtn.innerText = "📋", 2500)
                }
            ).catch(() => {
                copyBtn.innerText = "❌"
                copyAck = setTimeout(() => copyBtn.innerText = "📋", 2500)
            })
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
    editBtn.classList.add("page-button", "emoji-button")
    editBtn.innerText = "📝"
    editBtn.title = "Edit"
    editBtn.onclick = () => editDescription(description.id)
    footer.appendChild(editBtn)

    const copyBtn = document.createElement("button")
    copyBtn.classList.add("page-button", "emoji-button")
    copyBtn.innerText = "👯"
    copyBtn.title = "Duplicate"
    copyBtn.onclick = () => duplicateDescription(description.id)
    footer.appendChild(copyBtn)

    const trashBtn = document.createElement("button")
    trashBtn.classList.add("page-button", "emoji-button")
    trashBtn.innerText = "🚮"
    trashBtn.title = "Delete"
    trashBtn.onclick = () => removeDescription(description.id)
    footer.appendChild(trashBtn)

    const maxLenEle = document.createElement("input")
    maxLenEle.classList.add("maxlen-field")
    maxLenEle.type = "text"
    maxLenEle.placeholder = "Max Length"
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

export function focusFilter() {
    const filterInput = document.getElementById("filter-input")
    filterInput.focus()
}

function deliverAuxImage(dataUrl, name) {
    return async (method) => {
        if (method === "copy") {
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
        } else if (method === "download") {
            const a = document.createElement("a")
            a.href = dataUrl
            a.download = name
            a.click()
        } else {
            console.log(`Unexpected aux delivery method: ${method}`)
        }
    }
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
