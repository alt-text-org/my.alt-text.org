import { MyAltTextOrg } from "./first.js"
import { getLocalized } from "./i18n.js"

MyAltTextOrg.const.OCR_FILTER_KEY = 'configs.ocr_filters';
MyAltTextOrg.ocrFilters = loadSettings(MyAltTextOrg.const.OCR_FILTER_KEY, {
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
)
MyAltTextOrg.ocrFilters.save = () => saveSettings(MyAltTextOrg.const.OCR_FILTER_KEY, MyAltTextOrg.ocrFilters)


MyAltTextOrg.const.GEN_CONFIG_KEY = 'configs.general';
MyAltTextOrg.composerConfigs = loadSettings(MyAltTextOrg.const.GEN_CONFIG_KEY, {
    gen: {
        __name: "General",
        keyboardCtl: {
            def: true,
            user: null,
            name: "Enable Keyboard Controls",
            desc: '',
            type: 'boolean',
            onChange: (oldVal, newVal) => {

            }
        },
        controlMoves: {
            def: 'canvas',
            user: null,
            name: 'Holding Control Moves',
            desc: '',
            type: 'options',
            options: ['Canvas', 'Crop'],
            onChange: (oldVal, newVal) => {

            }
        },
        discardCropsOnNewImg: {
            def: true,
            user: null,
            name: 'Discard Crops On New Image',
            desc: '',
            type: 'boolean',
            onChange: (oldVal, newVal) => {

            }
        },
        unicodeSingleChar: {
            def: true,
            user: null,
            name: 'Treat unicode as a single char when computing length',
            desc: '',
            type: 'boolean',
            onChange: (oldVal, newVal) => {

            }
        },
        liveSearch: {
            def: true,
            user: null,
            name: 'Search archive live',
            desc: '',
            type: 'boolean',
            onChange: (oldVal, newVal) => {

            }
        },
        defaultMaxLen: {
            def: 0,
            user: null,
            name: 'Default split length',
            desc: '',
            type: 'number',
            onChange: (oldVal, newVal) => {

            }
        }
    },
    a11y: {
        textAreaSize: {
            def: 0.25,
            user: null,
            name: "Composer Font Size",
            desc: '',
            type: 'slider',
            makeDemo: () => {
                const demoDiv = document.createElement("div")
                demoDiv.innerHTML = `
                    <textarea rows="4" cols="20">
                `
                return demoDiv
            },
            onChange: (oldVal, newVal) => {

            }
        },
        buttonFontSize: {
            def: 0.2,
            user: null,
            name: "Button Size",
            desc: '',
            type: 'slider',
            makeDemo: () => {
                const demoDiv = document.createElement("div")
                demoDiv.innerHTML = `
                    <div style="display: flex; flex-direction: row; gap: 20px; align-items: center; justify-content: flex-start">
                        <button class="emoji-button">💖</button>
                        <button>${getLocalized("textButtonDemo")}</button>
                    </div>
                `
                return demoDiv
            },
            onChange: (oldVal, newVal) => {

            }
        }
    }
})

processConfigs(MyAltTextOrg.composerConfigs)
MyAltTextOrg.composerConfigs.save = () => saveSettings(MyAltTextOrg.const.GEN_CONFIG_KEY, MyAltTextOrg.composerConfigs)

function processConfigs() {
    MyAltTextOrg.c = {}
    for (let [category, configs] of Object.entries(MyAltTextOrg.composerConfigs)) {
        MyAltTextOrg.c[category] = {}
        for (let [key, obj] of Object.entries(configs)) {
            MyAltTextOrg.c[category][key] = obj.user || obj.default
        }
    }
}

MyAltTextOrg.const.KEYB_CONFIG_KEY = 'config.keyboard';
MyAltTextOrg.keyboardControls = loadSettings(MyAltTextOrg.const.KEYB_CONFIG_KEY, [
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
])
MyAltTextOrg.keyboardControls.save = () => saveSettings(MyAltTextOrg.const.KEYB_CONFIG_KEY, MyAltTextOrg.keyboardControls)

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
