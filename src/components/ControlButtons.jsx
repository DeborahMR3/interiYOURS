import { FaRegSave } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
//import { BsArrowsMove } from "react-icons/bs";
import { FaArrowsAlt } from "react-icons/fa";
import { FaArrowsSpin } from "react-icons/fa6";
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
