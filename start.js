let start = {
    createButton: (app) => {
        const button = new PIXI.Graphics();
        button.beginFill(0, 1);
        button.drawRect(window.innerWidth / 2 - 200, window.innerHeight / 2 + 100, 400, 50);
        button.interactive = true;
        button.buttonMode = true;
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 50,
            fill: "white",
            align: 'center'
        });
        button.addListener('pointerdown', () => {
            // game.restart();
        });
        app.stage.addChild(button)
        let message = new PIXI.Text("Create room", style);
        message.anchor.set(0.5);
        message.position.set(window.innerWidth / 2, window.innerHeight / 2 + 125);
        app.stage.addChild(message);
    },

    
}