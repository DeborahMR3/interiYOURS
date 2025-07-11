import Dropdown from "react-bootstrap/Dropdown";
import avatarImg from "./images/user-avatar-photo.webp"; 

function AvatarDropdown({ user, onSignOut, onDelete }) {
  return (
    <Dropdown className='avatar-button' align="end">
      <Dropdown.Toggle variant="link" className="avatar-button p-0">
        <img src={avatarImg} className="avatar-img" alt="User avatar" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.ItemText>{user?.isAnonymous ? "Guest" : user?.email}</Dropdown.ItemText>
        <Dropdown.Item onClick={onSignOut}>Log out</Dropdown.Item>
        <Dropdown.Item onClick={onDelete}>Delete account</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default AvatarDropdown;
