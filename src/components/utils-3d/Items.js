import {
  ImportMeshAsync,
  Mesh,
  MeshBuilder,
  PointerDragBehavior,
  Vector3,
} from "@babylonjs/core";

const pointerDragBehavior = new PointerDragBehavior({
  dragPlaneNormal: new Vector3(0, 1, 0),
});

class Furniture {
  constructor(meshFile, scene) {
    //this.mesh = ImportMeshAsync(meshFile, scene);
    //this.mesh = Mesh.CreateBox("test sphere", 12, 12, scene);
    this.mesh = MeshBuilder.CreateBox(
      "test box",
      { width: 2, height: 6, depth: 2, subdivisions: 2 },
      scene
    );
    this.mesh.position.x = 4;
    this.mesh.position.z = 4;

    this.mesh.addBehavior(pointerDragBehavior);
  }
}

export default Furniture;
