import { Vector3 } from "@babylonjs/core";
import { useState } from "react";
import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";
import "./styling/SideBar.css";

const Sidebar = ({
  addFurniture,
  packages,
  canEdit,
  roomData,
  setCurrentPackage,
  setCurrentLayout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");

  const handleLoadPackage = (plan, roomData) => {
    if (plan.placements.length !== 0) {
      setCurrentPackage(plan.name);
      const halfW = roomData.roomWidth * 0.5;
      const halfL = roomData.roomLength * 0.5;
      let newLayout = plan.placements.map((item) => {
        let packageItem = {
          id: item.id,
          model: item.modelRef,
          position: {
            x: (item.x - halfW) / 100,
            z: (item.y - halfL) / 100,
            y: 0,
          },
          rotation: item.rotation,
        };
        return packageItem;
      });
      setCurrentLayout(newLayout);
    } else {
      console.warn("Sorry, no placements available for this package!");
    }
  };

  function openSidebar() {
    setIsSidebarOpen(true);
    setActiveTab("plans");
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <>
      {!isSidebarOpen && (
        <div className="sidebar-launcher">
          <button
            className="sidebar-launch-btn"
            onClick={openSidebar}
            disabled={!canEdit}
          >
            Layout Plans
          </button>
        </div>
      )}

      {isSidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <button
              className={`sidebar-tab-btn ${
                activeTab === "plans" ? "active" : ""
              }`}
              onClick={() => setActiveTab("plans")}
            >
              Suggested Plans
            </button>
            <button
              className={`sidebar-tab-btn ${
                activeTab === "furniture" ? "active" : ""
              }`}
              onClick={() => setActiveTab("furniture")}
            >
              Furniture Options
            </button>
            <button className="sidebar-close-btn" onClick={closeSidebar}>
              X
            </button>
          </div>

          <div className="sidebar-content">
            {activeTab === "plans" && (
              <div className="plans-list">
                {packages.map((plan, index) => (
                  <div key={index} className="plan-card">
                    <div className="plan-option">Plan {plan.name}</div>

                    <div className="plan-items-details">
                      {plan.items.map((item, index) => {
                        const furniture = furnitureCatalog.find(
                          (f) => f.name === item.name
                        );
                        return (
                          <div key={index} className="plan-item-detail">
                            {furniture && (
                              <img
                                src={furniture.imgUrl}
                                alt={item.name}
                                className="plan-item-img"
                              />
                            )}
                            <span className="furniture-name">{item.name}</span>
                            <span className="furniture-price">
                              £{item.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="view-package-button"
                      onClick={() => handleLoadPackage(plan, roomData)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "furniture" && (
              <div className="furniture-list">
                {furnitureCatalog.map((item) => (
                  <section key={item.id} className="furniture-item">
                    <img
                      className="furniture-img"
                      src={item.imgUrl}
                      alt={item.name}
                    />
                    <span className="furniture-name">{item.name}</span>
                    <span className="furniture-price">£{item.price}</span>
                    <span className="furniture-dimensions">
                      {item.dimensions.length} x {item.dimensions.width}
                    </span>
                    <button
                      className="add-btn"
                      onClick={() => {
                        const furnitureToAdd = {
                          id: item.id,
                          model: item.modelRef,
                          position: new Vector3(0, 0, 0),
                          rotation: 90,
                        };
                        addFurniture(furnitureToAdd);
                      }}
                    >
                      Add
                    </button>
                  </section>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
