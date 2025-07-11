import { Vector3 } from "@babylonjs/core";
import { useState } from "react";

import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";

const Sidebar = ({ addFurniture }) => {
  const [isVisible, setIsVisible] = useState();
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const testItem = {
    model: "sofa-stockholm-brown.glb",
    position: new Vector3(-2, 0, -2),
  };
  const addTestItem = () => {
    addFurniture(testItem);
  };




  return (
    <>
      <button className="nav-button" onClick={toggleSidebar}>Furniture options:</button>
      {/* <div className={"sidebar " + (isVisible ? "visible" : "hidden")}>
        <h2>Nav Bar</h2>
        <button onClick={addTestItem}>Test1</button>
      </div> */}
      <section className={"sidebar " + (isVisible ? "visible" : "hidden")}>
        <div className="sidebar-header">
         <button className="close-btn" onClick={toggleSidebar}>X</button>
        <span className="sidebar-title">Nav Bar</span>
        </div>

        <div className="furniture-list">
          {furnitureCatalog.map(item => (
          <section key={item.id} className="furniture-item">
            <span>{item.name}</span>
              <button className="add-btn"onClick={() =>
              {const furnitureToAdd = {
                model: item.modelRef,            // fix to model instead of modelREf
                position: new Vector3(0, 0, 0),
              };
              addFurniture(furnitureToAdd);
               }}
              > Add to your project </button>
          </section>
          ))}

        </div>

        <button onClick={addTestItem}>Test1</button>
      </section>
    </>
  );
};

export default Sidebar;
