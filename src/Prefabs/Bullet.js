class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use the rocket tile image as the bullet sprite
        super(scene, x, y, "bullet", 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Small hitbox so bullets don't clip on wall edges
        this.body.setSize(4, 4);
        this.body.setOffset(10, 10);
        this.setDepth(1);
    }

    // Set position, velocity, and rotation toward the target angle
    fire(x, y, angle) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        const speed = 300;
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        // Offset rotation by 90 degrees so the rocket points in the direction of travel
        this.rotation = angle + Math.PI / 2;
    }
}