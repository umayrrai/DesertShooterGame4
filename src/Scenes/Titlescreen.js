class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    create() {
        // Display the game title and start prompt
        this.add.text(100, 100, "Desert Descent", { fontSize: "32px", fill: "#fff" });
        this.add.text(100, 150, "Press SPACE to start", { fontSize: "16px", fill: "#fff" });

        // Start Level 1 when the player presses SPACE
        this.input.keyboard.once("keydown-SPACE", () => {
            this.scene.start("Level1");
        });
    }
}