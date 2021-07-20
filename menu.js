const menu = {
    createButton: (app, text, size, func) => {
        const button = new PIXI.Graphics();
        button.beginFill(0, 1);
        button.drawRect(size.x - size.width / 2, size.y + 2 * size.height, size.width, size.height);
        button.interactive = true;
        button.buttonMode = true;
        let min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: min / 12,
            fill: "white",
            align: 'center'
        });
        button.addListener('pointerdown',
            func
        );
        app.stage.addChild(button)
        let message = new PIXI.Text(text, style);
        message.anchor.set(0.5);
        message.position.set(size.x, size.y + 2 * size.height + size.height / 2);
        app.stage.addChild(message);
    },

    createMenu(app) {
        let min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth
        let style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: min / 8,
            fill: "white",
            align: 'center',
            stroke: '#ff3300',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6
        });
        let label = new PIXI.Text('TIC TAC TOE', style);
        label.anchor.set(0.5);
        label.position.set(window.innerWidth / 2, window.innerHeight / 2 - 4 * (window.innerHeight / 12));
        app.stage.addChild(label);
        menu.createButton(app, "Create Room", { width: window.innerWidth, height: window.innerHeight / 10, x: window.innerWidth / 2, y: window.innerHeight / 10 }, () => { menu.create(app) })
        menu.createButton(app, "Join Room", { width: window.innerWidth, height: window.innerHeight / 10, x: window.innerWidth / 2, y: window.innerHeight / 10 + window.innerHeight / 5 }, () => { menu.join() })
    },

    copyTextToClipboard: async (text) => {
       
        try {
            await navigator.clipboard.writeText(text);
            alert('Code copied to clipboard');
        } catch (err) {
            const el = document.createElement('input')
            el.type = "text";
            el.value = text
            document.body.appendChild(el)
            el.select()
            el.setSelectionRange(0, 99999); /* For mobile devices */
            document.execCommand('copy')
            document.body.removeChild(el)
            alert('Code copied to clipboard321');
        }
    },

    create(app) {
        socket.connect();
        socket.emit('create');
        socket.on('code', function (data) {
            utils.clearGraphics(app)
            const button = new PIXI.Graphics();
            button.beginFill(0, 1);
            button.drawRect(0, window.innerHeight / 2 - (window.innerHeight / 24), window.innerWidth, window.innerHeight / 12);
            app.stage.addChild(button)
            let min = window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth
            let style = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: min / 12,
                fill: "white",
                align: 'center'
            });
            let label = new PIXI.Text('CODE:', style);
            label.anchor.set(0.5);
            label.position.set(window.innerWidth / 2, window.innerHeight / 2 - (window.innerHeight / 12));
            app.stage.addChild(label);
            let message = new PIXI.Text(data.id, style);
            message.anchor.set(0.5);
            message.position.set(window.innerWidth / 2, window.innerHeight / 2);
            app.stage.addChild(message);
            menu.copyTextToClipboard(data.id)
            // console.log(data.id)
        });
    },

    join() {
        utils.clearGraphics(app)
        input = new PIXI.TextInput({
            input: {
                fontSize: '36px',
                padding: '12px',
                width: '500px',
                color: '#26272E'
            },
            box: {
                default: { fill: 0xE8E9F3, rounded: 12, stroke: { color: 0xCBCEE0, width: 3 } },
                focused: { fill: 0xE1E3EE, rounded: 12, stroke: { color: 0xABAFC6, width: 3 } },
                disabled: { fill: 0xDBDBDB, rounded: 12 }
            }
        })

        input.placeholder = 'Enter your Text...'
        input.x = window.innerWidth / 2
        input.y = window.innerHeight / 2
        input.pivot.x = input.width / 2
        input.pivot.y = input.height / 2
        app.stage.addChild(input)
        input.focus()
        socket.connect();
        menu.joinButton(app, input)
    },

    joinButton: (app, input) => {
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
            socket.emit('join', { id: input.text });
        });
        app.stage.addChild(button)
        let message = new PIXI.Text("Join room", style);
        message.anchor.set(0.5);
        message.position.set(window.innerWidth / 2, window.innerHeight / 2 + 125);
        app.stage.addChild(message);
    }

}