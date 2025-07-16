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
  setIsRotating,
  isDeleting,
  setIsDeleting,
  deleteItem,
  deleteAllItems,
  currentPackage,
}) => {
  const canvasRef = useRef(null);

  const [currentScene, setCurrentScene] = useState({});
  const [currentItem, setCurrentItem] = useState(null);
  const [itemsInitialised, setItemsInitialised] = useState(false);
  const [current3dLayout, setCurrent3dLayout] = useState([]);

  const clearAllFurniture = () => {
    current3dLayout.forEach((item) => {
      item.setDeleting();
    });
    console.log("current3dLayout from clearAllFurniture >>", current3dLayout);
    setCurrent3dLayout([]);
    // deleteAllItems();

    // reset other states too!
  };

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
    setCurrentItem((prev) => {
      if (prev !== selectedItem) {
        prev.setMoving();
        setIsRotating(false);
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

    const light = new HemisphericLight("light", new Vector3(0.5, 1, 0), scene);
    light.intensity = 1;
    light.specular = new Color3(0.35, 0.35, 0.33);

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
      setCurrent3dLayout((prev) => [...prev, newItem]);
      return;
    }
    if (itemsInitialised) return;
    clearAllFurniture();
    const furnitureArray = currentLayout.map((furniture, index) => {
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
      return individualFurniture;
    });
    console.log("furnitureArray >>>", furnitureArray);
    setCurrent3dLayout((prev) => [...prev, furnitureArray]);
    setItemsInitialised(true);
    setIsItemAdded(false);
  }, [currentLayout, currentScene]);

  useEffect(() => {
    if (!itemsInitialised) return;
    if (isRotating) {
      currentItem.setRotating();
    } else {
      currentItem.setMoving();
    }
  }, [isRotating]);

  useEffect(() => {
    if (isRotating) {
      currentItem.setRotating();
    }
  }, [isRotating]);

  useEffect(() => {
    if (!isDeleting) return;
    currentItem.setDeleting();
    deleteItem(currentItem);
  }, [isDeleting]);

  useEffect(() => {
    console.log("currentPackage from useEffect >>>", currentPackage);
    clearAllFurniture();
  }, [currentPackage]);

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default Main3dCanvas;
