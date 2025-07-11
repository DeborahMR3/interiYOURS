import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import avatarImg from "./components/images/user-avatar-photo.webp";
import AvatarDropdown from "./components/AvatarDropdown";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { deleteDoc } from "firebase/firestore";
import { auth } from "./firebase/firebaseAuth";
import "./HomePage.css";

const HomePage = () => {
  const location = useLocation();
  const { message } = location.state || {};
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const rooms = [
    { id: 1, name: "Room 1" },
    { id: 2, name: "Room 2" },
    { id: 3, name: "Room 3" },
  ];

  return (
    <section className="home-page">
      <div className="main-card">
        <div className="header-section">
          <div>
            <h1>HOME PAGE!</h1>
            {message && <p>{message}</p>}
            {loading && <p>Loading, please wait...</p>}
            {error && <p>{error}</p>}
          </div>
          <AvatarDropdown
            user={user}
            onSignOut={handleSignOut}
            onDelete={handleDeleteAccount}
          />
        </div>
        <div className="cards-container">
          {rooms.map((room) => (
            <button key={room.id} className="room-button secondary">
              {room.name}
            </button>
          ))}
          <button onClick={() => navigate("/create-room")} className="room-button primary">Create a new room</button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
