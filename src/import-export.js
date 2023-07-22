const importBtn = document.getElementById("import-btn")
const exportBtn = document.getElementById("export-btn")

importBtn.innerText = registerLocalizedElement(importBtn, "innerText", "importBtn")
exportBtn.innerText = registerLocalizedElement(exportBtn, "innerText", "exportBtn")

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

function importArchive() {

}

function importMastodon() {

}

