/*
MyAltTextOrg.palette.keys = CSS keys alongside descriptions
MyAltTextOrg.palette.live = The current color scheme
MyAltTextOrg.palette.last = The scheme when the window was opened
MyAltTextOrg.palette.saved = Saved palettes
MyAltTextOrg.palette.default = Palette extracted from CSS
 */

MyAltTextOrg.palette.keys = {
    'background': {
        short: "Background",
        long: "The page's background"
    },
    'live': {
        short: "Live",
        long: "Enabled buttons and other controls"
    },
    'engaged': {
        short: "Engaged",
        long: "Buttons under the mouse or focused"
    },
    'disabled': {
        short: "Disabled",
        long: "Disabled buttons and other controls"
    },
    'border': {
        short: "Borders",
        long: "Borders around buttons and work areas"
    },
    'item': {
        short: "Items",
        long: "Background of items such as saved or in-progress alt text"
    },
    'editable': {
        short: "Editable",
        long: "Fields which can be altered directly"
    },
    'readable': {
        short: "Read-only",
        long: "Fields which cannot be altered directly"
    },
    'shadow': {
        short: "Shadows",
        long: "The shadows under buttons and borders"
    },
    'text': {
        short: "Text",
        long: "All text on the page"
    }
}

MyAltTextOrg.palette.saved = {
    "Greyscale": {
        'background': '#828282',
        'live': '#e2e2e2',
        'engaged': '#dddddd',
        'disabled': '#181818',
        'border': '#42345e',
        'item': '#dedede',
        'editable': '#141414',
        'readable': '#292929',
        'shadow': '#686969',
        'text': '#dcdcdc'
    },
}

function initPalette() {
    const paletteNamesStr = window.localStorage.getItem("conf.palettes")
    if (paletteNamesStr) {
        const paletteNames = JSON.parse(paletteNamesStr)
        MyAltTextOrg.palette.saved = {}
        paletteNames.forEach(name => {
            MyAltTextOrg.palette.saved[name] = JSON.parse(window.localStorage.getItem(`conf.palettes.${name}`))
        })
    }

    const root = document.querySelector(':root');
    const computed = window.getComputedStyle(root)
    MyAltTextOrg.palette.default = {}
    Object.keys(MyAltTextOrg.palette.keys).forEach(key => {
        MyAltTextOrg.palette.default[key] = computed.getPropertyValue(`--${key}`).trim()
    })

    const activePalette = window.localStorage.getItem("conf.live_palette")
    let palette
    if (activePalette) {
        palette = JSON.parse(activePalette)
    } else {
        palette = copyPalette(MyAltTextOrg.palette.default)
    }

    MyAltTextOrg.palette.live = copyPalette(palette)
    updatePaletteEditor()
    applyPalette(palette)
}

function updatePaletteEditor() {
    const wrapper = document.getElementById("palette-wrapper")
    wrapper.innerHTML = ''

    const openButton = document.createElement("button")
    openButton.classList.add("page-button")
    openButton.innerHTML = "Saved&nbsp;Color&nbsp;Schemes"

    const saveNameEle = document.createElement("input")
    const savedPaletteOptions = []
    let savedNames = Object.keys(MyAltTextOrg.palette.saved);
    savedNames.sort((a, b) => compareStr(a, b))
    savedNames.forEach(name => {
        savedPaletteOptions.push({
            display: name,
            closeMenu: true,
            makeElement: () => makeColorSchemeOption(name, saveNameEle)
        })
    })

    const defaultButton = document.createElement("button")
    defaultButton.classList.add("dropdown-option", "read-only")
    defaultButton.innerHTML = "Default"
    defaultButton.addEventListener("click", (e) => {
        e.stopPropagation()
        setLivePalette("Default")
        saveNameEle.value = ""
        hideEscapable()
    })

    let dropdownMenu = buildComplexDropdownMenu(openButton, savedPaletteOptions, defaultButton);
    wrapper.appendChild(dropdownMenu)

    Object.entries(MyAltTextOrg.palette.keys).forEach(([key, display]) => {
        const categoryWrapper = document.createElement("div")
        categoryWrapper.classList.add("palette-entry")
        categoryWrapper.title = display.long
        categoryWrapper.innerHTML = `<label for="palette-${key}-input">${display.short}</label>`

        const colorChanger = document.createElement("input")
        colorChanger.type = "color"
        colorChanger.value = MyAltTextOrg.palette.live[key]
        colorChanger.id = `palette-${key}-input`
        colorChanger.name = `palette-${key}-input`
        categoryWrapper.prepend(colorChanger)
        wrapper.appendChild(categoryWrapper)

        colorChanger.addEventListener("input", () => {
            MyAltTextOrg.palette.live[key] = colorChanger.value
            applyPalette(MyAltTextOrg.palette.live)
        })
    })

    const buttonWrapper = document.createElement("div")
    buttonWrapper.id = "palette-chooser-buttons"

    const done = document.createElement("button")
    done.classList.add("page-button")
    done.innerHTML = "Done"
    buttonWrapper.appendChild(done)
    done.addEventListener("click", () => {
        window.localStorage.setItem("conf.live_palette", JSON.stringify(MyAltTextOrg.palette.live))
        hidePaletteChooser()
    })

    const saveWrapper = document.createElement("div")
    saveWrapper.classList.add("bordered-area")

    const save = document.createElement("button")
    save.classList.add("page-button")
    save.innerHTML = "Save&nbsp;As"
    saveNameEle.type = "text"
    saveNameEle.placeholder = "Untitled"
    saveWrapper.appendChild(save)
    saveWrapper.appendChild(saveNameEle)

    save.addEventListener("click", () => {
        savePalette(saveNameEle.value || "Untitled", MyAltTextOrg.palette.live)
        updatePaletteEditor()
    })
    buttonWrapper.appendChild(saveWrapper)

    const cancel = document.createElement("button")
    cancel.classList.add("page-button")
    cancel.innerHTML = "Cancel"
    buttonWrapper.appendChild(cancel)
    cancel.addEventListener("click", () => {
        MyAltTextOrg.palette.live = copyPalette(MyAltTextOrg.palette.last)
        applyPalette(MyAltTextOrg.palette.live)
        hidePaletteChooser()
    })

    wrapper.appendChild(buttonWrapper)
}

function makeColorSchemeOption(name, saveName) {
    const optionButton = document.createElement("button")
    optionButton.classList.add("dropdown-option", "spread-option")
    optionButton.innerHTML = `<span>${name}</span>`
    optionButton.addEventListener("click", (e) => {
        e.stopPropagation()
        const newPalette = setLivePalette(name)
        MyAltTextOrg.palette.live = copyPalette(newPalette)
        saveName.value = name
    })

    const deleteButton = document.createElement("button")
    deleteButton.classList.add("page-button", "emoji-button")
    deleteButton.title = "Delete this saved color scheme"
    deleteButton.innerText = "🚮"
    optionButton.appendChild(deleteButton)
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation()
        deletePalette(name)
        optionButton.style.display = "none"
    })

    return optionButton
}

function setLivePalette(name) {
    let savedPalette;
    if (name === "Default") {
        savedPalette = copyPalette(MyAltTextOrg.palette.default)
    } else {
        savedPalette = copyPalette(MyAltTextOrg.palette.saved[name]);
    }

    applyPalette(savedPalette)
    return savedPalette
}

function savePalette(name, palette) {
    MyAltTextOrg.palette.saved[name] = copyPalette(palette)
    window.localStorage.setItem(`conf.palettes.${name}`, JSON.stringify(palette))
    window.localStorage.setItem("conf.palettes", JSON.stringify(Object.keys(MyAltTextOrg.palette.saved)))
}

function deletePalette(name) {
    delete MyAltTextOrg.palette.saved[name]
    window.localStorage.removeItem(`conf.pallets.${name}`)
    window.localStorage.setItem("conf.palettes", JSON.stringify(Object.keys(MyAltTextOrg.palette.saved)))
}

function applyPalette(palette) {
    const root = document.querySelector(':root');
    Object.keys(MyAltTextOrg.palette.keys).forEach(key => {
        root.style.setProperty(`--${key}`, palette[key])
        document.getElementById(`palette-${key}-input`).value = palette[key]
    })

    updateSvgColor('.text-svg', palette.text)
    updateSvgColor('.live-svg', palette.live)
}

function copyPalette(palette) {
    const newPalette = {}
    Object.keys(MyAltTextOrg.palette.keys).forEach(key => newPalette[key] = palette[key])
    return newPalette
}

function showPaletteChooser() {
    MyAltTextOrg.palette.last = copyPalette(MyAltTextOrg.palette.live)
    document.getElementById("palette-wrapper").style.display = "flex"
}

function hidePaletteChooser() {
    document.getElementById("palette-wrapper").style.display = "none"
}

function updateSvgColor(query, hexColor) {
    let rgb = hexToRgb(hexColor);
    const [r, g, b] = rgb
    const color = new Color(r, g, b);
    const solver = new Solver(color);
    const result = solver.solve();
    const filter = result.filter.replaceAll("filter: ", "").replace(';', '')
    document.querySelectorAll(query).forEach(svg => {
        svg.style.filter = filter
    })
}


// The below is from https://codepen.io/sosuke/pen/Pjoqqp?editors=0010, MIT licensed

class Color {
    constructor(r, g, b) {
        this.set(r, g, b);
    }

    toString() {
        return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
    }

    set(r, g, b) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);
    }

    hueRotate(angle = 0) {
        angle = angle / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
        ]);
    }

    grayscale(value = 1) {
        this.multiply([
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value),
        ]);
    }

    sepia(value = 1) {
        this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
        ]);
    }

    saturate(value = 1) {
        this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
        ]);
    }

    multiply(matrix) {
        const newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
        const newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
        const newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    brightness(value = 1) {
        this.linear(value);
    }

    contrast(value = 1) {
        this.linear(value, -(0.5 * value) + 0.5);
    }

    linear(slope = 1, intercept = 0) {
        this.r = this.clamp(this.r * slope + intercept * 255);
        this.g = this.clamp(this.g * slope + intercept * 255);
        this.b = this.clamp(this.b * slope + intercept * 255);
    }

    invert(value = 1) {
        this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
        this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
        this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
    }

    hsl() {
        // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;

                case g:
                    h = (b - r) / d + 2;
                    break;

                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {
            h: h * 100,
            s: s * 100,
            l: l * 100,
        };
    }

    clamp(value) {
        if (value > 255) {
            value = 255;
        } else if (value < 0) {
            value = 0;
        }
        return value;
    }
}

class Solver {
    constructor(target, baseColor) {
        this.target = target;
        this.targetHSL = target.hsl();
        this.reusedColor = new Color(0, 0, 0);
    }

    solve() {
        const result = this.solveNarrow(this.solveWide());
        return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values),
        };
    }

    solveWide() {
        const A = 5;
        const c = 15;
        const a = [60, 180, 18000, 600, 1.2, 1.2];

        let best = {loss: Infinity};
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
                best = result;
            }
        }
        return best;
    }

    solveNarrow(wide) {
        const A = wide.loss;
        const c = 2;
        const A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
        return this.spsa(A, a, c, wide.values, 500);
    }

    spsa(A, a, c, values, iters) {
        const alpha = 1;
        const gamma = 0.16666666666666666;

        let best = null;
        let bestLoss = Infinity;
        const deltas = new Array(6);
        const highArgs = new Array(6);
        const lowArgs = new Array(6);

        for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, gamma);
            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
                best = values.slice(0);
                bestLoss = loss;
            }
        }
        return {values: best, loss: bestLoss};

        function fix(value, idx) {
            let max = 100;
            if (idx === 2 /* saturate */) {
                max = 7500;
            } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
                max = 200;
            }

            if (idx === 3 /* hue-rotate */) {
                if (value > max) {
                    value %= max;
                } else if (value < 0) {
                    value = max + value % max;
                }
            } else if (value < 0) {
                value = 0;
            } else if (value > max) {
                value = max;
            }
            return value;
        }
    }

    loss(filters) {
        // Argument is array of percentages.
        const color = this.reusedColor;
        color.set(0, 0, 0);

        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6);
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);

        const colorHSL = color.hsl();
        return (
            Math.abs(color.r - this.target.r) +
            Math.abs(color.g - this.target.g) +
            Math.abs(color.b - this.target.b) +
            Math.abs(colorHSL.h - this.targetHSL.h) +
            Math.abs(colorHSL.s - this.targetHSL.s) +
            Math.abs(colorHSL.l - this.targetHSL.l)
        );
    }

    css(filters) {
        function fmt(idx, multiplier = 1) {
            return Math.round(filters[idx] * multiplier);
        }

        return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
    }
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ]
        : null;
}