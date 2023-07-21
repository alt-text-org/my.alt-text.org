const DESCRIPTION_KEY = "descriptions";

let userDescriptions = getAllDescriptions()

function saveDescriptions() {
    try {
        window.localStorage.setItem(DESCRIPTION_KEY, JSON.stringify(userDescriptions))
    } catch (err) {
        alert("Alt text storage full.\nThis limit is set by the browser.\nPlease delete unused alt text to save new alt text.")
    }
}

function saveDescription(descId, desc) {
    userDescriptions[descId] = desc
    saveDescriptions()
}

function deleteDescription(descId) {
    delete userDescriptions[descId]
    saveDescriptions()
}

function getDescription(descId) {
    return userDescriptions[descId]
}

function getRecentDescriptions(maxResults) {

}

function getAllDescriptions() {
    return JSON.parse(window.localStorage.getItem(DESCRIPTION_KEY) || "{}")
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
