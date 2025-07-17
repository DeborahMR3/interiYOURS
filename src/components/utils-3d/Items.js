import {
  Color3,
  CreateGround,
  ImportMeshAsync,
  MeshBuilder,
  PointerDragBehavior,
  StandardMaterial,
  Texture,
  Vector3,
  CSG,
} from "@babylonjs/core";
import "@babylonjs/loaders";

const degConv = 180 / Math.PI;

class Furniture {
  constructor(
    id,
    meshFile,
    scene,
    position,
    rotation,
    saveFurniturePosition,
    selectItem,
    deleteItem
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
      this.mesh.rotationQuaternion.toEulerAngles().y * degConv
    );
  }

  setRotating() {
    console.log("setRotating called");
    this._isRotating = true;
    this.meshes.meshes[1].overlayColor = new Color3(0.9, 1, 1);
    this.meshes.meshes[1].overlayAlpha = 0.4;
    this.meshes.meshes[1].renderOverlay = true;
  }

  setMoving() {
    this._isRotating = false;
    this.meshes.meshes[1].renderOverlay = false;
  }

  setDeleting() {
    console.log("deleting " + this.meshFile);
    this.meshes.meshes.forEach((mesh) => {
      mesh.dispose();
    });
  }

  setDragBehaviour() {
    let initialX;
    let offsetX = 0;
    this.pointerDragBehavior.onDragStartObservable.add((event) => {
      //console.log("dragStart");
      //console.log(event);
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
      offsetX = event.delta._x;
      //console.log(event.delta._x);
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
        `${import.meta.env.BASE_URL}models/${this.meshFile}`, //Check path! Sometimes works with relative path only?
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
      //console.log(this.mesh.rotationQuaternion.toEulerAngles().y);

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
      `${import.meta.env.BASE_URL}textures/laminate_floor.jpg`,
      this.scene
    );
    texture.uScale = 2;
    texture.vScale = 2;
    //material.diffuseColor = new Color3(0.7, 0.6, 0.7);
    material.diffuseTexture = texture;
    this.floor.material = material;

    const wallHeight = 2.5;
    //const wallThickness = 0.1;
    const width = dimensions.x;
    const depth = dimensions.y;

    const wallMaterial = new StandardMaterial("wallMat", this.scene);
    wallMaterial.diffuseColor = new Color3(1, 1, 1);
    wallMaterial.backFaceCulling = true;
    wallMaterial.alpha = 1;

    /*this.backWall = MeshBuilder.CreateBox(
      "backWall",
      {
        width: width,
        height: wallHeight,
        depth: wallThickness,
      },
      this.scene
    );
    this.backWall.position = new Vector3(0, wallHeight / 2, -depth / 2);
    this.backWall.material = wallMaterial;
    const hole = MeshBuilder.CreateBox(
      "hole",
      {
        width: 0.5,
        height: 0.5,
        depth: wallThickness + 0.01,
      },
      this.scene
    );
    hole.position = new Vector3(0, 0.5, -depth / 2);

    const wallCSG = CSG.FromMesh(this.backWall);
    const holeCSG = CSG.FromMesh(hole);

    const wallWithHoleCSG = wallCSG.subtract(holeCSG);
    const wallWithHoleMesh = wallWithHoleCSG.toMesh(
      "backWallWithHole",
      wallMaterial,
      this.scene
    );

    this.backWall.dispose();
    hole.dispose();

    this.backWall = wallWithHoleMesh;

    this.frontWall = MeshBuilder.CreateBox(
      "frontWall",
      {
        width: width,
        height: wallHeight,
        depth: wallThickness,
      },
      this.scene
    );
    this.frontWall.position = new Vector3(0, wallHeight / 2, depth / 2);
    this.frontWall.material = wallMaterial;

    this.leftWall = MeshBuilder.CreateBox(
      "leftWall",
      {
        width: depth + wallThickness,
        height: wallHeight,
        depth: wallThickness,
      },
      this.scene
    );
    this.leftWall.rotation.y = Math.PI / 2;
    this.leftWall.position = new Vector3(-width / 2, wallHeight / 2, 0);
    this.leftWall.material = wallMaterial;

    this.rightWall = MeshBuilder.CreateBox(
      "rightWall",
      {
        width: depth + wallThickness,
        height: wallHeight,
        depth: wallThickness,
      },
      this.scene
    );
    this.rightWall.rotation.y = Math.PI / 2;
    this.rightWall.position = new Vector3(width / 2, wallHeight / 2, 0);
    this.rightWall.material = wallMaterial;*/

    this.backWall = MeshBuilder.CreatePlane(
      "backWall",
      { width: width, height: wallHeight },
      this.scene
    );
    this.backWall.rotation = new Vector3(0, Math.PI, 0);
    this.backWall.position = new Vector3(0, wallHeight / 2, -depth / 2);
    this.backWall.material = wallMaterial;
    this.backWall.isPickable = false;

    this.frontWall = MeshBuilder.CreatePlane(
      "frontWall",
      { width: width, height: wallHeight },
      this.scene
    );
    this.frontWall.rotation = new Vector3(0, 0, 0);
    this.frontWall.position = new Vector3(0, wallHeight / 2, depth / 2);
    this.frontWall.material = wallMaterial;
    this.frontWall.isPickable = false;

    this.leftWall = MeshBuilder.CreatePlane(
      "leftWall",
      { width: depth, height: wallHeight },
      this.scene
    );
    this.leftWall.rotation = new Vector3(0, -Math.PI / 2, 0);
    this.leftWall.position = new Vector3(-width / 2, wallHeight / 2, 0);
    this.leftWall.material = wallMaterial;
    this.leftWall.isPickable = false;

    this.rightWall = MeshBuilder.CreatePlane(
      "rightWall",
      { width: depth, height: wallHeight },
      this.scene
    );
    this.rightWall.rotation = new Vector3(0, Math.PI / 2, 0);
    this.rightWall.position = new Vector3(width / 2, wallHeight / 2, 0);
    this.rightWall.material = wallMaterial;
    this.rightWall.isPickable = false;
  }
}

export { Furniture, Floor };
