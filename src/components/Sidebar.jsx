import { Vector3 } from "@babylonjs/core";
import { useState } from "react";

const Sidebar = ({ addFurniture }) => {
  const [isVisible, setIsVisible] = useState();
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const testItem = {
    model: "20-DYVLINGE swivel armchair - Kelinge black (00555090).glb",
    position: new Vector3(-2, 0, -2),
  };
  const addTestItem = () => {
    addFurniture(testItem);
  };

  return (
    <>
      <button className="nav-button" onClick={toggleSidebar}>
        Nav
      </button>
      <div className={"sidebar " + (isVisible ? "visible" : "hidden")}>
        <h2>Nav Bar</h2>
        <button onClick={addTestItem}>Test1</button>
      </div>
    </>
  );
};

export default Sidebar;
