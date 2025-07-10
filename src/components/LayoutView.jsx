import { useState } from "react";
import Main3dCanvas from "./Main3dCanvas";
import Sidebar from "./Sidebar";
import "./styling/layout-view.css";

const LayoutView = () => {
  const [currentLayout, setCurrentLayout] = useState([]);

  const addFurniture = (newItem) => {
    console.log("addFurniture called, items:" + currentLayout);
    setCurrentLayout([...currentLayout, newItem]);
  };

  return (
    <div className="layout-view">
      <Sidebar addFurniture={addFurniture} />
      <Main3dCanvas currentLayout={currentLayout} />
    </div>
  );
};

export default LayoutView;
