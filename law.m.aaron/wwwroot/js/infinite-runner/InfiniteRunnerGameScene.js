class InfiniteRunnerGameScene extends Phaser.Scene {

    constructor() {
        super({ key: "InfiniteRunnerGameScene" });

        this.gameOptions = {
            // platform speed range, in pixels per second
            platformSpeedRange: [300, 300],

            // mountain speed, in pixels per second
            mountainSpeed: 80,

            // spawn range, how far should be the rightmost platform from the right edge
            // before next platform spawns, in pixels
            spawnRange: [80, 300],

            // platform width range, in pixels
            platformSizeRange: [150, 450],

            // a height range between rightmost platform and next platform to be spawned
            platformHeightRange: [-5, 5],

            // a scale to be multiplied by platformHeightRange
            platformHeighScale: 20,

            // platform max and min height, as screen height ratio
            platformVerticalLimit: [0.4, 0.8],

            // player gravity
            playerGravity: 900,

            // player jump force
            jumpForce: 400,

            // player starting X position
            playerStartPosition: 200,

            // consecutive jumps allowed
            jumps: 2,

            // % of probability a coin appears on the platform
            coinPercent: 33,

            // % of probability a object appears on the platform
            objectPercent: 33
        };

        this.addedPlatforms = 0;
        this.playerJumps = 0;
        this.mountainGroup;
        this.cloudGroup;
        this.platformGroup;
        this.platformPool;
        this.coinGroup;
        this.coinPool;
        this.fireGroup;
        this.firePool;
        this.waspGroup;
        this.waspPool;
        this.boulderGroup;
        this.boulderPool;
        this.bushGroup;
        this.bushPool;
    }

    preload() {
       
    }

    create() {
        // Sky Background
        var bg = this.add.image(0, 0, "background");
        Align.scaleToGameH(bg, 1);
        Align.center(bg);

        // Grid
        var agrid = new AlignGrid({ scene: this, rows: 13, cols: 11 });
        //agrid.showNumbers();

        this.initGroups();

        this.addMountains();
        this.addClouds();

        this.addPlatform(game.config.width, game.config.width / 2, game.config.height * this.gameOptions.platformVerticalLimit[1]);

        // adding the player;
        this.player = this.physics.add.sprite(this.gameOptions.playerStartPosition, game.config.height * 0.7, "player");

        // add small rect under player
        this.rect = new Phaser.Geom.Rectangle(0, 0, this.player.body.width, 3);
        this.rectPhys = this.physics.add.sprite(this.gameOptions.playerStartPosition, game.config.height * 0.7, this.rect);
        this.rectPhys.visible = false;

        this.player.setGravityY(this.gameOptions.playerGravity);
        this.rectPhys.setGravityY(this.gameOptions.playerGravity);

        this.player.setDepth(2);

        // the player is not dying
        this.dying = false;

        // setting collisions between the player and the platform group
        this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function () {

            if (this.dying) {
                this.player.setTint(0xff0000);
            }

            // play "run" animation if the player is on a platform
            if (!this.player.anims.isPlaying) {
                this.player.anims.play("run");
            }
        }, null, this);

        this.platformCollider = this.physics.add.collider(this.rectPhys, this.platformGroup, function () {

            if (this.rectPhys.body.touching.down) {
                this.playerJumps = 0;
                this.player.setGravityY(0);
            }
        }, null, this);

        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, function (player, coin) {

            this.tweens.add({
                targets: coin,
                y: coin.y - 100,
                alpha: 0,
                duration: 800,
                ease: "Cubic.easeOut",
                callbackScope: this,
                onComplete: function () {
                    this.coinGroup.killAndHide(coin);
                    this.coinGroup.remove(coin);
                }
            });

        }, null, this);

        // set collisions
        this.physics.add.overlap(this.player, this.fireGroup, this.playerHit, null, this);
        this.physics.add.overlap(this.player, this.waspGroup, this.playerHit, null, this);
        this.physics.add.overlap(this.player, this.bushGroup, this.playerHit, null, this);
        this.physics.add.overlap(this.player, this.boulderGroup, this.playerHit, null, this);

        // Sound Control
        this.soundControl = new SoundControl(this);
        this.soundControl.start();

        // check for input
        this.input.on("pointerdown", this.jump, this);

    }

    update() {

        // game over
        if (this.player.y > game.config.height) {
            this.gameOver();            
        }

        if (this.dying) {
            this.player.setTint(0xff0000);
        }

        if (!this.rectPhys.body.touching.down) {
            this.player.setGravityY(this.gameOptions.playerGravity);
        }

        this.player.x = this.gameOptions.playerStartPosition;
        this.rectPhys.x = this.gameOptions.playerStartPosition;

        // recycling platforms
        var minDistance = game.config.width;
        var rightmostPlatformHeight = 0;
        this.platformGroup.getChildren().forEach(function (platform) {
            var platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            if (platformDistance < minDistance) {
                minDistance = platformDistance;
                rightmostPlatformHeight = platform.y;
            }
            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling coins
        this.coinGroup.getChildren().forEach(function (coin) {
            if (coin.x < - coin.displayWidth / 2) {
                this.coinGroup.killAndHide(coin);
                this.coinGroup.remove(coin);
            }
        }, this);

        // recycling fire
        this.fireGroup.getChildren().forEach(function (fire) {
            if (fire.x < - fire.displayWidth / 2) {
                this.fireGroup.killAndHide(fire);
                this.fireGroup.remove(fire);
            }
        }, this);

        this.boulderGroup.getChildren().forEach(function (boulder) {
            if (boulder.x < - boulder.displayWidth / 2) {
                this.boulderGroup.killAndHide(boulder);
                this.boulderGroup.remove(boulder);
            }
        }, this);

        this.bushGroup.getChildren().forEach(function (bush) {
            if (bush.x < - bush.displayWidth / 2) {
                this.bushGroup.killAndHide(bush);
                this.bushGroup.remove(bush);
            }
        }, this);

        this.waspGroup.getChildren().forEach(function (wasp) {
            if (wasp.x < - wasp.displayWidth / 2) {
                this.waspGroup.killAndHide(wasp);
                this.waspGroup.remove(wasp);
            }
        }, this);

        // recycling mountains
        this.mountainGroup.getChildren().forEach(function (mountain) {
            if (mountain.x < - mountain.displayWidth) {
                var rightmostMountain = this.getRightmostMountain();
                mountain.x = rightmostMountain + Phaser.Math.Between(100, 350);
                mountain.y = game.config.height + Phaser.Math.Between(0, 100);
                mountain.setFrame(Phaser.Math.Between(0, 3))
                if (Phaser.Math.Between(0, 1)) {
                    mountain.setDepth(1);
                }
            }
        }, this);

        this.cloudGroup.getChildren().forEach(function (cloud) {
            if (cloud.x < - cloud.displayWidth) {
                var rightmostcloud = this.getRightmostcloud();
                cloud.x = rightmostcloud + Phaser.Math.Between(100, 350);
                cloud.y = Phaser.Math.Between(0, 500);
                if (Phaser.Math.Between(0, 1)) {
                    cloud.setDepth(1);
                }
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            var nextPlatformWidth = Phaser.Math.Between(this.gameOptions.platformSizeRange[0], this.gameOptions.platformSizeRange[1]);
            var platformRandomHeight = this.gameOptions.platformHeighScale * Phaser.Math.Between(this.gameOptions.platformHeightRange[0], this.gameOptions.platformHeightRange[1]);
            var nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
            var minPlatformHeight = game.config.height * this.gameOptions.platformVerticalLimit[0];
            var maxPlatformHeight = game.config.height * this.gameOptions.platformVerticalLimit[1];
            var nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, nextPlatformHeight);
        }
    }

    /**
     * Initialze the Pool and Groups used
     * */
    initGroups() {
        this.mountainGroup = this.add.group();

        this.cloudGroup = this.add.group();

        this.platformGroup = this.add.group({
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform);
            }
        });

        this.platformPool = this.add.group({
            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform);
            }
        });

        this.coinGroup = this.add.group({
            removeCallback: function (coin) {
                coin.scene.coinPool.add(coin);
            }
        });

        this.coinPool = this.add.group({
            removeCallback: function (coin) {
                coin.scene.coinGroup.add(coin);
            }
        });

        this.fireGroup = this.add.group({
            removeCallback: function (fire) {
                fire.scene.firePool.add(fire);
            }
        });

        this.firePool = this.add.group({
            removeCallback: function (fire) {
                fire.scene.fireGroup.add(fire);
            }
        });

        this.boulderGroup = this.add.group({
            removeCallback: function (boulder) {
                boulder.scene.boulderPool.add(boulder);
            }
        });

        this.boulderPool = this.add.group({
            removeCallback: function (boulder) {
                boulder.scene.boulderGroup.add(boulder);
            }
        });

        this.bushGroup = this.add.group({
            removeCallback: function (bush) {
                bush.scene.bushPool.add(bush);
            }
        });

        this.bushPool = this.add.group({
            removeCallback: function (bush) {
                bush.scene.bushGroup.add(bush);
            }
        });

        this.waspGroup = this.add.group({
            removeCallback: function (wasp) {
                wasp.scene.waspPool.add(wasp);
            }
        });

        this.waspPool = this.add.group({
            removeCallback: function (wasp) {
                wasp.scene.waspGroup.add(wasp);
            }
        });
    }

    
    /**
     * Add Mountins to the background and make it look like the are scrolling by
     * */
    addMountains() {
        var rightmostMountain = this.getRightmostMountain();
        if (rightmostMountain < game.config.width * 2) {
            var mountain = this.physics.add.sprite(rightmostMountain + Phaser.Math.Between(100, 350), game.config.height + Phaser.Math.Between(0, 100), "mountain");
            mountain.setOrigin(0.5, 1);
            mountain.body.setVelocityX(this.gameOptions.mountainSpeed * -1)
            this.mountainGroup.add(mountain);
            if (Phaser.Math.Between(0, 1)) {
                mountain.setDepth(1);
            }
            this.addMountains();
        }
    }

    /*
     * Add Clouds at different heigths above the mountains
     * */
    addClouds() {
        var rightmostCloud = this.getRightmostcloud();
        if (rightmostCloud < game.config.width * 2) {

            var cloudChoice = Phaser.Math.Between(1, 2);

            var cloud = this.physics.add.sprite(rightmostCloud + Phaser.Math.Between(100, 350), Phaser.Math.Between(0, 500), "cloud_" + cloudChoice.toString());
            cloud.setOrigin(0.5, 1);
            cloud.body.setVelocityX(this.gameOptions.mountainSpeed * -1)
            this.cloudGroup.add(cloud);
            if (Phaser.Math.Between(0, 1)) {
                cloud.setDepth(1);
            }
            this.addClouds();
        }
    }

    /**
     * Get the right most clouds x pos
     * */
    getRightmostcloud() {
        var rightmostCloud = -200;
        this.cloudGroup.getChildren().forEach(function (cloud) {
            rightmostCloud = Math.max(rightmostCloud, cloud.x);
        })
        return rightmostCloud;
    }

    /**
     * Get the right most mountains x pos
     * */
    getRightmostMountain() {
        var rightmostMountain = -200;
        this.mountainGroup.getChildren().forEach(function (mountain) {
            rightmostMountain = Math.max(rightmostMountain, mountain.x);
        })
        return rightmostMountain;
    }

    /**
     * Platforms are added from the pool or created on the fly
     * 
     * @param {any} platformWidth
     * @param {any} posX
     * @param {any} posY
     */
    addPlatform(platformWidth, posX, posY) {

        this.addedPlatforms++;
        var platform;

        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
            platform.displayWidth = platformWidth;
            platform.tileScaleX = 1 / platform.scaleX;
        }
        else {
            platform = this.add.tileSprite(posX, posY, platformWidth, 25, "platform");
            this.physics.add.existing(platform);
            platform.body.setImmovable(true);
            platform.body.setVelocityX(Phaser.Math.Between(this.gameOptions.platformSpeedRange[0], this.gameOptions.platformSpeedRange[1]) * -1);
            platform.setDepth(2);
            this.platformGroup.add(platform);
        }

        this.nextPlatformDistance = Phaser.Math.Between(this.gameOptions.spawnRange[0], this.gameOptions.spawnRange[1]);

        // if this is not the starting platform...
        if (this.addedPlatforms > 1) {

            // Add Coin
            this.addCoinToPlatform.call(this, posX, posY, platform, platformWidth);

            // Add obsticle to platform
            var obsticle = Phaser.Math.Between(1, 3);

            switch (obsticle) {
                case 1:
                    // Add Fire
                    this.addFireToPlatform.call(this, posX, posY, platform, platformWidth);
                    break;
                case 2:
                    // Add Bush
                    this.addBushToPlatform.call(this, posX, posY, platform, platformWidth);
                    break;
                case 3:
                    // Add Boulder
                    this.addBoulderToPlatform.call(this, posX, posY, platform, platformWidth);
                    break;
                default:
                    this.addFireToPlatform.call(this, posX, posY, platform, platformWidth);
            } 


            // Try and add a wasp separately.
            this.addWasp.call(this, posX, posY, platform, platformWidth);            
        }
    }

    /**
     * The player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
     * and if the player is not dying
     * */
    jump() {

        this.player.setGravityY(this.gameOptions.playerGravity);

        // dont jump when player is click the sound icon
        var h = this.soundControl.getSoundInteractiveArea().height / 2;
        var w = this.soundControl.getSoundInteractiveArea().width / 2;

        if (!(game.input.mousePointer.x < this.soundControl.getSoundInteractiveArea().x + w) && !(game.input.mousePointer.y > this.soundControl.getSoundInteractiveArea().y + h)) {
            return;
        }

        if (this.player.body.touching.down) {
            this.playerJumps = 0;
        }

        if ((!this.dying) && this.playerJumps < this.gameOptions.jumps) {
            
            this.player.setVelocityY(this.gameOptions.jumpForce * -1);
            this.rectPhys.setVelocityY(this.gameOptions.jumpForce * -1);
            this.playerJumps++;

            // stops animation
            this.player.anims.stop();
        }
    }

    /**
     * Show the player dead
     * */
    playerHit() {
        this.dying = true;
        this.player.anims.stop();
        this.player.setFrame(2);
        this.player.setTint(0xff0000);
        this.player.body.setVelocityY(-200);
        this.physics.world.removeCollider(this.platformCollider);
        this.player.setGravityY(this.gameOptions.playerGravity);
        this.player.setTint(0xff0000);
    }

    gameOver() {
        this.sound.stopAll();
        this.addedPlatforms = 0;
        this.playerJumps = 0;
        this.scene.start("InfiniteRunnerGameOverScene");
    }

    addFireToPlatform(posX, posY, platform, platformWidth) {
        if (Phaser.Math.Between(1, 100) <= this.gameOptions.objectPercent) {
            if (this.firePool.getLength()) {
                var fire = this.firePool.getFirst();
                fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                fire.y = posY - 46;
                fire.alpha = 1;
                fire.active = true;
                fire.visible = true;
                this.firePool.remove(fire);
            }
            else {
                var fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "fire");
                fire.setImmovable(true);
                fire.setVelocityX(platform.body.velocity.x);
                fire.setSize(fire.width / 2, fire.height / 2, true);
                fire.anims.play("burn");
                fire.setDepth(2);
                this.fireGroup.add(fire);
            }
        }
    }

    addBushToPlatform(posX, posY, platform, platformWidth) {
        if (Phaser.Math.Between(1, 100) <= this.gameOptions.objectPercent) {
            if (this.bushPool.getLength()) {
                var bush = this.bushPool.getFirst();
                bush.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                bush.y = posY - 30;
                bush.alpha = 1;
                bush.active = true;
                bush.visible = true;
                this.bushPool.remove(bush);
            }
            else {
                var bush = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 30, "bush_1");
                bush.setImmovable(true);
                bush.setVelocityX(platform.body.velocity.x);
                bush.setSize(bush.width / 2, bush.height / 2, true);
                bush.anims.play("bushAnims");
                bush.setDepth(2);
                this.bushGroup.add(bush);
            }
        }
    }

    addBoulderToPlatform(posX, posY, platform, platformWidth) {
        if (Phaser.Math.Between(1, 100) <= this.gameOptions.objectPercent) {
            if (this.boulderPool.getLength()) {
                var boulder = this.boulderPool.getFirst();
                boulder.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                boulder.y = posY - 25;
                boulder.alpha = 1;
                boulder.active = true;
                boulder.visible = true;
                this.boulderPool.remove(boulder);
            }
            else {
                var boulder = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 25, "boulder");
                boulder.setImmovable(true);
                boulder.setVelocityX(platform.body.velocity.x);
                boulder.setSize(boulder.width / 2, boulder.height / 2, true);
                boulder.setDepth(2);
                this.boulderGroup.add(boulder);
            }
        }
    }

    /**
     * Chance that a wasp will spawn when a new platform is created.
     * */
    addWasp(posX, posY, platform, platformWidth) {
        if (Phaser.Math.Between(1, 100) <= this.gameOptions.objectPercent) {

            var waspHeight = Phaser.Math.Between(posY, 200)

            if (this.waspPool.getLength()) {
                var wasp = this.waspPool.getFirst();
                wasp.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
                wasp.y = waspHeight;
                wasp.alpha = 1;
                wasp.active = true;
                wasp.visible = true;
                this.waspPool.remove(wasp);
            }
            else {

                var waspVelocity = Phaser.Math.Between(-500, platform.body.velocity.x);

                var wasp = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), waspHeight, "wasp");
                wasp.setImmovable(true);
                wasp.setVelocityX(waspVelocity);
                wasp.setSize(wasp.width / 2, wasp.height / 2, true);
                wasp.anims.play("fly");
                wasp.setDepth(2);
                this.waspGroup.add(wasp);
            }
        }
    }

    /**
     * Add a coin to a platform
     * @param {any} posX
     * @param {any} posY
     * @param {any} platformWidth
     */
    addCoinToPlatform(posX, posY, platform, platformWidth) {
        if (Phaser.Math.Between(1, 100) <= this.gameOptions.coinPercent) {
            if (this.coinPool.getLength()) {
                var coin = this.coinPool.getFirst();
                coin.x = posX;
                coin.y = posY - 96;
                coin.alpha = 1;
                coin.active = true;
                coin.visible = true;
                this.coinPool.remove(coin);
            }
            else {
                var coin = this.physics.add.sprite(posX, posY - 96, "coin");
                coin.setImmovable(true);
                coin.setVelocityX(platform.body.velocity.x);
                coin.anims.play("rotate");
                coin.setDepth(2);
                this.coinGroup.add(coin);
            }
        }
    }
}