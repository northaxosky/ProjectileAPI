"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Box extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.mRenderComponent =  new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setSize(150, 50);
        this.mRenderComponent.getXform().setPosition(100, 20);
    }

    getRenderable() {
        return this.mRenderComponent;
    }
}

export default Box;