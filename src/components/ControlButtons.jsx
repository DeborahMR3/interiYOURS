import { FaRegSave } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { IoShareSocialOutline } from "react-icons/io5";
//import { BsArrowsMove } from "react-icons/bs";
import { FaArrowsAlt } from "react-icons/fa";
import { FaArrowsSpin } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import "./styling/ControlButtons.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { auth } from "../firebase/firebaseAuth";
import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
import { db, getRoomsData, deleteRoomById } from "../firebase/firebaseStore";
import { FaSpinner } from "react-icons/fa";

import AvatarDropdown from "./AvatarDropdown";

export const ControlButtons = ({
  isRotating,
  setIsRotating,
  handleSavedPositions,
  setIsDeleting,
}) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleRotating = () => {
    setIsRotating(!isRotating);
  };

  const handleGoHome = () => {
    navigate("/home");
  };

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
      console.log("Account has been deleted");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setError("Failed to delete account. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="control-buttons-container">
      <AvatarDropdown
        user={user}
        onSignOut={handleSignOut}
        onDelete={handleDeleteAccount}
        className="avatar-button"
        align="end"
      />
      <button className="control-button" onClick={handleSavedPositions}>
        <FaRegSave />
      </button>
      <button className="control-button" onClick={handleGoHome}>
        <IoHomeOutline />
      </button>
      <button className="control-button">
        <IoShareSocialOutline />
      </button>
      <button className="control-button">
        <FaUndo />
      </button>
      <button
        className="control-button"
        onClick={() => {
          setIsDeleting(true);
        }}
      >
        <FaRegTrashAlt />
      </button>
      <button className="control-button" onClick={toggleRotating}>
        {isRotating ? <FaArrowsSpin /> : <FaArrowsAlt />}
      </button>
    </div>
  );
};
