import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import RoomForm from "./RoomForm"
import { addRoomToFireStore } from "./firebase/firebaseStore"
import { auth } from "./firebase/firebaseAuth"

const RoomPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

const handleRoomSubmit = async (roomData) => {
    setLoading(true)
    setError(null)
    console.log(roomData)
    try {
        const user = auth.currentUser
        
      const roomId = await addRoomToFireStore(user.uid, roomData)
      console.log("Room added with ID", roomId)
      navigate(`/room/${roomId}`)
    } catch (error) {
      setError("Failed to submit room, please try again")
    } finally {
      setLoading(false)
    }
  }
  return (
        <section>
            <h2>Create a New Room</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <RoomForm onSubmit={handleRoomSubmit} />
        </section>
    )
}
  export default RoomPage