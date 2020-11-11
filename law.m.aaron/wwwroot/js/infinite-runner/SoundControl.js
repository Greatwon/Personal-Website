class SoundControl extends Phaser.Physics.Arcade.Image
{
    constructor(scene) {

        super(scene);

        scene.add.existing(this);

        this.scene = scene;
        this.soundOnIcon;
        this.soundOffIcon;
        this.soundInteractiveArea;
    }

    start() {

        // Grid
        var agrid = new AlignGrid({ scene: this.scene, rows: 13, cols: 11 });
        //agrid.showNumbers();

        // Sound Controls
        this.setupGameSounds(agrid); 
    }

    /**
     * Add music, mute buttons to allow user to control.
     * */
    setupGameSounds(agrid) {
        this.soundOnIcon = this.scene.add.image(0, 0, "soundOn");
        Align.scaleToGameW(this.soundOnIcon, 0.025);
        this.soundOnIcon.visible = false;

        this.soundOffIcon = this.scene.add.image(0, 0, "soundOff");
        Align.scaleToGameW(this.soundOffIcon, 0.025);
        this.soundOffIcon.visible = false;

        this.soundOffIcon.setInteractive();
        this.soundOffIcon.on('pointerdown', this.setSound, this);

        agrid.placeAtIndex(10, this.soundOnIcon);
        agrid.placeAtIndex(10, this.soundOffIcon);

        this.soundOnIcon.setInteractive();        

        this.soundInteractiveArea = this.scene.add.rectangle(this.soundOnIcon.x, this.soundOnIcon.y, this.soundOnIcon.width + 60, this.soundOnIcon.height + 60, 0xffff, 0);
        this.soundInteractiveArea.setInteractive();
        this.soundInteractiveArea.on('pointerdown', this.setSound, this);

        this.soundOnIcon.on('pointerdown', this.setSound, this);

        if (game.global.sound) {
            this.soundOnIcon.visible = true;
            this.playSong();
        } else {
            this.soundOffIcon.visible = true;
        }
    }

    /**
    * When users clicks sound icon turn the sound on or off.
    * */
    setSound() {
        if (game.global.sound) {
            game.global.sound = false;
            this.soundOnIcon.visible = false;
            this.soundOffIcon.visible = true;
            this.scene.sound.stopAll();
        } else {
            game.global.sound = true;
            this.soundOnIcon.visible = true;
            this.soundOffIcon.visible = false;
            this.playSong();
        }
    }

    getSoundInteractiveArea() {
        return this.soundInteractiveArea;
    }

    playSong() {
        if (game.scene.isVisible("InfiniteRunnerTitleScene")) {
            this.scene.sound.play("title-song", { loop: true, volume: 0.5 });
        } else if (game.scene.isVisible("InfiniteRunnerGameScene")) {
            // music
            this.scene.sound.play("bg-song-1", { loop: true, volume: 0.3 });
        } else if (game.scene.isVisible("InfiniteRunnerGameOverScene")) {
            this.scene.sound.play("gameover-song", { loop: true, volume: 0.5 });
        }
    }
}