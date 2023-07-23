(async () => {
    await initOcr()

    let userLang = window.navigator.language.split('-')[0];
    updatePageLanguage(MyAltTextOrg.i18n.pageText[userLang] ? userLang : MyAltTextOrg.const.DEFAULT_PAGE_LANG)
    initializeSearch()
    updateDescriptionDisplay()
    hashIndexDescriptions()
    showSplash()
})().then(() => {
    (() => {
        addDropdown(
            "page-lang-dropdown",
            "page-lang-btn",
            "page-lang-lbl",
            MyAltTextOrg.i18n.current.displayName,
            MyAltTextOrg.i18n.pageOptions,
            (display, isoLang) => {
                const label = document.getElementById("page-lang-lbl")
                label.innerText = display
                updatePageLanguage(isoLang)
            },
            makePageLangFooter(),
            {
                searchPlaceholder: "langSearchPlaceholder",
                searchLabel: "pageLangSearchLbl",
                notFound: "noLangsFound"
            }
        )


        addDropdown(
            "extract-lang-dropdown",
            "extract-lang-btn",
            "extract-lang-lbl",
            MyAltTextOrg.const.DEFAULT_EXTRACTION_LANG_HUMAN,
            MyAltTextOrg.tesseract.humanToTesseractLang,
            async (display, tessLang) => {
                const label = document.getElementById("extract-lang-lbl")
                label.innerText = display
                await setExtractionLang(tessLang)
            },
            null,
            {
                searchPlaceholder: "langSearchPlaceholder",
                searchLabel: "pageLangSearchLbl",
                notFound: "noLangsFound"
            }
        )
    })();

    (() => {
        // const importBtn = document.getElementById("import-btn")
        // const exportBtn = document.getElementById("export-btn")
        // const importArchiveBtn = document.getElementById("import-archive-btn")
        // const importArchiveLbl = document.getElementById("import-archive-lbl")
        // const openMastoImport = document.getElementById("open-masto-import")
        // const importMastoBtn = document.getElementById("import-masto-btn")
        // const importMastoLbl = document.getElementById("import-masto-lbl")
        //
        // importBtn.innerHTML = registerLocalizedElement(importBtn, "innerHTML", "importBtn")
        // exportBtn.innerHTML = registerLocalizedElement(exportBtn, "innerHTML", "exportBtn")
// importArchiveLbl.innerText = registerLocalizedElement(importArchiveLbl, "innerHTML", "importArchiveBtn")
// importMastoLbl.innerText = registerLocalizedElement(importMastoLbl, "innerHTML", "importMastoBtn")

// importArchiveBtn.addEventListener('change', async () => {
//     const file = importArchiveBtn.files[0]
//     await importArchive(file)
// }, false);
    })();

    (() => {
        // Static elements
        const extractBtn = document.getElementById("extract-btn")
        const uploadLbl = document.getElementById("upload-label")
        const filterInput = document.getElementById("filter-input")
        const topUploadLbl = document.getElementById('open-file-lbl')
        const closeImgBtn = document.getElementById('clear-image')
        const pageLangName = document.getElementById("page-lang-name")
        const helpBtn = document.getElementById("help-button")

        helpBtn.innerHTML = registerLocalizedElement(helpBtn, "innerHTML", "help")
        pageLangName.innerHTML = registerLocalizedElement(pageLangName, "innerHTML", "langButtonPrefixTxt")
        extractBtn.innerHTML = registerLocalizedElement(extractBtn, "innerHTML", "extractBtnTxt")
        uploadLbl.innerHTML = registerLocalizedElement(uploadLbl, "innerHTML", "centralUploadInstr")
        topUploadLbl.innerHTML = registerLocalizedElement(topUploadLbl, "innerHTML", "topUploadLbl")
        filterInput.placeholder = registerLocalizedElement(filterInput, "placeholder", "searchPrompt")
        closeImgBtn.innerHTML = registerLocalizedElement(closeImgBtn, "innerHTML", 'closeImage')
    })();

    document.getElementById("main").style.display = "flex"
});

