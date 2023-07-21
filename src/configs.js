const defaultOcrFilters = {
    remove_newlines: {
        name: 'Remove Newlines',
        desc: 'Replace all newlines in the text with spaces',
        find: '\n',
        replace: ' ',
        active: true
    },
    collapse_whitespace: {
        name: 'Collapse Whitespace',
        desc: 'Collapse all chains of whitespace to a single space',
        find: /\s+/g,
        replace: ' ',
        active: true
    }
}

const OCR_FILTER_KEY = 'configs.ocr_filters';
window.MyAltTextOrg.ocrFilters = loadSettings(OCR_FILTER_KEY, defaultOcrFilters)
window.MyAltTextOrg.ocrFilters.save = () => saveSettings(OCR_FILTER_KEY, window.MyAltTextOrg.ocrFilters)

const defaultConfigs = {
    extractDelay: {
        def: 1000,
        user: null,
        name: "Auto Extraction Delay",
        desc: "",
        type: 'number',
        onchange: (oldVal, newVal) => {

        }
    },
    keyboardCtl: {
        def: true,
        user: null,
        name: "Enable Keyboard Controls",
        desc: '',
        type: 'boolean',
        onchange: (oldVal, newVal) => {

        }
    },
    controlMoves: {
        def: 'canvas',
        user: null,
        name: 'Holding Control Moves',
        desc: '',
        type: 'options',
        options: ['Canvas', 'Crop'],
        onchange: (oldVal, newVal) => {

        }
    },
    discardCropsOnNewImg: {
        def: true,
        user: null,
        name: 'Discard Crops On New Image',
        desc: '',
        type: 'boolean',
        onchange: (oldVal, newVal) => {

        }
    }
}

const GEN_CONFIG_KEY = 'configs.general';
window.MyAltTextOrg.composerConfigs = loadSettings(GEN_CONFIG_KEY, defaultConfigs)
window.MyAltTextOrg.conf = processConfigs(window.MyAltTextOrg.composerConfigs)
window.MyAltTextOrg.composerConfigs.save = () => saveSettings(GEN_CONFIG_KEY, window.MyAltTextOrg.composerConfigs)

function processConfigs(composerConfigs) {
    const result = {}
    for (let [key, obj] of Object.entries(window.MyAltTextOrg.composerConfigs)) {
        result[key] = obj.user || obj.default
    }

    return result
}

const defaultKeyboardControls = [
    {
        query: '*',
        name: 'Everywhere',
        controls: {
            focusCanvas: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            focusDescriptions: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            focusDescriptionSearch: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            uploadImage: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
        }
    },
    {
        query: '*:not(textarea, input[type=text])',
        name: "Everywhere Except Text Inputs",
        controls: {}
    },
    {
        query: '#cvs',
        name: 'Uploaded Image',
        controls: {
            moveLeft: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleLeft: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveRight: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleRight: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveUp: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleUp: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveDown: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleDown: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveTopLeft: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleTopLeft: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveTopRight: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleTopRight: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveBottomRight: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleBottomRight: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            moveBottomLeft: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
            scaleBottomLeft: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            },
        },
    },
    {
        query: '#filter-input',
        name: 'Archive Search',
        controls: {
            toggleImageBound: {
                key: '',
                shift: false,
                ctrl: false,
                name: '',
                desc: '',
                listeners: {}
            }
        }
    },
    {
        query: '#descriptions',
        name: 'Description List',
        controls: {}
    },
    {
        query: '.description',
        name: 'Individual Description',
        controls: {
            deleteDesc: {
                key: 8, //Delete
                shift: false,
                ctrl: true,
                name: '',
                desc: '',
                listeners: {}
            }
        },
    },
]
const KEYB_CONFIG_KEY = 'config.keyboard';
window.MyAltTextOrg.keyboardControls = loadSettings(KEYB_CONFIG_KEY, defaultKeyboardControls)
window.MyAltTextOrg.keyboardControls.save = () => saveSettings(KEYB_CONFIG_KEY, window.MyAltTextOrg.keyboardControls)

function loadSettings(key, def) {
    const savedVal = window.localStorage.getItem(key)
    if (savedVal) {
        return JSON.parse(savedVal)
    } else {
        return def
    }
}

function saveSettings(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val))
}