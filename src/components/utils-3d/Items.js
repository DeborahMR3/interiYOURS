import {
  Color3,
  CreateGround,
  ImportMeshAsync,
  PointerDragBehavior,
  StandardMaterial,
  Texture,
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
    this.meshes;
    this.mesh;
    this.setupMesh();
  }

  updatePosition() {
    let formattedItem = {
      id: this.id,
      model: this.meshFile,
      position: {
        x: this.mesh.position.x,
        y: this.mesh.position.y,
        z: this.mesh.position.z,
      },
      rotation: this.rotation,
    };
    this.saveFurniturePosition(this, formattedItem);
  }

  remove() {
    this.meshes.meshes.forEach((mesh) => {
      mesh.dispose();
    });

    console.log(this);
  }

  async setupMesh() {
    try {
      this.meshes = await ImportMeshAsync(
        `../../public/models/${this.meshFile}`, //Check path! Sometimes works with relative path only?
        this.scene
      );

      const degConv = 180 / 3.14159;

      this.mesh = this.meshes.meshes[0];
      this.mesh.position = new Vector3(
        this.position.x,
        this.position.y,
        this.position.z
      );
      this.mesh.rotation = new Vector3(0, 0, 0);
      this.mesh.rotate(
        new Vector3(0, 1, 0),
        (180 + this.rotation) * (1 / degConv)
      );
      //console.log(this.mesh.rotationQuaternion.toEulerAngles().y);

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
        console.log(event);
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
    const material = new StandardMaterial("floor", this.scene);
    const texture = new Texture(
      "../../public/textures/laminate_floor.jpg",
      this.scene
    );
    texture.uScale = 2;
    texture.vScale = 2;
    //material.diffuseColor = new Color3(0.7, 0.6, 0.7);
    material.diffuseTexture = texture;
    this.floor.material = material;
  }
}

export { Furniture, Floor };
