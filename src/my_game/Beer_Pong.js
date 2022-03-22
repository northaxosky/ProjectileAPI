"use strict";

import engine from "../engine/index.js";

import SpaceFight from "./Space_Fight.js";
import Box from "./objects/box.js"
import Ball from "./objects/ball.js";
import GameObject from "../engine/game_objects/game_object.js";
import GameObjectSet from "../engine/game_objects/game_object_set.js";
import TextureRenderable from "../engine/renderables/texture_renderable_main.js";
import Top from "./objects/top.js";

class BeerPong extends engine.Scene {
  constructor() {
    super();

        // Assets
        this.kBackyard = "assets/backyard.png";
        this.kBall = "assets/ball.png";
        this.kTable = "assets/table.png";
        this.kCup = "assets/lean.png";

        // The camera to view the scene
        this.mCamera = null;
        this.mBg = null;

        this.ball = null;
        this.firstCupBox = null;
        this.cup1 = null;
        this.cup2 = null;
        this.table = null;

    }

    load() {
      engine.texture.load(this.kBackyard);
      engine.texture.load(this.kBall);
      engine.texture.load(this.kTable);
      engine.texture.load(this.kCup);
    }

    unload() {
      engine.texture.unload(this.kBackyard);
      engine.texture.unload(this.kBall);
      engine.texture.unload(this.kTable);
      engine.texture.unload(this.kCup);
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
        let bgR = new engine.SpriteRenderable(this.kBackyard);
        bgR.setElementPixelPositions(0, 1920, 0, 1920);
        bgR.getXform().setSize(275, 275);
        bgR.getXform().setPosition(100, 135);
        this.mBg = new engine.GameObject(bgR);


        this.ball = new Ball(this.kBall, Infinity, null, null, null);
        this.ball.getXform().setSize(7.5, 7.5);
        this.ball.getXform().setPosition(20, 75);

        this.table = new Box(this.kTable);
        this.table.getXform().setSize(150, 50);
        this.table.getXform().setPosition(100, 20);
        GameObject.gameObjectSet.addToSet(this)

        this.cup1 = new Top(this.kCup);
        this.cup2 = new Top(this.kCup);
        this.cup1.getXform().setSize(20, 40);
        this.cup2.getXform().setSize(20, 40);
        this.cup1.getXform().setPosition(160, 60);
        this.cup2.getXform().setPosition(140, 60);

        // this.firstCupBox = new Top(this.kTable);

    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);
        this.ball.draw(camera);
        this.table.draw(camera);
        this.cup1.draw(camera);
        this.cup2.draw(camera);
        // this.firstCupBox.draw(camera);
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        this.ball.update();
        this.checkIfSinks();
    }

    next() {
        super.next();
        GameObject.gameObjectSet = new GameObjectSet();

        let nextLevel = new SpaceFight();
        nextLevel.start();
    }

    checkIfSinks()  {
        let hitPos = []
        if (this.ball.checkSink())    {
            this.ball.reset();
        }
    }

};

export default BeerPong;