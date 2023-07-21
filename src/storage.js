const DESCRIPTION_KEY = "descriptions";

const userDescriptions = getAllDescriptions()
let descByHash = hashIndexDescriptions()

function saveDescriptions() {
    try {
        window.localStorage.setItem(DESCRIPTION_KEY, JSON.stringify(userDescriptions))
    } catch (err) {
        alert("Alt text storage full.\nThis limit is set by the browser.\nPlease delete unused alt text to save new alt text.")
    }
}

function saveDescription(desc) {
    function makeId() {
        if (window.location.protocol === 'https:') {
            return Crypto.randomUUID()
        } else {
            return `${Math.random()}`
        }
    }

    const descId = makeId()
    desc.id = descId
    userDescriptions[descId] = desc
    saveDescriptions()

    return descId
}

function deleteDescription(descId) {
    delete userDescriptions[descId]
    saveDescriptions()
}

function getDescription(descId) {
    return userDescriptions[descId]
}

function getRecentDescriptions(maxResults) {
    const recent = Object
}

function getDescriptionsForHash(imgHash) {
    const descriptions = (descByHash[imgHash] || []).map(descId => userDescriptions[descId])
    descriptions.sort()
    return descriptions
}

function getAllDescriptions() {
    return JSON.parse(window.localStorage.getItem(DESCRIPTION_KEY) || "{}")
}

function hashIndexDescriptions() {
    const result = {}
    for (let [descId, desc] of Object.entries(userDescriptions)) {
        if (!descByHash[desc.hash]) {
            descByHash[desc.imgHash] = []
        }
        descByHash[desc.imgHash].push(descId)
    }

    return result
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
