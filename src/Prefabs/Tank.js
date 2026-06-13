class Tank extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use the tank enemy image
        super(scene, x, y, "tank");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDepth(1);

        // Circular hitbox slightly offset to match the sprite
        this.body.setCircle(10, 2, 2);

        this.health = 10; // High health — takes many hits to kill
        this.speed = 20;  // Slow but relentless
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