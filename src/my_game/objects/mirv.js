"use strict";

import Projectile from "../../engine/game_objects/projectile.js";
import Missile from "./missile.js";
class Mirv extends Projectile    {
    constructor(renderable, lifetime, trailTexture, trailLifetime, trailInterval, trailSize) {
        super(renderable, lifetime, trailTexture, trailLifetime, trailInterval, trailSize);
        this.makeChildren = true
    }

    update()    {
        super.update();
    
    }

    inFlightEffect(){
        return this.makeChildren && performance.now()>this.lifetime/2+this.creationTime
    }

    onTermination(){
        super.onTermination()
        //spawn the expolison texture
    }

}

export default Mirv;