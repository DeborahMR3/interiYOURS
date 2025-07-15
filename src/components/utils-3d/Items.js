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

const degConv = 180 / 3.14159;

class Furniture {
  constructor(
    id,
    meshFile,
    scene,
    position,
    rotation,
    saveFurniturePosition,
    selectItem
  ) {
    this.meshFile = meshFile;
    this.id = id;
    this.scene = scene;
    this.position = position;
    this.rotation = rotation;
    this._isRotating = false;
    this.selectItem = selectItem;
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

  setRotating() {
    console.log("setRotating called");
    this._isRotating = true;
    this.meshes.meshes[1].overlayColor = new Color3(0, 0, 1);
    this.meshes.meshes[1].overlayAlpha = 0.8;
    this.meshes.meshes[1].renderOverlay = true;
  }

  setMoving() {
    this._isRotating = false;
    this.meshes.meshes[1].renderOverlay = false;
  }

  setDragBehaviour() {
    let initialX;
    this.pointerDragBehavior.onDragStartObservable.add((event) => {
      //console.log("dragStart");
      console.log(event);
      this.selectItem(this);
      if (!this._isRotating) {
        this.pointerDragBehavior.moveAttached = true;
      } else {
        initialX = event.pointerInfo.event.offsetX;
        this.pointerDragBehavior.moveAttached = false;
      }
    });
    this.pointerDragBehavior.onDragObservable.add((event) => {
      //console.log(event);
      if (!this._isRotating) return;
      console.log(event.delta._x);
      let offsetX = event.delta._x;
      this.mesh.rotate(new Vector3(0, 1, 0), offsetX);
    });
    this.pointerDragBehavior.onDragEndObservable.add((event) => {
      //console.log("dragEnd");
      this.mesh.renderOverlay = false;

      //console.log(event);
      this.updatePosition();
    });
  }

  async setupMesh() {
    try {
      this.meshes = await ImportMeshAsync(
        `../../public/models/${this.meshFile}`, //Check path! Sometimes works with relative path only?
        this.scene
      );

      this.mesh = this.meshes.meshes[0];
      //console.log(result.meshes[0]);
      this.mesh.position = new Vector3(
        this.position.x,
        this.position.y,
        this.position.z
      );
      this.mesh.rotation = new Vector3(0, 0, 0);
      this.mesh.rotate(new Vector3(0, 1, 0), this.rotation * (1 / degConv));
      console.log(this.mesh.rotationQuaternion.toEulerAngles().y);

      // this.mesh.overlayColor = new Color3(0, 0, 1);
      // this.mesh.overlayAlpha = 0.8;
      // this.mesh.renderOverlay = true;

      this.mesh.checkCollisions = true;

      this.pointerDragBehavior = new PointerDragBehavior({
        dragPlaneNormal: new Vector3(0, 1, 0),
      });

      this.mesh.addBehavior(this.pointerDragBehavior);
      this.setDragBehaviour();
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
