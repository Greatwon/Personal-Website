class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "titleScene" });

        this.pressStart;
        this.fade = true;
    }

    preload() {
       
    }

    create() {

        this.add.image(400, 300, 'background');
        var title = this.add.image(0, 0, 'title');

        Align.scaleToGameW(title, .7);

        var agrid = new AlignGrid({ scene: this, rows: 13, cols: 11 });
        //agrid.showNumbers();
        agrid.placeAtIndex(49, title);

        // add press to start image on screen
        this.pressStart = this.add.image(0, 0, 'start');
        Align.scaleToGameW(this.pressStart, .5);
        agrid.placeAtIndex(82, this.pressStart);

        this.input.manager.enabled = true;

        this.input.once('pointerdown', function () {
            this.scene.start('gameScene');
        }, this);

        this.time.addEvent({ delay: 1000, callback: this.delayDone, callbackScope: this, loop: true });
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
