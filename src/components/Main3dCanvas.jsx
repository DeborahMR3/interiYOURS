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
  currentLayout,
  updateFurniturePosition,
  isItemAdded,
  setIsItemAdded,
}) => {
  const canvasRef = useRef(null);

  const [currentScene, setCurrentScene] = useState({});

  const saveFurniturePosition = (furnitureId, meshFile, vector3, rotation) => {
    let newItem = {
      id: furnitureId,
      model: meshFile,
      position: vector3,
      rotation,
    };
    updateFurniturePosition(newItem);
  };

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    setCurrentScene(scene);
    scene.collisionsEnabled = true;
    scene.clearColor = new Color3(1, 1, 1);

    const camera = new MainCamera(canvasRef, scene);
    let floor = new Floor(new Vector2(8, 5), scene);
    floor = new Floor(new Vector2(2, 5), scene);

    /// /// /// TEST BOX /// /// ///
    const testBed = new Furniture(
      "id1",
      "bed-malm-white.glb",
      scene,
      new Vector3(1, 0, 1),
      0,
      saveFurniturePosition
    );

    const testSeat = new Furniture(
      "id2",
      "seat-stockholm-birch.glb",
      scene,
      new Vector3(-1, 0, -1),
      0,
      saveFurniturePosition
    );

    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = new Color3(1, 0, 0);
    const ground = MeshBuilder.CreateBox(
      "ground",
      { width: 1, height: 2, depth: 1, subdivisions: 2 },
      scene
    );
    ground.position = new Vector3(2, 1, 2);
    ground.material = material;
    ground.checkCollisions = true;
    ground.ellipsoid = new Vector3(10, 1, 10);
    /// /// /// TEST BOX /// /// ///

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());
    return () => engine.dispose();
  }, []);

  useEffect(() => {
    if (isItemAdded) {
      setIsItemAdded(false);
      const itemData = currentLayout[currentLayout.length - 1];
      const newItem = new Furniture(
        itemData.id,
        itemData.model,
        currentScene,
        itemData.position,
        itemData.rotation,
        saveFurniturePosition
      );
    }
    // currentLayout.forEach((furniture) => {
    //   const newFurniture = new Furniture(
    //     furniture.id,
    //     furniture.model,
    //     currentScene,
    //     furniture.position,
    //     saveFurniturePosition
    //   );
    // });
  }, [currentLayout]);

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default Main3dCanvas;
