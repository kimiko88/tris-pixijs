const utils = {
    clearGraphics: (app) => {
        for (var i = app.stage.children.length - 1; i >= 0; i--) { app.stage.removeChild(app.stage.children[i]); };
        Object.keys(PIXI.utils.TextureCache).forEach(function (texture) { PIXI.utils.TextureCache[texture].destroy(true); });
    }
}