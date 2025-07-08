import { useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3,
  HemisphericLight,
} from "@babylonjs/core";
import MainCamera from "./utils-3d/MainCamera";

const Main3dCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const camera = new MainCamera(canvasRef, scene);

    /// /// /// TEST BOX /// /// ///
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
    const material = new StandardMaterial("material", scene);
    material.diffuseColor = new Color3(1, 0, 0);
    const ground = MeshBuilder.CreateBox(
      "ground",
      { width: 4, height: 4, depth: 4, subdivisions: 2 },
      scene
    );
    ground.material = material;
    /// /// /// TEST BOX /// /// ///

    engine.runRenderLoop(() => {
      scene.render();
    });
  });

  return (
    <div className="main-3d-canvas">
      <canvas ref={canvasRef} style={{ width: "100%", height: "80vh" }} />
    </div>
  );
};

export default Main3dCanvas;
