class Boss1 extends Phaser.Scene {
    constructor() {
        super("Boss1");
    }

    create() {
        // Load and create the boss tilemap with ground and wall layers
        const map = this.make.tilemap({ key: "boss1" });
        const tileset = map.addTilesetImage("desert", "tiles_packed");

        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        this.wallsLayer = map.createLayer("Wall", tileset, 0, 0);

        // Enable collision on tiles marked with collides: true in Tiled
        this.wallsLayer.setCollisionByProperty({ collides: true });

        // Set physics and camera boundaries to match the map size
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Spawn the player in the center and have the camera follow them
        this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels / 2);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Create groups for player bullets and boss homing bullets
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
        this.enemyBullets = this.physics.add.group({ classType: HomingBullet, runChildUpdate: true });

        // Spawn the boss at the top center of the map
        this.boss = new Boss(this, map.widthInPixels / 2, 50);
        this.physics.add.existing(this.boss);

        // Add boss to a group so colliders can reference it
        this.bossGroup = this.physics.add.group();
        this.bossGroup.add(this.boss);

        // Wall collisions for player, boss, and both bullet types
        this.physics.add.collider(this.player, this.wallsLayer);
        this.physics.add.collider(this.bossGroup, this.wallsLayer);

        this.physics.add.collider(this.bullets, this.wallsLayer, (bullet) => {
            if (!bullet.active) return;
            bullet.destroy();
        });

        this.physics.add.collider(this.enemyBullets, this.wallsLayer, (bullet) => {
            if (!bullet.active) return;
            bullet.destroy();
        });

        // When a player bullet hits the boss, deal damage
        this.physics.add.overlap(this.bullets, this.bossGroup, (bullet, boss) => {
            if (!bullet.active || !boss.active) return;
            bullet.destroy();
            boss.takeDamage();
        });

        // When a homing bullet hits the player, deal damage
        this.physics.add.overlap(this.player, this.enemyBullets, (player, bullet) => {
            if (!bullet.active) return;
            bullet.destroy();
            this.player.takeDamage();
        });

        // When the boss touches the player directly, deal damage
        this.physics.add.overlap(this.player, this.bossGroup, () => {
            this.player.takeDamage();
        });

        // HUD - display player health and boss health in the top left
        this.healthText = this.add.text(10, 10, "HP: 3", {
            fontSize: "14px", fill: "#ffffff"
        }).setScrollFactor(0).setDepth(10);

        this.bossHealthText = this.add.text(10, 20, "Boss HP: 50", {
            fontSize: "14px", fill: "#ff0000"
        }).setScrollFactor(0).setDepth(10);

        this.shootCooldown = 0;
        this.bossDefeated = false;
    }

    update(time, delta) {
        // Stop updating if the player is dead
        if (!this.player.active) return;

        this.player.update(delta);
        this.shootCooldown -= delta;

        // Shoot a bullet toward the mouse cursor while the mouse button is held
        if (this.input.activePointer.isDown && this.shootCooldown <= 0) {
            const pointer = this.input.activePointer;
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
            const bullet = new Bullet(this, this.player.x, this.player.y);
            this.bullets.add(bullet);
            bullet.fire(this.player.x, this.player.y, angle);
            this.sound.play("shoot");
            this.shootCooldown = 300;
        }

        // Update the boss AI and health display while it's alive
        if (this.boss.active) {
            this.boss.update(this.player, this.enemyBullets);
            this.bossHealthText.setText("Boss HP: " + this.boss.health);
        }

        // Update player health display
        this.healthText.setText("HP: " + this.player.health);

        // When the boss is defeated, show victory text and transition to the victory screen
        if (!this.boss.active && !this.bossDefeated) {
            this.bossDefeated = true;
            this.add.text(240, 160, "You Win!", {
                fontSize: "20px", fill: "#ffff00"
            }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
            this.time.delayedCall(3000, () => {
                this.scene.start("victory");
            });
        }
    }
}