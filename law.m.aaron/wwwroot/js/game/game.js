var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene, TitleScene, GameScene, GameOverScene],
    canvas: document.getElementById('game-container')
};

var game = new Phaser.Game(config);