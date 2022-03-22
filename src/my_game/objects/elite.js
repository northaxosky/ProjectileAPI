"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Missile from "./missile.js";

class Elite extends engine.GameObject {
    constructor(texture, cam) {
        super(null);
        this.kDelta = 0.2;
        this.kRDelta = 0.1; // radian
        this.last = performance.now();
        this.timer = 5000 + Math.random() * 1000;
        this.mValid = true;

        this.interval = 5000;
        this.lastLaunch = performance.now();

        this.mRenderComponent = new engine.TextureRenderable(texture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setSize(17, 9);
        
        // x = 200;
        // y = 150;
        let x = Math.random() * 150 + 25;
        let y = Math.random() * 25 + 115;
        this.mRenderComponent.getXform().setPosition(x, y);
    }

    launchMissile() {
        let now = performance.now();
        if (now - this.lastLaunch >= this.interval) {
            this.lastLaunch = performance.now();
            return true;
        }

    }

}

export default Elite;