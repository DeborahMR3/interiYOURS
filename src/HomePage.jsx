import "./HomePage.css";
import { useLocation } from "react-router-dom";
import avatarImg from "./components/images/user-avatar-photo.webp";

import AvatarDropdown from "./components/AvatarDropdown";

const HomePage = () => {
  const location = useLocation();
  // const { message } = location.state;  error: Cannot destructure property 'message' of 'location.state' as it is null

  const message = location.state?.message;

  const rooms = [
    { id: 1, name: "Room 1" },
    { id: 2, name: "Room 2" },
    { id: 3, name: "Room 3" },
  ];

  return (
    <section className="home-page">
      <div className="main-card">
        {/* header - greeting message + avatar dropdown */}
        <div className="header-section">
          <div>
            <h1>HOME PAGE!</h1>
            {message && <p>{message}</p>}
          </div>
          <AvatarDropdown />
        </div>

        {/* list of room buttons  */}
        <div className="cards-container">
          {rooms.map((room) => (
            <button key={room.id} className="room-button secondary">
              {room.name}
            </button>
          ))}
          <button className="room-button primary">Create a new room</button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
