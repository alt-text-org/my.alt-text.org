import { MyAltTextOrg } from "./first.js"

MyAltTextOrg.filterLibrary = {
    dictionary_filter: {
        name: 'Filter To Dictionary',
        desc: 'Remove all words not in dictionary',
        clean: dictionaryFilter,
        active: true
    },
    remove_newlines: {
        name: 'Solo | to I',
        desc: 'Replace pipes outside a word with an I',
        find: '/(\s)\|(\s)/g',
        replace: '$1|$2',
        active: true
    },
}

function dictionaryFilter(input) {
    if (!MyAltTextOrg.dicts[MyAltTextOrg.i18n.isoCode]) {
        const script = document.createElement("script")
        script.src = `dict/${MyAltTextOrg.i18n.isoCode}.js`
        document.body.appendChild(script)
        if (!MyAltTextOrg.dicts[MyAltTextOrg.i18n.isoCode]) {
            return
        }
    }
    const dict = MyAltTextOrg.dicts[MyAltTextOrg.i18n.isoCode]
    const savedWords = []
    for (let maybeWord of splitter.split(input)) {
        if (dict[maybeWord]) {
            savedWords.push(maybeWord)
        }
    }

    return savedWords.join(' ')
}
