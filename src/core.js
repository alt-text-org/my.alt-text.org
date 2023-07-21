async function cropExtractAndAddInFlight() {
    extractBtn.classList.add("loading")
    let cropped = crop()
    let extracted = await extractText(cropped);
    extractBtn.classList.remove("loading")
}

async function applyFilters(text) {

}