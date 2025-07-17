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
  PointerInput,
  PointerDragBehavior,
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
    console.log("current3dLayout from clearAllFurniture >>", current3dLayout);
    current3dLayout.forEach((item) => {
      item.setDeleting();
    });
    setCurrent3dLayout([]);
    // deleteAllItems();

    // reset other states too!
  };

  const saveFurniturePosition = (furnitureId, meshFile, vector3, rotation) => {
    if (!itemsInitialised) return;
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
      if (prev === null) {
      } else if (prev !== selectedItem) {
        prev.setMoving();
        prev.disableSelected();
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
    scene.clearColor = new Color3(0.9804, 0.949, 0.9412);

    // const pointer = new Pointer();
    // pointer.onDragObservable.add((event) => {
    //   console.log(event);
    // });

    scene.onPointerDown = (event) => {
      let pickResult = scene.pick(scene.pointerX, scene.pointerY);
      if (!pickResult.hit) {
        selectItem(null);
      }
    };

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
    console.log("CurrentLayout updated!");
    if (itemsInitialised) return;
    clearAllFurniture();
    setItemsInitialised(true);
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
    setCurrent3dLayout(() => {
      return [...furnitureArray];
    });
    setIsItemAdded(false);
  }, [currentLayout, currentScene, itemsInitialised]);

  useEffect(() => {
    if (!itemsInitialised) return;
    if (!currentItem) {
      setIsRotating(false);
      return;
    }
    if (isRotating) {
      currentItem.setRotating();
    } else {
      currentItem.setMoving();
      currentItem.enableSelected();
    }
  }, [isRotating]);

  // useEffect(() => {
  //   if (!currentItem) return;
  //   if (isRotating) {
  //     currentItem.setRotating();
  //   }
  // }, [isRotating]);

  useEffect(() => {
    console.log(current3dLayout);
  }, [current3dLayout]);

  useEffect(() => {
    if (!isDeleting) return;
    if (!currentItem) return;
    currentItem.setDeleting();
    deleteItem(currentItem);
  }, [isDeleting]);

  useEffect(() => {
    if (!itemsInitialised) return;
    console.log("currentPackage from useEffect >>>", currentPackage);
    console.log("Current3dLayout from useEffect>>>", current3dLayout);
    clearAllFurniture();
    setItemsInitialised(false);
  }, [currentPackage]);

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default Main3dCanvas;
