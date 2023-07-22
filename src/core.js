updatePageLanguage()
showSplash()

async function cropExtractAndAddInFlight() {
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
    const backdrop = document.createElement("div")
    backdrop.classList.add("splash-backdrop")

    const wrapper = document.createElement("div")
    wrapper.classList.add("splash-wrapper")
    wrapper.innerHTML = `
<div class="splash">
    
    <h1 style="text-align: center"><u>My.Alt-Text.org</u></h1>
    <h2 style="text-align: center">Status: Alpha</h2>
    <h3 style="text-align: center">This is a tool to make alt text easier.</h3>
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
            the image to extract from. 100+ languages supported.
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
        <button style="font-size: 3rem; padding: 10px; background-color: #09173d; color: #cef0f5">Close</button>
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

function openHelp() {
    const backdrop = document.createElement("div")
    backdrop.classList.add("splash-backdrop")

    const wrapper = document.createElement("div")
    wrapper.classList.add("splash-wrapper")
    wrapper.innerHTML = `
<div>
    <h1 style="text-align: center"><u>My.Alt-Text.org</u></h1>
    <h2 style="text-align: center">Getting Started</h2>
    <p>
        There are three primary parts of the page:
    </p>
    <ul>
        <li><a rel="noopener" target="_blank" href="#the-image">The Image</a></li>
        <li><a rel="noopener" target="_blank" href="#the-work-area">The Work Area</a></li>
        <li><a rel="noopener" target="_blank" href="#the-archive">The Archive</a></li>
    </ul>
    <p>
        Each serves an important purpose in the flow of composing alt text.
    </p>
    <h2><a id="the-image">The Image</a></h2>
    <p>
        The primary purpose of the image area is displaying the image as you work on your description but
        it also supports Optical Character Recognition, or OCR. OCR extracts readable text from images, but it doesn't
        do a perfect job, and often sees random letters that aren't there in things like photographs. If you click and
        drag on the image, you'll create a crop rectangle. If any crop rectangles exist, only parts of the image in them
        will be analyzed to find text, and each one will pull its text into a separate result in the work area.
    </p>
    <p>
        Next to the extraction button is a button that allows you to change the language being extracted.
    </p>

    <h2><a id="the-work-area">The Work Area</a></h2>
    <p>
        The work area is below the image, and it's where you'll write descriptions. When you first open the page, no
        snippets will be there, you'll have to either use OCR on the image to extract text, or you can hit the ➕button
        on the left side to create a blank description. If it's too small, you can make it bigger by dragging the
        bottom right corner of the text area.
    </p>
    <p>
        You might have a bunch of snippets, especially if you're using OCR. You can click and drag on the 🤝 to drag one
        snippet into another. Once you're happy with the description you've made, you can either click the 💾 on the
        snippet to save just one, or the one to the right will save all the current in-progress descriptions. If you
        don't want a snippet, you can hit 🚮 on it to delete it. If you want to just clean up your work area, the 🚮 to
        the right will delete all in-progress snippets.
    </p>
    <p>
        Any descriptions you save are moved into...
    </p>

    <h2><a id="the-archive">The Archive</a></h2>
    <p>
        The archive has two main parts, the search bar and the results. When you first open the page, if you have
        anything in your archive, you'll see them sorted by the time they were last modified. You can enter search terms
        to filter them, but keep in mind the search operates on whole words.
    </p>
    <p>
        When you upload an image, the archive is filtered down to descriptions written for that image.
    </p>
    <p>
        If you'd like to edit an item in your archive, click its 📝 button, and a it will appear in the work area.
        Make any changes and then hit 💾 to save them to your archive. If you want to discard the changes but keep the
        old version, you can just hit 🚮 in the work area.
    </p>
    <p>
        Set Max Length on a description to get a view of it split on whitespace. If the description is too long to be
        attached to a single image, you can click 🌠 next to each section to get an "Alt Text Continued" image.
        That image will be localized if possible.
    </p>
    <div style="text-align: center; width: 100%">
        <button style="font-size: 3rem; padding: 10px; background-color: #09173d; color: #cef0f5" onclick="closeHelp()">Close</button>
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

function closeHelp() {
    document.body.removeChild(document.querySelector(".splash-backdrop"))
    document.body.removeChild(document.querySelector(".splash-wrapper"))
}
