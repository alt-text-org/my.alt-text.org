MyAltTextOrg.controls = {
    8: { //Backspace
        composing: false,
        onkeyup: (_) => {
            const active = MyAltTextOrg.canvas.getActiveObject()
            if (active) {
                MyAltTextOrg.canvas.remove(active)
            }
        }
    },
    27: {
        composing: false,
        onkeyup: (_) => {
            hideEscapable()
        }
    }
}

document.body.addEventListener('keyup', (e) => {
    const key = MyAltTextOrg.controls[e.keyCode]
    if (key && e.isComposing === key.composing) {
        key.onkeyup(e)
    }
})