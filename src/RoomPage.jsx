import { useState } from "react";
import Main3dCanvas from "./components/Main3dCanvas";
import Sidebar from "./components/Sidebar";
import "./components/styling/RoomPage.css";
import { useParams } from "react-router-dom";

const RoomPage = () => {
  const [currentLayout, setCurrentLayout] = useState([]);

  const { roomId } = useParams();

  const addFurniture = (newItem) => {
    console.log("addFurniture called");
    console.log(currentLayout);
    setCurrentLayout([...currentLayout, newItem]);
  };

  return (
    <div className="layout-view">
      <Sidebar addFurniture={addFurniture} />
      <Main3dCanvas currentLayout={currentLayout} />
    </div>
  );
};

export default RoomPage;
