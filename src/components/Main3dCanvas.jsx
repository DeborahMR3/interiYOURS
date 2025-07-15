import { useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HemisphericLight,
  CubeTexture,
  Vector2,
} from "@babylonjs/core";
import MainCamera from "./utils-3d/MainCamera";
import { Furniture, Floor } from "./utils-3d/Items";

const Main3dCanvas = ({
  roomData,
  currentLayout,
  updateFurniturePosition,
  isItemAdded,
  setIsItemAdded,
  isRotating,
}) => {
  const canvasRef = useRef(null);

  const [currentScene, setCurrentScene] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const [itemsInitialised, setItemsInitialised] = useState(false);

  const saveFurniturePosition = (furnitureId, meshFile, vector3, rotation) => {
    let newItem = {
      id: furnitureId,
      model: meshFile,
      position: vector3,
      rotation,
    };
    updateFurniturePosition(newItem);
  };

  const selectItem = (selectedItem) => {
    console.log("select item called from" + selectedItem);
    setCurrentItem((prev) => {
      if (prev !== selectedItem) {
        prev.setMoving();
      }
      return selectedItem;
    });
  };

  useEffect(() => {
    if (!roomData) {
      return;
    }

    const { roomLength, roomWidth } = roomData;
    const metresConv = 0.01;
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    setCurrentScene(scene);
    scene.collisionsEnabled = true;
    scene.clearColor = new Color3(0.98, 0.93, 0.91);

    const camera = new MainCamera(canvasRef, scene);
    let floor = new Floor(
      new Vector2(roomWidth * metresConv, roomLength * metresConv),
      scene
    );

    /// /// /// TEST BOX /// /// ///
    // const testBed = new Furniture(
    //   "id1",
    //   "bed-malm-white.glb",
    //   scene,
    //   new Vector3(1, 0, 1),
    //   0,
    //   saveFurniturePosition
    // );

    // const testSeat = new Furniture(
    //   "id2",
    //   "seat-stockholm-birch.glb",
    //   scene,
    //   new Vector3(-1, 0, -1),
    //   0,
    //   saveFurniturePosition
    // );

    const light = new HemisphericLight("light", new Vector3(0.5, 1, 0), scene);
    light.intensity = 1;
    light.specular = new Color3(0.35, 0.35, 0.33);
    // const material = new StandardMaterial("material", scene);
    // material.diffuseColor = new Color3(1, 0, 0);
    // const ground = MeshBuilder.CreateBox(
    //   "ground",
    //   { width: 1, height: 2, depth: 1, subdivisions: 2 },
    //   scene
    // );
    // ground.position = new Vector3(2, 1, 2);
    // ground.material = material;
    // ground.checkCollisions = true;
    // ground.ellipsoid = new Vector3(10, 1, 10);
    /// /// /// TEST BOX /// /// ///

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());
    return () => engine.dispose();
  }, [roomData]);

  useEffect(() => {
    if (currentLayout.length === 0 || Object.keys(currentScene).length === 0)
      return;
    if (isItemAdded && itemsInitialised) {
      setIsItemAdded(false);
      const itemData = currentLayout[currentLayout.length - 1];
      const newItem = new Furniture(
        itemData.id,
        itemData.model,
        currentScene,
        itemData.position,
        itemData.rotation,
        saveFurniturePosition,
        selectItem
      );
      return;
    }
    if (itemsInitialised) return;
    currentLayout.forEach((furniture, index) => {
      let individualFurniture = new Furniture(
        furniture.id,
        furniture.model,
        currentScene,
        furniture.position,
        furniture.rotation,
        saveFurniturePosition,
        selectItem
      );
      if (index === currentLayout.length - 1)
        setCurrentItem(individualFurniture);
    });
    setItemsInitialised(true);
    setIsItemAdded(false);
  }, [currentLayout, currentScene]);

  useEffect(() => {
    if (isRotating) {
      currentItem.setRotating();
    }
  }, [isRotating]);

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default Main3dCanvas;
