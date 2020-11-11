class InfiniteRunnerGameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "InfiniteRunnerGameOverScene" });
    }

    preload() {

    }

    create() {
        // Sky Background
        var bg = this.add.image(0, 0, "background");
        Align.scaleToGameH(bg, 1);
        Align.center(bg);

        var gameover = this.add.image(0, 0, 'gameover');

        Align.scaleToGameW(gameover, .7);

        var agrid = new AlignGrid({ scene: this, rows: 13, cols: 11 });
        // agrid.showNumbers();
        agrid.placeAtIndex(49, gameover);

        // add play again button and add a listener
        var playAgainBtn = this.add.image(0, 0, 'playAgain');
        agrid.placeAtIndex(71, playAgainBtn);

        playAgainBtn.setInteractive();

        playAgainBtn.on('pointerdown', function () {
            this.sound.stopAll();
            this.scene.start('InfiniteRunnerGameScene');
        }, this);

        this.soundControl = new SoundControl(this);
        this.soundControl.start();
    }
}