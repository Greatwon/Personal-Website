var config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 1280,
    height: 800,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    scene: [InfiniteRunnerPreloadScene, InfiniteRunnerTitleScene, InfiniteRunnerGameScene, InfiniteRunnerGameOverScene],
};

var game = new Phaser.Game(config);

game.global = {
    sound: true
};

// Prevent spacebar from selecting buttons while playing games.
document.querySelectorAll("button").forEach(function (item) {
    item.addEventListener('focus', function () {
        this.blur();
    })
});