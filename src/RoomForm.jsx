import { useState } from "react";

function RoomForm({onSubmit}) {
    const [roomName, setRoomName] = useState("")
    const [roomLength, setRoomLength] = useState("")
    const [roomWidth, setRoomWidth] = useState("")
    const [roomBudget, setRoomBudget] = useState("")
    const [roomType, setRoomType] = useState([])

function handleChange(event) {
    const { name, value, type, checked} = event.target

    if(type === "checkbox") {
    if (checked && !roomType.includes(value)) {
        setRoomType((prev) => [...prev, value])
    } else {
        setRoomType((prev) => prev.filter((type) => type !== value))
    }
} else {
        if (name === "roomName") setRoomName(value)
        if (name === "roomLength") setRoomLength(value)
        if (name === "roomWidth") setRoomWidth(value)
        if (name === "roomBudget") setRoomBudget(value)              
    }
}

  const handleSubmit = async (event) => {
    event.preventDefault()

    const roomData = {
        roomName,
        roomLength: parseFloat(roomLength),
        roomWidth: parseFloat(roomWidth),
        roomBudget: parseFloat(roomBudget),
        roomType

    }

    if (onSubmit) {
        onSubmit(roomData)
    }
  }

return (
    <form onSubmit={handleSubmit}>
        <div>
            <label>Room name:</label>
            <input type="text" name="roomName" value={roomName} onChange={handleChange} required />
        </div>
        <div>
            <label>Length:</label>
            <input type="number" name="roomLength" value={roomLength} onChange={handleChange} required/>
        </div>
        <div>
            <label>Width:</label>
            <input type="number" name="roomWidth" value={roomWidth} onChange={handleChange} required />
        </div>
        <div>
            <label>Budget:</label>
            <input type="number" name="roomBudget" value={roomBudget} onChange={handleChange}  />
        </div>  


        <div>
            <label>Room Type:</label>
            <div>
                <label>
                    <input type="checkbox" name="roomType" value="Sleep" checked={roomType.includes("Sleep")} onChange={handleChange} />
                    Sleep
                </label>
                <label>
                    <input type="checkbox" name="roomType" value="Relax" checked={roomType.includes("Relax")} onChange={handleChange} />
                    Relax
                </label>
                <label>
                    <input type="checkbox" name="roomType" value="Study" checked={roomType.includes("Study")} onChange={handleChange} />
                    Study
                </label>
            </div>
            </div>   
            <div>
                <button type="submit">Submit Room</button>
            </div>
    </form>
)

}

export default RoomForm