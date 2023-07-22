MyAltTextOrg = {
    c: {}, // processed configuration
    f: {}, // functions
    dicts: {},
    tesseract: {},
}

function makeId() {
    if (window.location.protocol === 'https:') {
        return crypto.randomUUID()
    } else {
        return `${Math.random()}`
    }
}
