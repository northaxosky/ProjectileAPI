"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);

        // field values for rotation and speed
        this.kDelta = 0.05;
        this.mSpeed = 0.5;

        // Renderable Image
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(100, 37.5);
        this.mRenderComponent.getXform().setSize(10, 10);
        this.mRenderComponent.getXform().setRotationInRad(Math.PI / 2);
    }

    update() {
        let pos = this.getXform().getPosition();
        let xform = this.getXform();

        // control by W and S
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))  {
                vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), 2 * this.mSpeed);
            }   else    {
                vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.mSpeed);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))  {
                vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), 2 * -this.mSpeed);
            }   else    {
                vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), -this.mSpeed);
            }
        }

        // rotation by A and D
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))  {
                vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), 2 * this.kDelta);
                xform.incRotationByRad(2 * this.kDelta);
            }   else    {
                vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), this.kDelta);
                xform.incRotationByRad(this.kDelta);
            }
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))  {
                vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), 2 * -this.kDelta);
                xform.incRotationByRad(2 * -this.kDelta);
            }   else    {
                vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), -this.kDelta);
                xform.incRotationByRad(-this.kDelta);
            }
        }
    }
}

export default Hero;