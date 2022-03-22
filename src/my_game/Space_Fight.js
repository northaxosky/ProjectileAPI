"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Hero from "./objects/hero.js";
import Missile from "./objects/missile.js";
import Mirv from "./objects/mirv.js";
import Elite from "./objects/elite.js";
import Enemy from "./objects/enemy.js";
import FontRenderable from "../engine/renderables/font_renderable.js";
import Projectile from "../engine/game_objects/projectile.js";
import BeerPong from "./Beer_Pong.js"
import GameObject from "../engine/game_objects/game_object.js";
import GameObjectSet from "../engine/game_objects/game_object_set.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";

class SpaceFight extends engine.Scene {
    constructor() {
        super();

        // Assets
        this.kHeroShip = "assets/heroShip.png"
        this.kT = "assets/bullet_trail.png";
        this.kBg = "assets/bg.png";
        this.kRedMissile = "assets/goodMissile.png";
        this.kEnemyShip = "assets/enemyShip.png";
        this.kExplosion = "assets/explosion.png";
        this.kEnemyMissile = "assets/badMissile.png";
        this.kEnemyMissileTrail = "assets/enemyBulletTrail.png";
        this.kAltEnemy = "assets/ufo.png";
        this.kMirv = "assets/mirv.png";
        this.kMirvTrail = "assets/mirvTrail.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mText = null;
        this.mEnemySet = [];

        // Projectiles
        this.mHeroMissileSet = [];
        this.mEnemyMissileSet = [];

        // timer for autoSpawn
        this.autospawnTimer = null;
        this.timeInterval = 2000;
        this.timer = null;

        // Points & Health
        this.points = 0;
        this.hearts = 5;
        this.godMode = false;

        this.hits = [];

    }

    load() {
        engine.texture.load(this.kT); // loading a trail for a projectile
        engine.texture.load(this.kHeroShip);
        engine.texture.load(this.kBg);
        engine.texture.load(this.kEnemyShip);
        engine.texture.load(this.kRedMissile);
        engine.texture.load(this.kExplosion);
        engine.texture.load(this.kEnemyMissile);
        engine.texture.load(this.kEnemyMissileTrail);
        engine.texture.load(this.kAltEnemy);
        engine.texture.load(this.kMirv);
        engine.texture.load(this.kMirvTrail);
    }

    unload() {
        engine.texture.unload(this.kEnemyShip);
        engine.texture.unload(this.kT);
        engine.texture.unload(this.kHeroShip);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.kRedMissile);
        engine.texture.unload(this.kExplosion);
        engine.texture.unload(this.kEnemyMissile);
        engine.texture.unload(this.kEnemyMissileTrail);
        engine.texture.unload(this.kAltEnemy);
        engine.texture.unload(this.kMirvTrail);
        engine.texture.unload(this.kMirv);
    }

    init() {
       
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(100, 75), // position of the camera
            200,                       // width of camera
            [0, 0, 1280, 960]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
        // sets the background to gray

        // Large background image
        let bgR = new engine.SpriteRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 1024, 0, 1024);
        bgR.getXform().setSize(275, 275);
        bgR.getXform().setPosition(100, 135);
        this.mBg = new engine.GameObject(bgR);

        // Objects in the scene
        this.mHero = new Hero(this.kHeroShip);
        this.mEnemy = new Enemy(this.kEnemyShip, this.mCamera);
        this.spawnTime = performance.now();
        this.mEnemySet.push(this.mEnemy);

        this.mText = new FontRenderable("Score: " + this.points + " Hearts: " + this.hearts);
        this.mText.getXform().setPosition(5, 5);
        this.mText.setTextHeight(5);
        this.mText.setColor([0, 0, 0, 1])

        // Initialize AutoSpawner
        this.autospawnTimer = performance.now();

        this.hit = new TextureRenderable(this.kExplosion);
        let size = Math.random() * 10 + 1;
        this.hit.getXform().setSize(size, size);
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);
        
        Projectile.drawAllProjectiles(camera);

        // draw Objects
        this.mHero.draw(camera);
        
        for (let enemy of this.mEnemySet) {
            enemy.draw(camera);
        }
        
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.mText.draw(this.mCamera);
        this.hit.draw(this.mCamera)
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            this.next();
        }
        // update objects
        this.mHero.update();    
        this.mEnemy.update();
        this.mText.update();
        this.checkObjectLifespan();

        Projectile.updateAllProjectiles();

        // helper update functions
        this.spawnHeroMissiles(); 
        this.spawnEnemyMissiles();
        this.checkEnemyHit();   
        this.checkHeroHit();
        this.autoSpawnEnemy();
        this.isDead();
        this.checkGodMode();
    }

    next() {
        GameObject.gameObjectSet = new GameObjectSet();
        super.next();
       

        let nextLevel = new BeerPong();
        nextLevel.start();
    }

    checkObjectLifespan() {
        for (let i = 0; i < this.mHeroMissileSet.length; i++)   {
            if (!this.mHeroMissileSet[i].mValid)    {
                this.mHeroMissileSet.splice(i, 1);
            }
        }
        for (let i = 0; i < this.mEnemySet.length; i++) {
            if (!this.mEnemySet[i].mValid)  {
                this.mEnemySet.splice(i, 1);
            }
        }
        for (let i = 0; i < this.mEnemyMissileSet.length; i++) {
            if (!this.mEnemyMissileSet[i].mValid)  {
                this.mEnemyMissileSet.splice(i, 1);
            }
        }
    }

    spawnHeroMissiles() {
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            // get xform from Hero and calculate missile spawn position
            let xform = this.mHero.getXform();
            
            // create Missile
            let missile = new Missile(this.kRedMissile, 3000, this.kT, 500, 10,[2,1], this.kExplosion);
            missile.getXform().setSize(6, 3);
            missile.getXform().setPosition(xform.getXPos(), xform.getYPos());
            missile.setStraight(null, null, xform.getRotationInDegree() , 0.6, 0.005);

            // Push missile into missile set 
            this.mHeroMissileSet.push(missile);
        }
    }

    spawnEnemyMissiles()    {
        for (let i = 0; i < this.mEnemySet.length; i++) {
            if (this.mEnemySet[i].launchMissile()) {
                let xform = this.mEnemySet[i].getXform();
                //for elites
                if(this.mEnemySet[i] instanceof Elite){
                    // create Mirv
                    let mirv = new Mirv(this.kMirv, 5000, this.kMirvTrail, 500, 50, [5, 5]);
                    mirv.getXform().setSize(12, 8);
                    mirv.getXform().setPosition(xform.getXPos(), xform.getYPos());
                    mirv.setTracking(this.mHero,5, 0.4, -2/3600);

                    // Push missile into missile set 
                    this.mEnemyMissileSet.push(mirv);


                }// non elites
                else{
                    // create Missile
                    let missile = new Missile(this.kEnemyMissile, 5000, this.kEnemyMissileTrail, 500, 50, [2, 1], this.kExplosion);
                    missile.getXform().setSize(10, 7);
                    missile.getXform().setPosition(xform.getXPos(), xform.getYPos());
                    missile.setStraight(this.mHero, null, null, 0.4, 0);

                    // Push missile into missile set 
                    this.mEnemyMissileSet.push(missile);
                }
               
            }
        }
    }

    checkEnemyHit() {
        let hitPos = [];

        for (let i = 0; i < this.mHeroMissileSet.length; i++)   {
            for (let j = 0; j < this.mEnemySet.length; j++) {
                if (this.mHeroMissileSet[i].pixelTouches(this.mEnemySet[j], hitPos))  {
                    this.mEnemySet[j].mValid = false;
                    this.mHeroMissileSet[i].onTermination();
                    this.points++;
                    this.mText.setText("Score: " + this.points + " Hearts: " + this.hearts);
                }
            }
        }
    }

    autoSpawnEnemy()    {
        if (performance.now() - this.spawnTime >= this.timeInterval) {
            let rand = Math.random();
            if (rand > 0.2) {
                let enemy = new Enemy(this.kEnemyShip, this.mCamera);
                this.spawnTime = performance.now();
                this.mEnemySet.push(enemy);
            }   else    {
                let elite = new Elite(this.kAltEnemy, this.mCamera);
                this.spawnTime = performance.now();
                this.mEnemySet.push(elite);
            }
        }
    }

    checkHeroHit()  {
        let hitPos = [];
        
        for (let i = 0; i < this.mEnemyMissileSet.length; i++)  {
            if (this.mEnemyMissileSet[i].pixelTouches(this.mHero, hitPos)) {
                this.hit.getXform().setRotationInDegree(this.mEnemyMissileSet[i].getXform().getRotationInDegree());
                this.hit.getXform().setPosition(hitPos[0], hitPos[1]);
                let size = Math.random() * 10 + 1;
                this.hit.getXform().setSize(size, size);
                this.mEnemyMissileSet[i].onTermination();
                this.hearts--;
                this.mText.setText("Score: " + this.points + " Hearts: " + this.hearts);
            }else if(this.mEnemyMissileSet[i].inFlightEffect()){
                for(let j =1;j<4;j++){
                    let missile = new Missile(this.kEnemyMissile, 5000, this.kEnemyMissileTrail, 500, 50, [2, 1], this.kExplosion);
                    missile.getXform().setSize(10, 7);
                    missile.getXform().setPosition(this.mEnemyMissileSet[i].getXform().getXPos(), this.mEnemyMissileSet[i].getXform().getYPos());
                    missile.setStraight(null, null, j*90+Math.random()*40, 0.4, 0);
                    // Push missile into missile set 
                    this.mEnemyMissileSet[i].makeChildren=false;
                    this.mEnemyMissileSet.push(missile);
                }
            }
        }
    }

    checkGodMode()  {
        if (engine.input.isKeyClicked(engine.input.keys.G)) {
            this.godMode = !this.godMode;
        }
    }

    isDead()    {
        if (this.hearts === 0 && !this.godMode)  {
           // this.stop();
        }
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new SpaceFight();
    myGame.start();
}

export default SpaceFight;