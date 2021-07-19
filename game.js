let game = {
    size: 3,
    board: null,
    gameEnd: false,
    margin: null,
    turn: 0,

    setupBoard: () => {
        game.board = new Array(game.size);
        for (var i = 0; i < game.size; i++) {
            game.board[i] = new Array(game.size);
        }
    },

    setupGraphicBoard: (app, margin = 10) => {
        game.margin = margin
        app.stage.addChild(game.createSquare(app, 0, 0, 0));
        app.stage.addChild(game.createSquare(app, (window.innerWidth) / 3.0 - game.margin / 2, 0, 1));
        app.stage.addChild(game.createSquare(app, 2 * (window.innerWidth) / 3.0 - game.margin, 0, 2));
        app.stage.addChild(game.createSquare(app, 0, (window.innerHeight) / 3.0 - game.margin / 2, 3));
        app.stage.addChild(game.createSquare(app, (window.innerWidth) / 3.0 - game.margin / 2, (window.innerHeight) / 3.0 - game.margin / 2, 4));
        app.stage.addChild(game.createSquare(app, 2 * (window.innerWidth) / 3.0 - game.margin, (window.innerHeight) / 3.0 - game.margin / 2, 5));
        app.stage.addChild(game.createSquare(app, 0, 2 * (window.innerHeight) / 3.0 - game.margin, 6));
        app.stage.addChild(game.createSquare(app, (window.innerWidth) / 3.0 - game.margin / 2, 2 * (window.innerHeight) / 3.0 - game.margin, 7));
        app.stage.addChild(game.createSquare(app, 2 * (window.innerWidth) / 3.0 - game.margin, 2 * (window.innerHeight) / 3.0 - game.margin, 8));
    },

    restart: () => {
        window.location.reload()
    },

    drawCircle: (app, radius, start, step, x, y) => {
        let circ = new PIXI.Graphics();
        circ.lineStyle(game.margin, 0xFFFFFF, 1);
        circ.drawCircle(0, 0, radius);

        circ.x = x + ((window.innerWidth) / 3) / 2;
        circ.y = y + ((window.innerHeight) / 3) / 2;
        circ.alpha = start
        function gameLoop() {

            if (circ.alpha < 1) {
                requestAnimationFrame(gameLoop);
                circ.alpha += step
            }
        }
        gameLoop();
        app.stage.addChild(circ);
    },

    drawCross: (app, radius, start, step, x, y) => {
        let line = new PIXI.Graphics();
        line.lineStyle(game.margin, 0xFFFFFF, 1);
        line.moveTo(-radius, -radius);
        line.lineTo(radius, radius);
        line.moveTo(radius, -radius);
        line.lineTo(-radius, radius);
        line.x = x + ((window.innerWidth) / 3) / 2;
        line.y = y + ((window.innerHeight) / 3) / 2;
        line.alpha = start
        function gameLoop() {

            if (line.alpha < 1) {
                requestAnimationFrame(gameLoop);
                line.alpha += step
            }
        }
        gameLoop();
        app.stage.addChild(line);
    },

    checkWin: () => {
        let sumDiag = 0
        let sumRDiag = 0
        let countUsed = 0
        for (i = 0; i < game.size; i++) {
            let sumRow = 0
            let sumCol = 0
            sumDiag += game.board[i][i]
            sumRDiag += game.board[i][game.size - 1 - i]
            for (j = 0; j < game.size; j++) {
                sumRow += game.board[i][j]
                sumCol += game.board[j][i]
                if (game.board[i][j]) {
                    countUsed++
                }
            }
            if (sumRow === 3 || sumCol === 3) {
                return 1
            } else if (sumRow === -3 || sumCol === -3) {
                return -1
            }
        }
        if (sumDiag === 3 || sumRDiag === 3) {
            return 1
        } else if (sumDiag === -3 || sumRDiag === -3) {
            return -1
        } else if (countUsed === 9) {
            return 0
        }
        return undefined
    },

    onClick: (boxNum, x, y) => {
        let maxsize = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight
        let radius = ((maxsize) / 3.0 - game.margin) / 6.0
        if (game.board[parseInt(boxNum / 3)][boxNum % 3] === undefined && !game.gameEnd) {
            if (game.turn === 0) {
                game.drawCircle(app, radius, 0.1, 0.01, x, y)
                game.board[parseInt(boxNum / 3)][boxNum % 3] = -1
            } else {
                game.drawCross(app, radius, 0.1, 0.01, x, y)
                game.board[parseInt(boxNum / 3)][boxNum % 3] = 1
            }
            game.turn = ++game.turn % 2
            let winner = game.checkWin()
            if (winner !== undefined) {
                let style = new PIXI.TextStyle({
                    fontFamily: "Arial",
                    fontSize: 50,
                    fill: "white",
                    align: 'center'
                });
                const background = new PIXI.Graphics();
                background.beginFill(0, 1);
                background.drawRect(window.innerWidth / 2 - 150, window.innerHeight / 2 - 50, 300, 100);
                app.stage.addChild(background)
                if (winner === -1) {
                    let message = new PIXI.Text("Circle Win", style);
                    message.anchor.set(0.5);
                    message.position.set(window.innerWidth / 2, window.innerHeight / 2);
                    app.stage.addChild(message);
                } else if (winner === 1) {
                    let message = new PIXI.Text("Cross Win", style);
                    message.anchor.set(0.5);
                    message.position.set(window.innerWidth / 2, window.innerHeight / 2);
                    app.stage.addChild(message);
                } else {
                    let message = new PIXI.Text("Draw", style);
                    message.anchor.set(0.5);
                    message.position.set(window.innerWidth / 2, window.innerHeight / 2);
                    app.stage.addChild(message);
                }

                game.gameEnd = true
                game.restartButton(app)
            }
            console.log(boxNum)
        }
    },

    createSquare: (app, x, y, boxNum) => {
        let square = new PIXI.Graphics();
        square.lineStyle(game.margin, 0x99CCFF, 1);
        square.drawPolygon([
            0, 0,
            (window.innerWidth) / 3, 0,
            (window.innerWidth) / 3, (window.innerHeight) / 3,
            0, (window.innerHeight) / 3,
            0, 0,
        ]);

        var texture = app.renderer.generateTexture(square);
        var sprite = new PIXI.Sprite(texture);
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.x = x;
        sprite.y = y;
        sprite.on('pointerdown', () => game.onClick(boxNum, x, y));


        return sprite
    },

    restartButton: (app) => {
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
            game.restart();
        });
        app.stage.addChild(button)
        let message = new PIXI.Text("Press to restart", style);
        message.anchor.set(0.5);
        message.position.set(window.innerWidth / 2, window.innerHeight / 2 + 125);
        app.stage.addChild(message);
    }
}