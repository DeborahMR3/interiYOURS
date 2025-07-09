import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import avatarImg from "./components/images/user-avatar-photo.webp";

import AvatarDropdown from "./components/AvatarDropdown";

const HomePage = () => {
  const location = useLocation();
  const { message } = location.state || {};
  const navigate = useNavigate();

  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("Signed out");
      navigate("/");
    } catch (error) {
      setError("failed to sign out, Please try again");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      console.log("Account has been deleted");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError("Failed to delete account. Please try again");
    }
  };

  return (
    <>
      {message && <p>{message}</p>}

      {user && !user.isAnonymous && <p>User email: {user?.email}</p>}

      <button onClick={handleSignOut} disabled={loading}>
        Sign out
      </button>

      <button onClick={handleDeleteAccount} disabled={loading}>
        Delete Account
      </button>
      {loading && <p>Loading, please wait ...</p>}
      {error && <p>{error}</p>}
    </>
  );
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
