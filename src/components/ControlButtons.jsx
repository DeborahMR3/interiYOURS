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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
  canEdit,
}) => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccessMessage, setCopySuccessMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleShareRoom = async () => {
    try {
      const shareUrl = `${window.location.origin}/room/${roomId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccessMessage("Room URL copied!");
      setTimeout(() => setCopySuccessMessage(""), 3000);
    } catch (error) {
      setCopySuccessMessage(
        "Failed to copy URL. Please copy manually from the URL tab"
      );
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
        disabled={!canEdit}
      />
      <button
        className="control-button"
        onClick={handleSavedPositions}
        disabled={!canEdit}
      >
        <FaRegSave />
      </button>
      <button className="control-button" onClick={handleGoHome}>
        <IoHomeOutline />
      </button>
      <button className="control-button" onClick={handleShareRoom}>
        <IoShareSocialOutline />
      </button>
      {copySuccessMessage && <div>{copySuccessMessage}</div>}
      <button className="control-button" disabled={!canEdit}>
        <FaUndo />
      </button>
      <button className="control-button" disabled={!canEdit}>
        <FaRegTrashAlt />
      </button>
      <button
        className="control-button"
        onClick={toggleRotating}
        disabled={!canEdit}
      >
        {isRotating ? <FaArrowsSpin /> : <FaArrowsAlt />}
      </button>
    </div>
  );
};
