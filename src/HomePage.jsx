import "./HomePage.css";
import { useLocation } from "react-router-dom";
import avatarImg from "./components/images/user-avatar-photo.webp";


const HomePage = () => {
  const location = useLocation();
  // const { message } = location.state;  error: Cannot destructure property 'message' of 'location.state' as it is null

  const message = location.state?.message;

  const rooms = [
  { id: 1, name: "Test Room 1" },
  { id: 2, name: "Test Room 2" },
  { id: 3, name: "Test Room 3" }
];

  return (
    <section className="home-page">
      <button className="avatar-button" aria-label="user menu">
        <img src={avatarImg} className="avatar-img" />
      </button>
      <section className="greeting-message">
        <h1>HOME PAGE!</h1>
      </section>
      {message && <p>{message}</p>}
      <div className="cards-container">
        {rooms.map((room =>
          <button className="room-button">{room.name}</button>
      ))}
           <button className="room-button">Create a new room</button>
      </div>

    </section>
  );

};

export default HomePage;
