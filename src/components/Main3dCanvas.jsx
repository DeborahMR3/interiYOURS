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

const Main3dCanvas = ({ currentLayout }) => {
  const canvasRef = useRef(null);

  const [currentScene, setCurrentScene] = useState({});

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    setCurrentScene(scene);
    scene.collisionsEnabled = true;

    const camera = new MainCamera(canvasRef, scene);
    let floor = new Floor(new Vector2(5, 5), scene);
    floor = new Floor(new Vector2(2, 5), scene);

    /// /// /// TEST BOX /// /// ///
    const testBox = new Furniture(
      "bed-malm-white.glb",
      scene,
      new Vector3(1, 0, 1)
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
    currentLayout.forEach((furniture) => {
      const newFurniture = new Furniture(
        furniture.model,
        currentScene,
        furniture.position
      );
    });
  }, [currentLayout]);

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "110%" }} />
    </div>
  );
};

export default Main3dCanvas;
