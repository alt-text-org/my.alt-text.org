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

export function importArchive(file) {
    readJsonFile(file).then(json => importDescriptions(json)).catch(e => {
        console.log(e)
        alert("Failed to import JSON archive")
    })
}

function importMastodonTgz() {

}

function importMastodonJson(jsonFile, sampleUrl, reportPct) {
    const host = new URL(sampleUrl).host
    readJsonFile(jsonFile).then(async mastoArchive => {
        const items = mastoArchive.orderedItems
        let noAlt = 0
        let toFetch = []
        for (let [note] of items) {
            if (note.object && note.object.attachment) {
                for (let attach of note.object.attachment) {
                    if (attach.type === "Document"
                        && attach.mediaType.startsWith("image/")
                        && attach.url
                    ) {
                        if (attach.name) {
                            toFetch.push({
                                alt: attach.name,
                                url: `${host}${attach.url}`
                            })
                        } else {
                            noAlt++
                        }
                    }
                }
            }
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

