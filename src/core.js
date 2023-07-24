async function cropExtractAndAddInFlight() {
    const extractBtn = document.getElementById("extract-btn")

    extractBtn.classList.add("loading")
    let cropped = crop()
    let allExtracted = []
    for (let crop of cropped) {
        let extracted = await extractText(crop);
        extracted.forEach(e => allExtracted.push(e))
    }

    for (let text of allExtracted.reverse()) {
        if (text) {
            addInFlight(text)
        }
    }
    extractBtn.classList.remove("loading")
}

function showSplash() {
    const dialog = document.querySelector("dialog.splash")

    dialog?.showModal()
    dialog?.addEventListener("click", function onclick() {
        dialog.close()
    })
}

function openHelp() {
    const help = document.querySelector(".help-dialog")

    help?.showModal()
    help?.addEventListener("click", () => {
        help.close()
    })
}

function focusClick(id) {
    document.getElementById(id).click();
}
