class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // Load all four tilemaps for each level and the boss room
        this.load.tilemapTiledJSON("level1", "assets/Tilemap/level1.tmj");
        this.load.tilemapTiledJSON("level2", "assets/Tilemap/level2.tmj");
        this.load.tilemapTiledJSON("level3", "assets/Tilemap/level3.tmj");
        this.load.tilemapTiledJSON("boss1", "assets/Tilemap/boss1.tmj");

        // Load spritesheets for tiles, players, enemies, and weapons (24x24, 1px spacing)
        this.load.spritesheet("tiles_packed", "assets/images/tiles_packed.png", {
            frameWidth: 24,
            frameHeight: 24,
            spacing: 1
        });
        this.load.spritesheet("players", "assets/images/players_packed.png", {
            frameWidth: 24,
            frameHeight: 24,
            spacing: 1
        });
        this.load.spritesheet("enemies", "assets/images/enemies_packed.png", {
            frameWidth: 24,
            frameHeight: 24,
            spacing: 1
        });
        this.load.spritesheet("weapons", "assets/images/weapons_packed.png", {
            frameWidth: 24,
            frameHeight: 24,
            spacing: 1
        });

        // Load individual tile images for the bullet, tank, and shooter sprites
        this.load.image("bullet", "assets/images/tile_0058.png");
        this.load.image("tank", "assets/images/tile_0012.png");
        this.load.image("shooter", "assets/images/tile_0004.png");

        // Load all audio effects
        this.load.audio("shoot", "assets/audio/shoot-a.ogg");
        this.load.audio("hurt", "assets/audio/hurt-a.ogg");
        this.load.audio("explosion", "assets/audio/explosion-a.ogg");
        this.load.audio("lose", "assets/audio/lose-a.ogg");
        this.load.audio("select", "assets/audio/select-a.ogg");
    }

    create() {
        // Define the player walk animation — alternates between frames 4 and 5 (hopping beaver)
        this.anims.create({
            key: "player_walk",
            frames: this.anims.generateFrameNumbers("players", {
                frames: [4, 5]
            }),
            frameRate: 6,
            repeat: -1
        });

        // Define the player idle animation — stays on frame 4
        this.anims.create({
            key: "player_idle",
            frames: this.anims.generateFrameNumbers("players", {
                frames: [4]
            }),
            frameRate: 1,
            repeat: -1
        });

        // Move to the title screen once all assets are loaded
        this.scene.start("titleScreen");
    }
}