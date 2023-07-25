MyAltTextOrg = {
    c: {}, // processed configuration
    f: {}, // functions
    cmd: {},
    const: {},
    crops: {},
    dicts: {},

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