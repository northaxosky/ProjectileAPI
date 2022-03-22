"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Top extends engine.GameObject {
    constructor(texture) {
        super(null);
        this.mRenderComponent =  new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setSize(40, 2);
        this.mRenderComponent.getXform().setPosition(150, 77);
    }

    getRenderable() { return this.mRenderComponent; }

}

export default Top;