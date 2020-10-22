class PreloadScene extends Phaser.Scene {

	constructor() {
		super({ key: 'preloadScene' });
	}

    preload() {

        // load phaser graphics
        this.graphics = this.add.graphics();
        this.newGraphics = this.add.graphics();
        var progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
        var progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRectShape(progressBar);

        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(progressBarFill);

        var loadingText = this.add.text(250, 260, "Loading: ", { fontSize: '32px', fill: '#FFF' });

        //scripts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        // load all the images here
        this.load.spritesheet('player', '../images/cat.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('background', '../images/Flat Night 2 BG.png');
        this.load.image('title', '../images/Cat Game Logo.png');
        this.load.image('start', '../images/Start Text.png');
        this.load.image('ground', '../images/platform.png');
        this.load.image('box', '../images/box.png');
        this.load.image('background', '../images/Flat Night 2 BG.png');
        this.load.image('gameover', '../images/Game Over.png');
        this.load.image('playAgain', '../images/Play Again.png');

        this.load.html('nameform', '../html/nameform.html');

        this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics, loadingText: loadingText });
        this.load.on('complete', this.complete, { scene: this.scene });
    }

    init() {
        //  Inject CSS
        var element = document.createElement('style');

        document.head.appendChild(element);

        var sheet = element.sheet;

        var styles = '@font-face { font-family: "customFont"; src: url("../fonts/SHPinscher-Regular.otf") format("opentype"); }\n';

        sheet.insertRule(styles, 0);
    }

    create() {

        //  player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 1 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    /**
     * Update the loading bar as phaser is loading assets
     * 
     * @param {any} percentage
     */
    updateBar(percentage) {
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(205, 205, percentage * 390, 40));

        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");

        // console.log("P:" + percentage);console.log("P:" + percentage);
    }

    /**
     * When done pre loading go to the title screen
     * */
    complete() {
        // console.log("COMPLETE!");
        this.scene.start("titleScene");
    }

}