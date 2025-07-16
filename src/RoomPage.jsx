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
  const [isDeleting, setIsDeleting] = useState(false);
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

  // x y z of magic output is in cm, perhaps introduce a utility fn that considers handling zero position
  // possible roatation + 180?
  useEffect(() => {
    if (roomData === null) return;
    if (roomData.layout.length !== 0) return;
    const halfW = roomData.roomWidth * 0.5;
    const halfL = roomData.roomLength * 0.5;
    if (
      roomData.packages[0].name === "A" &&
      roomData.packages[0].placements.length !== 0
    ) {
      roomData.packages[0].placements.forEach((item) => {
        console.log(`rendering ${item.modelRef} form package A`);
        let newItem = {
          id: item.id,
          model: item.modelRef,
          position: {
            x: (item.x - halfW) / 100,
            z: (item.y - halfL) / 100,
            y: 0,
          },
          rotation: item.rotation,
        };
        console.log("newItem >>>", newItem);
        addFurniture(newItem);
      });
    } else if (
      roomData.packages[1].name === "B" &&
      roomData.packages[1].placements.length !== 0
    ) {
      roomData.packages[1].placements.forEach((item) => {
        console.log(`rendering ${item.modelRef} form package B`);
        let newItem = {
          id: item.id,
          model: item.modelRef,
          position: {
            x: (item.x - halfW) / 100,
            z: (item.y - halfL) / 100,
            y: 0,
          },
          rotation: item.rotation,
        };
        addFurniture(newItem);
      });
    } else if (
      roomData.packages[2].name === "C" &&
      roomData.packages[2].placements.length !== 0
    ) {
      roomData.packages[2].placements.forEach((item) => {
        console.log(`rendering ${item.modelRef} form package C`);
        let newItem = {
          id: item.id,
          model: item.modelRef,
          position: {
            x: (item.x - halfW) / 100,
            z: (item.y - halfL) / 100,
            y: 0,
          },
          rotation: item.rotation,
        };
        addFurniture(newItem);
      });
    } else {
      console.warn(
        "Couldn't place package items!, you can still add them yourself if you like"
      );
    }
  }, [roomData]);

  const addFurniture = (newItem) => {
    setIsItemAdded(true);
    setCurrentLayout((prev) => [...prev, newItem]);

    console.log("addFurniture called >>>", newItem);
  };

  const deleteItem = (deletedItem) => {
    setCurrentLayout((prev) => {
      console.log(deletedItem);
      const filteredLayout = prev.filter((item) => item.id !== deletedItem.id);
      console.log(filteredLayout);
      return filteredLayout;
    });
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
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        deleteItem={deleteItem}
      />
      <ControlButtons
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        handleSavedPositions={handleSavedPositions}
        setIsDeleting={setIsDeleting}
      />
    </div>
  );
};

export default RoomPage;
