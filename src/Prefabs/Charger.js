class Charger extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use frame 6 from the enemies spritesheet (orange ball enemy)
        super(scene, x, y, "enemies", 6);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(1);

        // Circular hitbox slightly offset to match the sprite
        this.body.setCircle(8, 4, 6);

        this.health = 3;
        this.speed = 30;
    }

    update(player) {
        if (!this.active) return;

        // Move directly toward the player each frame
        const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
        this.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );

        // Flip sprite to face the player
        if (player.x < this.x) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }
    }

    // Reduce health by 1 and destroy when it reaches 0
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}