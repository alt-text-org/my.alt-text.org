import { MyAltTextOrg, makeId } from "./first.js"

MyAltTextOrg.const.DESCRIPTION_KEY = "descriptions";

MyAltTextOrg.storage.userDescriptions = loadDescriptions()
MyAltTextOrg.storage.descByHash = {}

export function saveDescriptions() {
    try {
        window.localStorage.setItem(MyAltTextOrg.const.DESCRIPTION_KEY, JSON.stringify(MyAltTextOrg.storage.userDescriptions))
        hashIndexDescriptions()
    } catch (err) {
        alert("Alt text storage full.\nThis limit is set by the browser.\nPlease delete unused alt text to save new alt text.")
    }
}

function loadDescriptions() {
    return JSON.parse(window.localStorage.getItem(MyAltTextOrg.const.DESCRIPTION_KEY) || "{}")
}

export function saveDescription(desc) {
    desc.id = desc.id || makeId()
    let now = Date.now();
    desc.atime = now
    desc.mtime = now

    MyAltTextOrg.storage.userDescriptions[desc.id] = desc
    saveDescriptions()

    return desc.id
}

export function getDescriptionsForHash(imgHash) {
    return MyAltTextOrg.storage.descByHash[imgHash]
}

export function getRecentDescriptions(limit, imgHash) {
    let mtimeDescriptions = Object.values(MyAltTextOrg.storage.userDescriptions)
    if (imgHash) {
        mtimeDescriptions = mtimeDescriptions.filter(desc => desc.imgHash === imgHash)
    }

    mtimeDescriptions.sort((a, b) => b.mtime - a.mtime)
    return mtimeDescriptions.slice(0, limit).map(desc => desc.id)
}

function deleteDescription(descId) {
    delete MyAltTextOrg.storage.userDescriptions[descId]
    saveDescriptions()
}

export function getDescription(descId) {
    return MyAltTextOrg.storage.userDescriptions[descId]
}

export function getAllDescriptions() {
    return MyAltTextOrg.storage.userDescriptions
}


export function hashIndexDescriptions() {
    MyAltTextOrg.storage.descByHash = {}
    for (let [descId, desc] of Object.entries(MyAltTextOrg.storage.userDescriptions)) {
        if (!MyAltTextOrg.storage.descByHash[desc.imgHash]) {
            MyAltTextOrg.storage.descByHash[desc.imgHash] = {}
        }
        MyAltTextOrg.storage.descByHash[desc.imgHash][descId] = true
    }
}

function getExportableDescriptions() {
    return JSON.stringify(MyAltTextOrg.storage.userDescriptions)
}

function importDescriptions(other) {
    for (let [descId, desc] of Object.entries(other)) {
        //TODO: Prompt on overwrite?
        MyAltTextOrg.storage.userDescriptions[descId] = desc
    }
    saveDescriptions()
}
