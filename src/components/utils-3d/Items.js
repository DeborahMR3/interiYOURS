import {
  Color3,
  ImportMeshAsync,
  Mesh,
  MeshBuilder,
  PointerDragBehavior,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

const pointerDragBehavior = new PointerDragBehavior({
  dragPlaneNormal: new Vector3(0, 1, 0),
});

class Furniture {
  constructor(meshFile, scene) {
    this.scene = scene;
    this.setupMesh();
  }

  async setupMesh() {
    try {
      this.mesh = await ImportMeshAsync("./models/1.glb", this.scene);
      console.log(this.mesh.meshes);
      this.mesh.addBehavior(pointerDragBehavior);

      //   console.log(pointerDragBehavior);
      //this.mesh.moveWithCollisions(pointerDragBehavior);
      //   this.mesh.checkCollisions = true;
      //   this.mesh.ellipsoid = new Vector3(10, 1, 10);
      // this.mesh.renderOutline = true;
      // this.mesh.outlineColor = new Color3(0, 0, 1);
      // this.mesh.overlayAlpha = 0.8;
      // this.mesh.overlayColor = new Color3(0, 0, 1);
      // this.mesh.renderOverlay = true;
      // this.mesh.outlineWidth = 0.1;
    } catch (err) {
      console.log(err);
    }
  }
}

export default Furniture;
