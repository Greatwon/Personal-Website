class InfiniteRunnerGameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: "InfiniteRunnerGameOverScene" });
    }

    preload() {

    }

    init(data) {
        // get the score from the game scene
        this.score = data.score;
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

        this.showScore(agrid, this.score);

        this.createSubmitForm(agrid);
    }

    /**
     * Show the score to the user
     * */
    showScore(agrid) {
        // need a local copy of these to use in loader
        var add = this.add;
        var score = this.score;

        // load the font using google font loader
        WebFont.load({
            custom: {
                families: ['customFont']
            },
            active: function () {
                var scoreText = add.text(0, 0, 'Score: ' + score, { fontFamily: 'customFont', fontSize: 80, color: '#FFFFFF', align: 'center' }).setShadow(2, 2, "#333333", 2, false, true);
                agrid.placeAtIndex(115, scoreText);
                Align.centerW(scoreText);
            }
        });
    }

    createSubmitForm(agrid) {
        var element = this.add.dom(400, 400).createFromCache('nameform');

        agrid.placeAtIndex(93, element);

        element.addListener('click');

        var score = this.score;

        element.on('click', function (event) {

            var inputText = this.getChildByName('nameField');
            var button = this.getChildByName('submitButton');

            if (event.target.name === 'submitButton') {
                var inputText = this.getChildByName('nameField');

                //  Have they entered anything?
                if (inputText.value !== '' || inputText.value !== 'Please Try Again.') {
                    //  Turn off the click events
                    this.removeListener('click');

                    $.ajax({
                        url: '/create/infinte-runner/score',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            name: inputText.value,
                            score: score
                        }
                    }).done(function (mydata) {
                        button.className = "nes-btn is-success is-disabled";
                        button.value = "Success!";
                    }).fail(function (data) {
                        button.className = "nes-btn is-error";
                        element.addListener('click');
                        inputText.value = "Please Try Again.";
                    });

                } else {
                    button.className = "nes-btn is-error";
                    element.addListener('click');
                }
            }
        });
    }

}