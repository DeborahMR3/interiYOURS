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
        sidebar
      </div>
    </>
  );
};

export default Sidebar;
