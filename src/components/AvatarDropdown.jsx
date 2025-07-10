import Dropdown from 'react-bootstrap/Dropdown';
import avatarImg from './images/user-avatar-photo.webp'; // caminho igual ao que já usa


function AvatarDropdown() {
  return (
    <Dropdown className='avatar-button' align="end">
      <Dropdown.Toggle variant="link" className="avatar-button p-0">
        <img src={avatarImg} className="avatar-img" alt="User avatar" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Your profile</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Log out</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Delete account</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default AvatarDropdown;
