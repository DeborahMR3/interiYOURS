import { useState } from "react";
import Main3dCanvas from "./components/Main3dCanvas";
import Sidebar from "./components/Sidebar";
import "./components/styling/RoomPage.css";
import { useParams } from "react-router-dom";

const RoomPage = () => {
  const [currentLayout, setCurrentLayout] = useState([]);

  const { roomId } = useParams();

  const addFurniture = (newItem) => {
    setCurrentLayout([...currentLayout, newItem]);
  };
  console.log(currentLayout);

  return (
    <div className="layout-view">
      <Sidebar addFurniture={addFurniture} />
      <Main3dCanvas
        currentLayout={currentLayout}
        setCurrentLayout={setCurrentLayout}
      />
    </div>
  );
};

export default RoomPage;
