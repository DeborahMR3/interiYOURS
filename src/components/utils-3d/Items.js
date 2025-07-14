import {
  Color3,
  CreateGround,
  ImportMeshAsync,
  Mesh,
  MeshBuilder,
  PointerDragBehavior,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";

class Furniture {
  constructor(id, meshFile, scene, position, rotation, saveFurniturePosition) {
    this.meshFile = meshFile;
    this.id = id;
    this.scene = scene;
    this.position = position;
    this.rotation = rotation;
    this.saveFurniturePosition = saveFurniturePosition;
    this.setupMesh();
  }

  updatePosition() {
    this.saveFurniturePosition(
      this.id,
      this.meshFile,
      new Vector3(this.mesh.position.x, 0, this.mesh.position.z),
      this.mesh.rotation.y
    );
  }

  async setupMesh() {
    try {
      const result = await ImportMeshAsync(
        `../../public/models/${this.meshFile}`, //Check path! Sometimes works with relative path only?
        this.scene
      );

      const degConv = 180 / 3.14159;

      this.mesh = result.meshes[0];
      //console.log(result.meshes[0]);
      this.mesh.position = this.position;
      this.mesh.rotate(new Vector3(0, 1, 0), -3.14 / 4);
      console.log(this.mesh.rotationQuaternion.toEulerAngles().y * degConv);

      this.mesh.overlayColor = new Color3(0, 0, 1);
      this.mesh.overlayAlpha = 0.8;
      this.mesh.renderOverlay = true;

      this.mesh.checkCollisions = true;

      const pointerDragBehavior = new PointerDragBehavior({
        dragPlaneNormal: new Vector3(0, 1, 0),
      });

      this.mesh.addBehavior(pointerDragBehavior);

      pointerDragBehavior.onDragStartObservable.add((event) => {
        //console.log("dragStart");
        //console.log(event);
      });
      pointerDragBehavior.onDragObservable.add((event) => {
        //console.log("drag");
        //console.log(event);
      });
      pointerDragBehavior.onDragEndObservable.add((event) => {
        //console.log("dragEnd");
        this.mesh.renderOverlay = false;

        //console.log(event);
        this.updatePosition();
      });
    } catch (err) {
      console.log(err);
    }
  }
}

class Floor {
  constructor(dimensions, scene) {
    this.scene = scene;
    this.floor = CreateGround(
      "ground",
      { width: dimensions.x, height: dimensions.y },
      scene
    );
    this.floor.position = new Vector3(0, -0.01, 0);
    const material = new StandardMaterial("floor", scene);
    material.diffuseColor = new Color3(0.7, 0.6, 0.7);
    this.floor.material = material;
  }
}

export { Furniture, Floor };
