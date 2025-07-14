import { Vector3 } from "@babylonjs/core";
import { useState } from "react";

import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";
import "./styling/SideBar.css";

const Sidebar = ({ addFurniture }) => {
  const [isVisible, setIsVisible] = useState();
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const testItem = {
    id: "testid",
    model: "sofa-stockholm-brown.glb",
    position: new Vector3(-2, 0, -2),
  };
  const addTestItem = () => {
    addFurniture(testItem);
  };

  return (
    <>
      <button className="nav-button" onClick={toggleSidebar}>
        Furniture options:
      </button>

      <section className={"sidebar " + (isVisible ? "visible" : "hidden")}>
      <div className="sidebar-header-card">
        <span className="sidebar-title">Furniture options</span>
        <button className="close-btn" onClick={toggleSidebar}>X</button>
      </div>

        <div className="furniture-list">
          {furnitureCatalog.map((item) => (
            <section key={item.id} className="furniture-item">
               {/* item IMG */}
               <img className="furniture-img" src={item.imgUrl} alt={item.name} />
               {/* name*/}
               <span className="furniture-name">{item.name}</span>
               {/* price */}
              <span className="furniture-price">£{item.price}</span>
              {/* dimensions */}
               <span className="furniture-dimensions"> {item.dimensions.length} x {item.dimensions.width} </span>

               {/* Button to add furniture*/}
              <button className="add-btn" onClick={() => {
                  const furnitureToAdd = {
                    id: item.id,
                    model: item.modelRef, // fix to model instead of modelREf
                    position: new Vector3(0, 0, 0),
                  };
                  addFurniture(furnitureToAdd);
                }}
              >Add to your project</button>
            </section>
          ))}
        </div>
      </section>
    </>
  );
};

export default Sidebar;
