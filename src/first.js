MyAltTextOrg = {
    c: {}, // processed configuration
    f: {}, // functions
    cmd: [],
    exec: [],
    const: {},
    crops: {},
    dicts: {},
    palette: {},

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