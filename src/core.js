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

showSplash()

function showSplash() {
    const backdrop = document.createElement("div")
    backdrop.classList.add("splash-backdrop")

    const wrapper = document.createElement("div")
    wrapper.classList.add("splash-wrapper")
    wrapper.innerHTML = `
<div class="splash">
    
    <h1 style="text-align: center">My.Alt-Text.org</h1>
    <h2 style="text-align: center">Status: Alpha</h2>
    <h3 style="text-align: center">This is a tool to make alt text easier</h3>
    <p>
        I write a lot of alt text, and it's always struck me how useless the user interface offered by every social
        media site is. I wanted to build the composer I wished they had. This is a start. It's going to get even better.
    </p>
    <p>
        What it is not, is accessible. Yet. I am an inexperienced frontend developer, and the ingredients of a
        modern website have inaccessibility baked in. I tried to find help pre-alpha, but had no luck, and decided that
        a limited release was the most likely path to folks gaining interest in the project. An alpha release means it
        works for the author(s), a beta has to work for everyone that wants in, and we won't go live until it's as open
        as possible.
    </p>
    <p>
        So what is it? It's a site offering a set of tools, a small set right now, designed to make writing and saving
        alt text easier. A short list:
    </p>
    <ul>
        <li>An archive of all the descriptions you write with it, searchable by text or image</li>
        <li>
            Optical Character Recognition (OCR) turned up to the next level. The ability to pre-select which areas of
            the image to extract from.
        </li>
        <li>
            Unicode-aware split-on-whitespace for limited character counts, except you can go back and edit the whole
            description.
        </li>
        <li>Generation of localized "Additional Alt Text" images if needed</li>
        <li>It's a static site, and no data leaves your computer.</li>
    </ul>
    <p>
        Pouring this foundation opens up a place to build more advanced tools, and I want to do everything I can to
        make the web more accessible. The roadmap includes:
    </p>
    <ul>
        <li>Accessibility. This is a tool for everyone.</li>
        <li>Browser extensions. Use this tool inline on any site.</li>
        <li>
            Archive in the extensions can save the images alongside the alt text. Search your image library based on
            its alt text.
        </li>
        <li>Integration with social media where possible. Streamline the process of posting with alt text</li>
        <li>Undo support</li>
        <li>
            Advanced user configurable filters for processing the sometimes messy output of Tesseract, with a spot to
            share them
        </li>
        <li>Ability to import/export your archive</li>
        <li>An ecosystem for plugins</li>
        <li>In-page guidance for writing quality alt text</li>
        <li>Support for PDFs</li>
        <li>Ability to tag your descriptions</li>
    </ul>
    <p>
        This is an alpha release, things are going to break. I hope those that are able will play with it and give me
        feedback on <a href="https://github.com/alt-text-org/my.alt-text.org">GitHub</a> or
        <a href="https://social.alt-text.org/@hannah">Mastodon</a>
    </p>
    <div style="text-align: center; width: 100%">
        <button style="font-size: 3rem; padding: 10px">Close</button>
    </div>
</div>
    `
    document.body.appendChild(backdrop)
    document.body.appendChild(wrapper)
    backdrop.style.opacity = "0.5"
    wrapper.style.opacity = "1"

    wrapper.onclick = () => {
        document.body.removeChild(backdrop)
        document.body.removeChild(wrapper)
    }
}

function buildDropdown(onSelection) {
    let html = `
             <div class="dropdown" aria-label="PLACEHOLDER">
                <button onclick="openDropdown('page-lang-dropdown', 'page-lang-text')"
                        class="drop-btn">
                    <img src="images/dropdown.svg" class="inline-icon" id="magnifying-glass-icon" aria-hidden="true"
                         alt="">
                    <span id="current-page-lang"></span>
                </button>
                <div id="page-lang-dropdown" class="dropdown-content">
                    <div class="search-wrapper rounded-top">
                        <img src="images/dropdown.svg" class="inline-icon" aria-hidden="true" alt="">
                        <input id="page-lang-text" class="search-input" type="text" placeholder=""
                               aria-label="Page Language"
                               onkeyup="filterPageLangs()">
                    </div>
                    <div id="page-lang-options" class="dropdown-options"></div>
                    <a id="add-translation-link" target="_blank" rel="noreferrer noopener"
                       href="https://github.com/alt-text-org/ocrop/issues/new?&template=translation.md&title=%5BTranslation%5D+Language"></a>
                </div>
            </div>
    `
    const wrapper = document.createElement("div")
}