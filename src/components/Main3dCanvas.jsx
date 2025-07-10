import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HemisphericLight,
} from "@babylonjs/core";
import MainCamera from "./utils-3d/MainCamera";
import Furniture from "./utils-3d/Items";

const aiTestResponseStr =
  '```json\n[\n  {\n    "itemName": "LACK Side Table",\n    "dimensions": {\n      "x": 50,\n      "y": 50,\n      "z": 45\n    },\n    "coordinates": {\n      "x": 0.25,\n      "y": 0.25\n    }\n  },\n  {\n    "itemName": "HEMNES Desk",\n    "dimensions": {\n      "x": 138,\n      "y": 66,\n      "z": 75\n    },\n    "coordinates": {\n      "x": 0.7,\n      "y": 0.2\n    }\n  },\n  {\n    "itemName": "KALLAX Storage Unit",\n    "dimensions": {\n      "x": 77,\n      "y": 77,\n      "z": 147\n    },\n    "coordinates": {\n      "x": 2.2,\n      "y": 0.2\n    }\n  },\n  {\n    "itemName": "OMET Light",\n    "dimensions": {\n      "x": 11,\n      "y": 11,\n      "z": 180\n    },\n    "coordinates": {\n      "x": 2.75,\n      "y": 1.2\n    }\n  }\n]\n```';

const Main3dCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.collisionsEnabled = true;

    const camera = new MainCamera(canvasRef, scene);
    camera.topdownCamera();

    /// /// /// TEST BOX /// /// ///
    const testBox = new Furniture("", scene);

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
  });

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "110%" }} />
    </div>
  );
};

export default Main3dCanvas;
