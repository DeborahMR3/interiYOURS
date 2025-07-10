import { useState } from "react";
import Main3dCanvas from "./Main3dCanvas";
import Sidebar from "./Sidebar";
import "./styling/layout-view.css";

const LayoutView = () => {
  return (
    <div className="layout-view">
      <Sidebar />
      <Main3dCanvas />
    </div>
  );
};

export default LayoutView;
