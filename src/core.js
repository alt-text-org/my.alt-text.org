async function cropExtractAndAddInFlight() {
    extractBtn.classList.add("loading")
    let cropped = crop()
    let allExtracted = []
    for (let crop of cropped) {
        let extracted = await extractText(crop);
        extracted.forEach(e => allExtracted.push(e))
    }

    console.log(JSON.stringify(allExtracted))

    for (let text of allExtracted.reverse()) {
        if (text) {
            addInFlight(text)
        }
    }
    extractBtn.classList.remove("loading")
}
