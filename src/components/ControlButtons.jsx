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

import AvatarDropdown from "./AvatarDropdown";

export const ControlButtons = ({
  isRotating,
  setIsRotating,
  handleSavedPositions,
}) => {
  const toggleRotating = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="control-buttons-container">
      <AvatarDropdown className="avatar-button" align="end" />
      <button className="control-button" onClick={handleSavedPositions}>
        <FaRegSave />
      </button>
      <button className="control-button">
        <IoHomeOutline />
      </button>
      <button className="control-button">
        <IoShareSocialOutline />
      </button>
      <button className="control-button">
        <FaUndo />
      </button>
      <button className="control-button">
        <FaRegTrashAlt />
      </button>
      <button className="control-button" onClick={toggleRotating}>
        {isRotating ? <FaArrowsSpin /> : <FaArrowsAlt />}
      </button>
    </div>
  );
};
