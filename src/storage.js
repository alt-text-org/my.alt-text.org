const DESCRIPTION_KEY = "descriptions";

const userDescriptions = loadDescriptions()
let descByHash = {}
hashIndexDescriptions()

function saveDescriptions() {
    try {
        window.localStorage.setItem(DESCRIPTION_KEY, JSON.stringify(userDescriptions))
        hashIndexDescriptions()
    } catch (err) {
        alert("Alt text storage full.\nThis limit is set by the browser.\nPlease delete unused alt text to save new alt text.")
    }
}

function saveDescription(desc) {
    function makeId() {
        if (window.location.protocol === 'https:') {
            return crypto.randomUUID()
        } else {
            return `${Math.random()}`
        }
    }

    desc.id = desc.id || makeId()
    userDescriptions[desc.id] = desc
    saveDescriptions()

    return desc.id
}

function getDescriptionsForHash(imgHash) {
    return descByHash[imgHash]
}

function getRecentDescriptions(limit, imgHash) {
    let mtimeDescriptions = Object.values(userDescriptions)
    if (imgHash) {
        mtimeDescriptions = mtimeDescriptions.filter(desc => desc.imgHash === imgHash)
    }

    mtimeDescriptions.sort((a, b) => b.mtime - a.mtime)
    return mtimeDescriptions.slice(0, limit).map(desc => desc.id)
}

function deleteDescription(descId) {
    delete userDescriptions[descId]
    saveDescriptions()
}

function getDescription(descId) {
    return userDescriptions[descId]
}

function loadDescriptions() {
    return JSON.parse(window.localStorage.getItem(DESCRIPTION_KEY) || "{}")
}

function getAllDescriptions() {
    return userDescriptions
}


function hashIndexDescriptions() {
    descByHash = {}
    for (let [descId, desc] of Object.entries(userDescriptions)) {
        if (!descByHash[desc.imgHash]) {
            descByHash[desc.imgHash] = {}
        }
        descByHash[desc.imgHash][descId] = true
    }
}

function getExportableDescriptions() {
    return JSON.stringify(userDescriptions)
}

function importDescriptions(other) {
    for (let [descId, desc] of Object.entries(other)) {
        //TODO: Prompt on overwrite?
        userDescriptions[descId] = desc
    }
    saveDescriptions()
}
