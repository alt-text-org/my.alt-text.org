async function cropExtractAndAddInFlight() {
    extractBtn.classList.add("loading")
    let cropped = crop()
    let extracted = await extractText(cropped);
    for (let text in extracted.reverse()) {
        if (text) {
            addInFlight(text)
        }
    }
    extractBtn.classList.remove("loading")
}
