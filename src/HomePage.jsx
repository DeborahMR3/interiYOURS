import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import avatarImg from "./components/images/user-avatar-photo.webp";
import AvatarDropdown from "./components/AvatarDropdown";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { auth } from "./firebase/firebaseAuth";
// import "./HomePage.css";
import "./components/styling/HomePage.css";
import {
  getUserData,
  getRoomsData,
  deleteRoomById,
  db,
} from "./firebase/firebaseStore";
import { FaTrash } from "react-icons/fa";

const HomePage = () => {
  const location = useLocation();
  const { message } = location.state || {};
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch(() => {
          setUserData(null);
        });

      getRoomsData(user.uid)
        .then((data) => {
          setRooms(data);
        })
        .catch(() => {
          setRooms([]);
        });
    } else {
      setUserData(null);
      setRooms([]);
    }
  }, [user]);

  const handleRoomSelect = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      setError("failed to sign out, Please try again");
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    setLoading(true);
    setError(null);
    try {
      const userRooms = await getRoomsData(user.uid);
      await Promise.all(userRooms.map((room) => deleteRoomById(room.id)));
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError("Failed to delete account. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    console.log(roomId);
    setLoading(true);
    setError(null);

    try {
      await deleteRoomById(roomId);
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (error) {
      setError("Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="home-page">
      {/* <h1>
        <span class="logo-text1">interi</span>
        <span class="logo-text2">yours</span>
      </h1> */}
      <div className="main-card">
        <div className="header-section">
          <div>
            <h1 className="home-message">Home</h1>
            {message && <p>{message}</p>}
            {!message && <p>Welcome back!</p>}
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
            <div key={room.id}>
              <button
                className="room-button secondary"
                onClick={() => handleRoomSelect(room.id)}
              >
                {room.roomName}
                <FaTrash
                  className="delete-icon"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteRoom(room.id);
                  }}
                  aria-label="Delete room"
                />
              </button>
            </div>
          ))}
          <button
            onClick={() => navigate("/create-room")}
            className="room-button primary"
          >
            Create a new room
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
