import { useEffect, useState } from "react";
import Main3dCanvas from "./components/Main3dCanvas";
import Sidebar from "./components/Sidebar";
import "./components/styling/RoomPage.css";
import { useParams } from "react-router-dom";
import { getRoomById } from "./firebase/firebaseStore";

const RoomPage = () => {
  const [currentLayout, setCurrentLayout] = useState([]);
  const [roomData, setRoomData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { roomId } = useParams();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
      setLoading(true)
      setError(null)
        const room = await getRoomById(roomId)
        console.log(room)
        setRoomData(room)
      } catch (error) {
        setError("Failed to load room")
        setRoomData(null)
      } finally {
        setLoading(false)
      }
      }
      if (roomId) {
        fetchRoom()
    }
  }, [roomId])
  
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
