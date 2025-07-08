import { ArcRotateCamera, Vector3 } from "@babylonjs/core";

class MainCamera {
  constructor(canvas, scene) {
    this.canvas = canvas;
    this.scene = scene;
    this.camera = new ArcRotateCamera(
      "camera",
      0,
      5,
      10,
      Vector3.Zero(),
      scene
    );

    this.camera.attachControl(canvas.current, true);
  }
}

export default MainCamera;
