var config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    dom: {
        createContainer: true
    },
    scene: [PreloadScene, TitleScene, GameScene, GameOverScene],
};

var game = new Phaser.Game(config);

// Prevent spacebar from selecting buttons while playing games.
document.querySelectorAll("button").forEach(function (item) {
    item.addEventListener('focus', function () {
        this.blur();
    })
});