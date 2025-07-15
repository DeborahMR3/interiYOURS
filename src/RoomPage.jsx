import { useEffect, useState } from "react";
import Main3dCanvas from "./components/Main3dCanvas";
import Sidebar from "./components/Sidebar";
import "./components/styling/RoomPage.css";
import { useParams } from "react-router-dom";
import { getRoomById, patchRoomLayout } from "./firebase/firebaseStore";
import { ControlButtons } from "./components/ControlButtons";

const RoomPage = () => {
  const [currentLayout, setCurrentLayout] = useState([]);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
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
        setRoomData(room);

        if (room.layout) {
          console.log(room.layout);
          setCurrentLayout(room.layout);
        }
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
    console.log("Position received:", updatedItem.position);
    const { x, y, z } = updatedItem.position;
    setCurrentLayout((prev) => {
      const oldLayout = [...prev];
      const filterLayout = oldLayout.filter(({ id }) => id !== updatedItem.id);
      let newLayout = [...filterLayout, updatedItem];
      //console.log(newLayout);
      return [
        ...filterLayout,
        {
          ...updatedItem,
          position: { x, y, z },
        },
      ];
    });
  };

  const handleSavedPositions = async () => {
    if (!roomId) return;

    try {
      console.log("current layout >>>", currentLayout);
      await patchRoomLayout(roomId, currentLayout);
      console.log("Positions saved");
    } catch (error) {
      console.error("Failed to save position", error);
    }
  };

  //Appropriate loading logic would be good here
  return (
    <div className="layout-view">
      {roomData ? (
        <Sidebar addFurniture={addFurniture} packages={roomData.packages} />
      ) : (
        <p>Loading...</p>
      )}
      <Main3dCanvas
        roomData={roomData}
        currentLayout={currentLayout}
        updateFurniturePosition={updateFurniturePosition}
        isItemAdded={isItemAdded}
        setIsItemAdded={setIsItemAdded}
      />
      <ControlButtons isRotating={isRotating} setIsRotating={setIsRotating} />
    </div>
  );
};

export default RoomPage;
