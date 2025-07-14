import { useEffect, useState } from "react";
import Main3dCanvas from "./components/Main3dCanvas";
import Sidebar from "./components/Sidebar";
import "./components/styling/RoomPage.css";
import { useParams } from "react-router-dom";
import { getRoomById } from "./firebase/firebaseStore";

const RoomPage = () => {
  const [currentLayout, setCurrentLayout] = useState([]);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { roomId } = useParams();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        const room = await getRoomById(roomId);
        console.log(room);
        setRoomData(room);
      } catch (error) {
        setError("Failed to load room");
        setRoomData(null);
      } finally {
        setLoading(false);
      }
    };
    if (roomId) {
      fetchRoom();
    }
  }, [roomId]);

  const addFurniture = (newItem) => {
    setIsItemAdded(true);
    setCurrentLayout([...currentLayout, newItem]);
  };

  const updateFurniturePosition = (updatedItem) => {
    setCurrentLayout((prev) => {
      const oldLayout = [...prev];
      const filterLayout = oldLayout.filter(({ id }) => id !== updatedItem.id);
      let newLayout = [...filterLayout, updatedItem];
      //console.log(newLayout);
      return [...newLayout];
    });
  };

  return (
    <div className="layout-view">
      <Sidebar addFurniture={addFurniture} />
      <Main3dCanvas
        currentLayout={currentLayout}
        updateFurniturePosition={updateFurniturePosition}
        isItemAdded={isItemAdded}
        setIsItemAdded={setIsItemAdded}
      />
    </div>
  );
};

export default RoomPage;
