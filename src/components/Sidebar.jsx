import { Vector3 } from "@babylonjs/core";
import { useState } from "react";
import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";
import "./styling/SideBar.css";

// // Só para demo
// const mockPlans = [
//   {
//     name: "Plan A",
//     items: [
//       { name: "Bed", price: 200, dimensions: { length: 200, width: 160 } },
//       { name: "Chair", price: 70, dimensions: { length: 64, width: 64 } },
//     ],
//   },
// ];

const Sidebar = ({ addFurniture, user}) => {
  const [isVisible, setIsVisible] = useState();
  const [activeTab, setActiveTab] = useState("furniture");
  const toggleSidebar = () => setIsVisible(!isVisible);

  return (
    <>
      <button className="nav-button" onClick={toggleSidebar}>
        All furniture:
      </button>

      <section className={"sidebar " + (isVisible ? "visible" : "hidden")}>
        <div className="sidebar-header-card">
          <div className="tabs-toggle">
            <button
              className={`toggle-btn ${activeTab === "furniture" ? "active" : ""}`}
              onClick={() => setActiveTab("furniture")}
            >
              Furniture options
            </button>
            <button
              className={`toggle-btn ${activeTab === "plans" ? "active" : ""}`}
              onClick={() => setActiveTab("plans")}
            >
              Magic Box Plans:
            </button>
          </div>
          <button className="close-btn" onClick={toggleSidebar}>X</button>
        </div>

        {/* Tab de móveis */}
        {activeTab === "furniture" && (
          <div className="furniture-list">
            {furnitureCatalog.map((item) => (
              <section key={item.id} className="furniture-item">
                <img className="furniture-img" src={item.imgUrl} alt={item.name} />
                <span className="furniture-name">{item.name}</span>
                <span className="furniture-price">£{item.price}</span>
                <span className="furniture-dimensions">
                  {item.dimensions.length} x {item.dimensions.width}
                </span>
                <button className="add-btn" onClick={() => {
                  const furnitureToAdd = {
                    id: item.id,
                    model: item.modelRef,
                    position: new Vector3(0, 0, 0),
                    rotation: 90,
                  };
                  addFurniture(furnitureToAdd);
                }}>Add</button>
              </section>
            ))}
          </div>
        )}

        {/* Tab plans */}
        {activeTab === "plans" && (
          <div className="plans-list">
            {mockPlans.map((plan, index) => (
              <div key={index} className="plan-card">
                <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
                  {plan.name}
                </div>
                {plan.items.map((item, index) => (
                  <div key={index} style={{ fontSize: "15px", margin: "4px 0", paddingLeft: "6px" }}>
                    {item.name} – £{item.price}
                    <span >
                      ({item.dimensions.length} x {item.dimensions.width})
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Sidebar;

// import { Vector3 } from "@babylonjs/core";
// import { useState } from "react";

// import { furnitureCatalog } from "./magic-box/data/furnitureCatalog";
// import "./styling/SideBar.css";

// const Sidebar = ({ addFurniture }) => {
//   const [isVisible, setIsVisible] = useState();
//   const toggleSidebar = () => {
//     setIsVisible(!isVisible);
//   };

//   const testItem = {
//     id: "testid",
//     model: "sofa-stockholm-brown.glb",
//     position: new Vector3(-2, 0, -2),
//     rotation: 0,
//   };
//   const addTestItem = () => {
//     addFurniture(testItem);
//   };

//   return (
//     <>
//       <button className="nav-button" onClick={toggleSidebar}>
//         All furnitures:
//       </button>

//       <section className={"sidebar " + (isVisible ? "visible" : "hidden")}>
//       <div className="sidebar-header-card">
//         <span className="sidebar-title">Furniture options</span>
//         <button className="close-btn" onClick={toggleSidebar}>X</button>
//       </div>

//         <div className="furniture-list">
//           {furnitureCatalog.map((item) => (
//             <section key={item.id} className="furniture-item">
//                {/* item IMG */}
//                <img className="furniture-img" src={item.imgUrl} alt={item.name} />
//                {/* name*/}
//                <span className="furniture-name">{item.name}</span>
//                {/* price */}
//               <span className="furniture-price">£{item.price}</span>
//               {/* dimensions */}
//                <span className="furniture-dimensions"> {item.dimensions.length} x {item.dimensions.width} </span>

//                {/* Button to add furniture*/}
//               <button className="add-btn" onClick={() => {
//                   const furnitureToAdd = {
//                     id: item.id,
//                     model: item.modelRef, // fix to model instead of modelREf
//                     position: new Vector3(0, 0, 0),
//                     rotation: 90,
//                   };
//                   addFurniture(furnitureToAdd);
//                 }}
//               >Add</button>
//             </section>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// };

// export default Sidebar;
