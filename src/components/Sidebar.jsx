import { Vector3 } from "@babylonjs/core";
import { useState } from "react";
import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";
import "./styling/SideBar.css";

const Sidebar = ({ addFurniture, packages }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("plans");

  // const [currentPlanIndex, setCurrentPlanIndex] = useState(0);  // for arrow on navigation

  function openSidebar() {
    setIsSidebarOpen(true);
    setActiveTab("plans");
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <>
      {/* Initial state */}
      {!isSidebarOpen && (
        <div className="sidebar-launcher">
          <button className="sidebar-launch-btn" onClick={openSidebar}>
            layout plans
          </button>
        </div>
      )}

      {/* Sidebar with tabs and close button */}
      {isSidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <button
              className={`sidebar-tab-btn ${activeTab === "plans" ? "active" : ""}`}
              onClick={() => setActiveTab("plans")}
            >
              suggested plans
            </button>
            <button
              className={`sidebar-tab-btn ${activeTab === "furniture" ? "active" : ""}`}
              onClick={() => setActiveTab("furniture")}
            >
              furniture options
            </button>
            <button className="sidebar-close-btn" onClick={closeSidebar}>
              ×
            </button>
          </div>

          <div className="sidebar-content">
             {activeTab === "plans" && (
                <div className="plans-list">
                  {packages.map((plan, index) => (
                    <div key={index} className="plan-card">
                      {/* Plan name/title */}

                      <div className="plan-option">
                        Suggestion {plan.name}
                      </div>

                      {/* Items details (each line: image, name, price) */}
                      <div className="plan-items-details">
                        {plan.items.map((item, index) => {
                          const furniture = furnitureCatalog.find(f => f.name === item.name);
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
                              <span className="furniture-price">£{item.price}</span>
                            </div>
                          );
                        })}
                      </div>
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







// import { Vector3 } from "@babylonjs/core";
// import { useState } from "react";
// import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";
// import "./styling/SideBar.css";


// const Sidebar = ({ addFurniture, packages }) => {
//   const [isVisible, setIsVisible] = useState();
//   const [activeTab, setActiveTab] = useState("furniture");
//   const toggleSidebar = () => setIsVisible(!isVisible);

//   console.log(packages);


//   return (
//     <>
//       <button className="nav-button" onClick={toggleSidebar}>
//         All furniture:
//       </button>

//       <section className={"sidebar " + (isVisible ? "visible" : "hidden")}>
//         <div className="sidebar-header-card">
//           <div className="tabs-toggle">
//             <button
//               className={`toggle-btn ${
//                 activeTab === "furniture" ? "active" : ""
//               }`}
//               onClick={() => setActiveTab("furniture")}
//             >
//               Furniture options
//             </button>
//             <button
//               className={`toggle-btn ${activeTab === "plans" ? "active" : ""}`}
//               onClick={() => setActiveTab("plans")}
//             >
//               Magic Box Plans::
//             </button>
//           </div>

//           <button className="close-btn" onClick={toggleSidebar}>
//             X
//           </button>
//         </div>


//         {/* furniture tab*/}
//         {activeTab === "furniture" && (
//           <div className="furniture-list">
//             {furnitureCatalog.map((item) => (
//               <section key={item.id} className="furniture-item">
//                 <img
//                   className="furniture-img"
//                   src={item.imgUrl}
//                   alt={item.name}
//                 />
//                 <span className="furniture-name">{item.name}</span>
//                 <span className="furniture-price">£{item.price}</span>
//                 <span className="furniture-dimensions">
//                   {item.dimensions.length} x {item.dimensions.width}
//                 </span>
//                 <button
//                   className="add-btn"
//                   onClick={() => {
//                     const furnitureToAdd = {
//                       id: item.id,
//                       model: item.modelRef,
//                       position: new Vector3(0, 0, 0),
//                       rotation: 90,
//                     };
//                     addFurniture(furnitureToAdd);
//                   }}
//                 >
//                   Add
//                 </button>
//               </section>
//             ))}
//           </div>
//         )}

//         {/* plans tab*/}
//         {activeTab === "plans" && (
//           <div className="plans-list">
//             {packages.map((plan, index) => (
//               <div key={index} className="plan-card">
//                 <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
//                   {plan.name}
//                 </div>
//                 {plan.items.map((item, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       fontSize: "15px",
//                       margin: "4px 0",
//                       paddingLeft: "6px",
//                     }}
//                   >
//                     {item.name} – £{item.price}
//                     <span>
//                       ({item.dimensions.length} x {item.dimensions.width})
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}


//       </section>
//     </>
//   );
// };

// export default Sidebar;
