class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use frame 4 from the players spritesheet (beaver character)
        super(scene, x, y, "players", 4);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.setDepth(1);
        this.setOrigin(0.5, 0.5);

        // Small circular hitbox for smooth wall and enemy collision
        this.body.setCircle(5, 7, 12);

        // Create the gun sprite that orbits around the player
        this.gun = scene.add.sprite(x, y, "weapons", 3);
        this.gun.setDepth(2);

        this.health = 3;
        this.invincible = false;
        this.invincibleTimer = 0;

        this.speed = 100;

        // Set up WASD keyboard input
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    takeDamage() {
        // Ignore damage if the player is currently invincible
        if (this.invincible) return;
        this.health--;

        // Grant 1 second of invincibility and flash the sprite
        this.invincible = true;
        this.invincibleTimer = 1000;
        this.setAlpha(0.5);
        this.scene.sound.play("hurt");

        // If health reaches 0, disable the player and go to game over
        if (this.health <= 0) {
            this.disableBody(true, true);
            this.scene.scene.start("gameOver");
        }
    }

    update(delta) {
        const { up, down, left, right } = this.wasd;

        let vx = 0;
        let vy = 0;

        // Read WASD input and set velocity
        if (left.isDown) vx = -this.speed;
        if (right.isDown) vx = this.speed;
        if (up.isDown) vy = -this.speed;
        if (down.isDown) vy = this.speed;

        // Normalize diagonal movement so it isn't faster than cardinal movement
        if (vx !== 0 && vy !== 0) {
            vx *= 0.707;
            vy *= 0.707;
        }

        this.setVelocity(vx, vy);

        // Flip the sprite horizontally based on movement direction
        if (vx < 0) this.setFlipX(true);
        if (vx > 0) this.setFlipX(false);

        // Play walk or idle animation depending on whether the player is moving
        if (vx !== 0 || vy !== 0) {
            this.anims.play("player_walk", true);
        } else {
            this.anims.play("player_idle", true);
        }

        // Count down invincibility timer and restore full opacity when it expires
        if (this.invincible) {
            this.invincibleTimer -= delta;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
                this.setAlpha(1);
            }
        }

        // Position the gun sprite orbiting the player toward the mouse cursor
        const pointer = this.scene.input.activePointer;
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);

        const gunDistance = 18;
        this.gun.setPosition(
            this.x + Math.cos(angle) * gunDistance,
            this.y + Math.sin(angle) * gunDistance
        );
        this.gun.rotation = angle;

        // Flip the gun vertically when aiming left so it looks natural
        if (Math.abs(angle) > Math.PI / 2) {
            this.gun.setFlipY(true);
        } else {
            this.gun.setFlipY(false);
        }
    }
}