import { useState } from "react";
import { FaCouch, FaBed, FaBook } from "react-icons/fa";
import "./components/styling/RoomForm.css";

function RoomForm({ onSubmit }) {
  const [roomName, setRoomName] = useState("");
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomBudget, setRoomBudget] = useState("");
  const [roomType, setRoomType] = useState([]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox") {
      if (checked && !roomType.includes(value)) {
        setRoomType((prev) => [...prev, value]);
      } else {
        setRoomType((prev) => prev.filter((type) => type !== value));
      }
    } else {
      if (name === "roomName") setRoomName(value);
      if (name === "roomLength") setRoomLength(value);
      if (name === "roomWidth") setRoomWidth(value);
      if (name === "roomBudget") setRoomBudget(value);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const roomData = {
      roomName,
      roomLength: parseFloat(roomLength),
      roomWidth: parseFloat(roomWidth),
      roomBudget: parseFloat(roomBudget),
      roomType,
    };

    if (onSubmit) {
      onSubmit(roomData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-with-unit">
        <label>Name:</label>
        <input
          type="text"
          name="roomName"
          value={roomName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="input-with-unit">
        <label>Length:</label>
        <input
          type="number"
          name="roomLength"
          value={roomLength}
          onChange={handleChange}
          required
        />
        <span className="unit">cm</span>
      </div>
      <div className="input-with-unit">
        <label>Width:</label>
        <input
          type="number"
          name="roomWidth"
          value={roomWidth}
          onChange={handleChange}
          required
        />
        <span className="unit">cm</span>
      </div>
      <div className="input-with-unit">
        <label>Budget:</label>
        <input
          type="number"
          name="roomBudget"
          value={roomBudget}
          onChange={handleChange}
        />
        <span className="unit">£</span>
      </div>

      <div>
        <p>
          Choose your lifestyle needs below! <br />I need somewhere to...
        </p>
        <label>Room Options:</label>
        <div>
          <label>
            <input
              type="checkbox"
              name="roomType"
              value="Sleep"
              checked={roomType.includes("Sleep")}
              onChange={handleChange}
            />
            Sleep <FaBed />
          </label>
          <label>
            <input
              type="checkbox"
              name="roomType"
              value="Relax"
              checked={roomType.includes("Relax")}
              onChange={handleChange}
            />
            Relax <FaCouch />
          </label>
          <label>
            <input
              type="checkbox"
              name="roomType"
              value="Study"
              checked={roomType.includes("Study")}
              onChange={handleChange}
            />
            Study <FaBook />
          </label>
        </div>
      </div>
      <div>
        <button type="submit">Submit Room</button>
      </div>
    </form>
  );
}

export default RoomForm;
