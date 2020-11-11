class InfiniteRunnerTitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "InfiniteRunnerTitleScene" });

        this.pressStart;
        this.fade = true;
    }

    preload() {

    }

    create() {
        var bg = this.add.image(0, 0, "background");
        Align.scaleToGameH(bg, 1);
        Align.center(bg);

        var agrid = new AlignGrid({ scene: this, rows: 13, cols: 11 });

        // add press to start image on screen
        this.pressStart = this.add.image(0, 0, 'start');
        Align.scaleToGameW(this.pressStart, .5);
        agrid.placeAtIndex(82, this.pressStart);

        this.input.manager.enabled = true;

        this.input.on('pointerdown', function () {
            var h = this.soundControl.getSoundInteractiveArea().height / 2;
            var w = this.soundControl.getSoundInteractiveArea().width / 2;
            if (game.input.mousePointer.x < this.soundControl.getSoundInteractiveArea().x + w && game.input.mousePointer.y > this.soundControl.getSoundInteractiveArea().y + h) {
                this.sound.stopAll();
                this.scene.start('InfiniteRunnerGameScene');
            }
        }, this);

        this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: true });

        this.soundControl = new SoundControl(this);
        this.soundControl.start();
    }

    /**
     * Fade start text on screen
     * */
    delayDone() {

        if (this.fade) {
            this.pressStart.alpha = 1;
        } else {
            this.pressStart.alpha = .1
        }

        this.fade = !this.fade;
    }
}