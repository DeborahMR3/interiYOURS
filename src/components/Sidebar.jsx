import { useState } from "react";

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState();
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button className="nav-button" onClick={toggleSidebar}>
        Nav
      </button>
      <div className={"sidebar " + (isVisible ? "visible" : "hidden")}>
        <h2>Nav Bar</h2>
        <button>Test1</button>
      </div>
    </>
  );
};

export default Sidebar;
