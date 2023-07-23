MyAltTextOrg = {
    c: {}, // processed configuration
    f: {}, // functions
    const: {},
    dicts: {},
    crops: {},

    desc: {},
    i18n: {},
    storage: {},
    tesseract: {},

}

function makeId() {
    if (window.location.protocol === 'https:') {
        return crypto.randomUUID()
    } else {
        return `${Math.random()}`
    }
}