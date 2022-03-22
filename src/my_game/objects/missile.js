"use strict";

import Projectile from "../../engine/game_objects/projectile.js";
import TextureRenderable from "../../engine/renderables/texture_renderable_main.js";

class Missile extends Projectile    {
    constructor(renderable, lifetime, trailTexture, trailLifetime, trailInterval, trailSize, kTermination) {
        super(renderable, lifetime, trailTexture, trailLifetime, trailInterval, trailSize);
        this.mTextureTermination = kTermination;
        this.hit = null;
      
    }

   
    update()    {
        super.update();
    }

    onTermination() {
        super.onTermination();
    }

}

export default Missile;