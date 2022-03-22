"use strict";

import TextureRenderable from "./texture_renderable.js";

class TrailRenderable extends TextureRenderable {
  constructor(renderable, _lifeTime, xform, size=[2,1] ) {
    super(renderable);

    // renderable component
    this.mRenderable = new TextureRenderable(renderable);
    this.getXform().setSize(size[0], size[1]);
    this.getXform().setPosition(xform.getXPos(), xform.getYPos());
    this.getXform().setRotationInRad(xform.getRotationInRad());

    // field values
    this.mLifeTime = _lifeTime;
    this.mValid = true;
    this.mCreateTime = performance.now()
  }
  
  update() {
    // stop rendering this trail renderable
    if (performance.now() - this.mCreateTime > this.mLifeTime) {
      this.mValid = false;
    }
  }

  terminate() {
    this.mValid = false;
  }
}
export default TrailRenderable;