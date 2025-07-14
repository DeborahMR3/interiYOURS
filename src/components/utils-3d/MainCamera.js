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
    this.camera.wheelDeltaPercentage = 0.05;

    this.camera.attachControl(canvas.current, true);
    this.camera.lowerRadiusLimit = 5;
    this.camera.upperRadiusLimit = 75;

    this.camera.checkCollisions = true;
    this.camera.collisionRadius = new Vector3(0.5, 0.5, 0.5);
  }

  topdownCamera() {
    this.camera.setPosition(new Vector3(0, 10, 0));
  }
}

export default MainCamera;
