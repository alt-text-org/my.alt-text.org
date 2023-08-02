function exportArchive() {
    const archive = getExportableDescriptions()
    const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(archive)}`

    const a = document.createElement("a")
    a.href = dataUrl
    a.download = "my-alt-text-org-archive.json"
    a.style.display = "fixed"
    a.style.top = "-1000"
    a.style.left = "-1000"

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

function openImport() {

}

function importArchive(file) {
    readJsonFile(file).then(json => importDescriptions(json)).catch(e => {
        console.log(e)
        alert("Failed to import JSON archive")
    })
}

function importMastodonTgz() {

}

function importMastodonJson(jsonFile, sampleUrl, reportPct) {
    readJsonFile(jsonFile).then(async mastoArchive => {
        const items = mastoArchive.orderedItems
        let noAlt = 0
        const toFetch = []

        items
            // NOTE: This could be replaced with a single `item?.object?.attachment?.length` check
            // depending on browser compatibility requirements.
            .filter(item => item.object && item.object.attachment && item.object.attachment.length)
            .map(item => item.object.attachment)
            .forEach((attachments) => {
                attachments
                    .filter(a => a.url && a.type === "Document" && a.mediaType.startsWith("image/"))
                    .forEach((attachment) => {
                        if (attachment.name) {
                            toFetch.push({
                                alt: attachment.name,
                                url: attachment.url,
                            })
                        } else {
                            noAlt++
                        }
                    })

            })

        if (toFetch.length > 0) {
            // NOTE: Replace with a dialog element potentially.
            const defaultAnswer = ""
            const answer = prompt("Please fill in your mastodon server media url", defaultAnswer)
            const url = new URL(answer)
            // TODO: This needs checking for traling slashes etc.
            const host = url.href

            toFetch.forEach(async (item) => {
                // TODO: addInFlight
                item.url = `${host}${item.url}`
            })
        }
    }).catch((e) => {
        console.log(e)
        alert("Failed to import from Mastodon")
    })
}

async function readJsonFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = async function () {
            try {
                resolve(JSON.parse(reader.result))
            } catch (e) {
                reject(e)
            }
        };
    })
}

