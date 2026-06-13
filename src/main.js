// Dungeon Descent: A top down dungeon shooter inspired by Soul Knight
const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    pixelArt: true,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Load, TitleScreen, Level1, Level2, Level3, Boss1, Victory, GameOver]
};

const game = new Phaser.Game(config);