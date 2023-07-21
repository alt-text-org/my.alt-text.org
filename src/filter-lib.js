const filterLibrary = {
    dictionary_filter: {
        name: 'Collapse Whitespace',
        desc: 'Collapse all chains of whitespace to a single space',
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
    if (!window.MyAltTextOrg.dicts)




    const savedWords = []
    for (let maybeWord of splitter.split(input)) {

    }

    return savedWords.join(' ')
}