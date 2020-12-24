class InfiniteRunnerPreloadScene extends Phaser.Scene {

    constructor() {
        super({ key: 'InfiniteRunnerPreloadScene' });
    }

    preload() {

        // load phaser graphics
        this.graphics = this.add.graphics();
        this.newGraphics = this.add.graphics();

        var progressBar = new Phaser.Geom.Rectangle(467, 375, 400, 50);
        var progressBarFill = new Phaser.Geom.Rectangle(472, 380, 290, 40);

        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.fillRectShape(progressBar);

        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(progressBarFill);

        var loadingText = this.add.text(517, 340, "Loading: ", { fontSize: '32px', fill: '#FFF' });

        //scripts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        // load all the images here
        this.load.image('platform', '../images/infinite-runner/platform.png');
        this.load.image("soundOn", "../images/infinite-runner/sound_on.png");
        this.load.image("soundOff", "../images/infinite-runner/sound_off.png");
        this.load.image("background", "../images/infinite-runner/sky.png");
        this.load.image('start', '../images/Start Text.png');
        this.load.image('gameover', '../images/Game Over.png');
        this.load.image('playAgain', '../images/Play Again.png');
        this.load.image('cloud_1', '../images/infinite-runner/Cloud1.png');
        this.load.image('cloud_2', '../images/infinite-runner/Cloud2.png');
        this.load.image('title', '../images/infinite-runner/Infinite Runner Logo.png');

        // sprite sheets
        this.load.spritesheet('player', '../images/infinite-runner/player.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('boulder', '../images/infinite-runner/Boulder.png', { frameWidth: 30, frameHeight: 30 });

        this.load.spritesheet("wasp", "../images/infinite-runner/wasp.png", {
            frameWidth: 60,
            frameHeight: 50
        });

        this.load.spritesheet("bush_1", "../images/infinite-runner/Bush1.png", {
            frameWidth: 48,
            frameHeight: 45
        });

        // the coin is a sprite sheet made by 20x20 pixels
        this.load.spritesheet("coin", "../images/infinite-runner/coin.png", {
            frameWidth: 20,
            frameHeight: 20
        });

        // the firecamp is a sprite sheet made by 32x58 pixels
        this.load.spritesheet("fire", "../images/infinite-runner/fire.png", {
            frameWidth: 40,
            frameHeight: 70
        });

        // mountains are a sprite sheet made by 512x512 pixels
        this.load.spritesheet("mountain", "../images/infinite-runner/mountain.png", {
            frameWidth: 512,
            frameHeight: 512
        });
    
        this.load.html('nameform', '../html/nameform.html');

        // audio
        this.load.audio("bg-song-1", "../music/Focus.ogg");
        this.load.audio("title-song", "../music/Arcade-Fantasy.mp3");
        this.load.audio("gameover-song", "../music/GameOver.mp3");
        this.load.audio("coin-collect", "../music/Coin Collect.wav");

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

       // setting player animation
        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        });

        // setting coin animation
        this.anims.create({
            key: "rotate",
            frames: this.anims.generateFrameNumbers("coin", {
                start: 0,
                end: 5
            }),
            frameRate: 15,
            yoyo: true,
            repeat: -1
        });

        // setting fire animation
        this.anims.create({
            key: "burn",
            frames: this.anims.generateFrameNumbers("fire", {
                start: 0,
                end: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        // setting fire animation
        this.anims.create({
            key: "bushAnims",
            frames: this.anims.generateFrameNumbers("bush_1", {
                start: 0,
                end: 2
            }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers("wasp", {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        if (!window.matchMedia('screen and (max-width: 768px)').matches) {
            document.getElementById("toggler").click();
        }
        
    }

    /**
     * Update the loading bar as phaser is loading assets
     * 
     * @param {any} percentage
     */
    updateBar(percentage) {
        this.newGraphics.clear();
        this.newGraphics.fillStyle(0x3587e2, 1);
        this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(472, 380, percentage * 390, 40));

        percentage = percentage * 100;
        this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");

        // console.log("P:" + percentage);console.log("P:" + percentage);
    }

    /**
     * When done pre loading go to the title screen
     * */
    complete() {
        // console.log("COMPLETE!");
        this.scene.start("InfiniteRunnerTitleScene");
    }

}