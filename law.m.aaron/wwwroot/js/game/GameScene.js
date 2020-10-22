class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: "gameScene" });
        this.player;
        this.platforms;
        this.cursors;
        this.score = 0;
        this.scoreText;
        this.gameOver = false;
        this.scoreText;
        this.boxes;
        this.isDash = false;
        this.dashEvent;
        this.dashTimerCount = 0;
        this.isDashOver = true;

        // Movement Keys
        this.keyA;
        this.keyD;
        this.spaceBar;

        this.sceneAdded = false;
    }

    preload() {
        
    }

    create() {
        // center game on screen
        game.pageAlignHorizontally = true;
        game.pageAlignVertically = true;
        
        this.add.image(400, 300, 'background');

        // for debugging
        this.aGrid = new AlignGrid({ scene: this, rows: 25, cols: 21 });
        // this.aGrid.showNumbers();
        
        
        //  The platform
        this.platforms = this.physics.add.staticGroup();

        //   create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 600, 'ground').refreshBody();

        // The player
        this.player = this.physics.add.sprite(100, 450, 'player');

        // fix the hitbox of the player 
        this.time.addEvent({
            delay: 1000,
            callback: function () { this.delayDone },
            callbackScope: this,
            loop: false
        });

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        // Assign Movement Keys
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false);
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, false);

        // reset vars
        this.resetVars();
        
        this.boxes = this.physics.add.group();

        this.setUpBoxes();

        //  The score
        this.scoreText = this.add.text(0, 0, '0', { fontSize: '44px', fill: '#FFFFFF' });
        // Align.scaleToGameW(this.scoreText, .2);

        this.aGrid.placeAtIndex(17, this.scoreText);

        

        //  Collide the player and the platforms
        
        this.player.body.setSize(this.player.width / 2.5, 0, true);
        this.physics.add.collider(this.player, this.platforms);

        // up the gravity of the boxes every half second
        this.time.addEvent({
            delay: 500,
            callback: function () { game.scene.keys.gameScene.physics.world.gravity.y += 1; },
            callbackScope: this,
            loop: false
        });
        
    }

    update() {

        var playerVelocityLeft = -200;
        var playerVelocityRight = 200;
        var playerVelocityDashMultiplier = 3;

        if (this.gameOver) {
            return;
        }

        if (this.cursors.left.isDown || this.keyA.isDown) {

            if (this.spaceBar.isDown && !this.isDash) {
                this.dashEvent = this.time.addEvent({
                    delay: 16,
                    callback: function () { this.playerDash('left', playerVelocityLeft, playerVelocityDashMultiplier) },
                    callbackScope: game.scene.keys.gameScene,
                    repeat: 20
                });
                this.isDash = true;
                this.isDashOver = false;
            } else if (this.isDashOver) {
                this.player.setVelocityX(playerVelocityLeft);
                this.player.anims.play('left', true);
            }
        }
        else if (this.cursors.right.isDown || this.keyD.isDown) {

            if (this.spaceBar.isDown && !this.isDash) {
                this.dashEvent = this.time.addEvent({
                    delay: 16,
                    callback: function () { this.playerDash('right', playerVelocityRight, playerVelocityDashMultiplier) },
                    callbackScope: game.scene.keys.gameScene,
                    repeat: 20
                });
                this.isDash = true;
                this.isDashOver = false;
                
            } else if(this.isDashOver) {
                this.player.setVelocityX(playerVelocityRight);
                this.player.anims.play('right', true);
            }
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.boxes.countActive(true) === 0) {
            this.setUpBoxes();
        }


    }

    /**
     *  When a box hits the platform destory it
     *
     * @param {any} box
     */
    boxesHitPlatforms(box) {
        box.destroy();

        // Add and update the score
        this.score += 10;
        this.scoreText.setText(this.score);
    }

    /**
     * When a box hits a player its gameover
     */
    hitBoxes() {
        game.scene.keys.gameScene.physics.pause();
        game.scene.keys.gameScene.scene.pause();

        game.scene.keys.gameScene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.A, true);

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');
        this.player.setVelocityX(0);

        this.gameOver = true;

        if (!this.sceneAdded) {
            this.sceneAdded = true;
            this.scene.start('gameOverScene', { score: this.score });
        }
        
    }

    /**
     * Randomly Add boxes along the top of the screen after they have hit the platform
     * */
    setUpBoxes() {

        var numOfBoxes = Phaser.Math.Between(6, 15);

        var context = game.scene.keys.gameScene;

        for (var i = 0; i < numOfBoxes; i++) {
            var xx = Phaser.Math.Between(0, game.config.width);

            var box = game.scene.keys.gameScene.add.image(xx, -60, "box");
            this.boxes.add(box);
        }

        // Check to see if the boxes has hit the platform.
        context.physics.add.overlap(this.boxes, this.platforms, this.boxesHitPlatforms, null, context);

        context.physics.add.overlap(this.player, this.boxes, this.hitBoxes, null, context);
    }

    /**
     * Runs after a set delay
     * */
    delayDone() {
        // make the hitbox of the player closely match to the sprite
        //this.player.body.setSize(this.player.height, this.player.width, true);
        //this.player.body.setSize(this.player.width / 3, 0, true);
 
    }

    /**
     * Reset the vars on game start.
     * */
    resetVars() {
        this.gameOver = false;
        this.sceneAdded = false;
        this.cursors.left.isDown = false;
        this.keyA.isDown = false;
        this.cursors.right.isDown = false;
        this.keyD.isDown = false;
        this.spaceBar.isDown = false;
        this.player.anims.play('turn');
        this.player.setVelocityX(0);
        this.score = 0;
        this.isDash = false;
        this.dashTimerCount = 0;
        this.isDashOver = true;
    }

    /**
     * 
     *  Let the player move faster for a short duration after pressing space. Add a delay of 1 second so the user 
     *  cannot spam the dash.
     * 
     * @param {any} direction What direction the sprite should be facing
     * @param {any} directionSpeed The speed in which the sprite should be moving
     * @param {any} multiplier How fast the dash is.
     */
    playerDash(direction, directionSpeed, multiplier) {
        this.player.setVelocityX((directionSpeed * multiplier));
        this.dashTimerCount++;
        this.player.anims.play(direction, true);

        //console.log(this.dashTimerCount);

        if (this.dashTimerCount === 20) {
            this.dashEvent.remove(false);
            
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            this.dashTimerCount = 0;
            this.isDashOver = true;

            this.time.addEvent({
                delay: 1000,
                callback: function () { this.isDash = false; },
                callbackScope: this,
                loop: false
            });
        }
    }
}
