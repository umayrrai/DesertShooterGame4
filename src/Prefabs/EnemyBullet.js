class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Reuse the rocket bullet image but tint it red to distinguish from player bullets
        super(scene, x, y, "bullet");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(1);
        this.setTint(0xff0000);

        // Small hitbox so bullets don't clip on wall edges
        this.body.setSize(4, 4);
        this.body.setOffset(10, 10);
    }

    // Set position, velocity, and rotation toward the target angle
    fire(x, y, angle) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        const speed = 80;
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

        // Offset rotation so the rocket points in the direction of travel
        this.rotation = angle + Math.PI / 2;
    }
}