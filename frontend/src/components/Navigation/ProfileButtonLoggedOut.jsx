import { useEffect, useState, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosMenu } from "react-icons/io";
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButtonLoggedOut() {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();// Keep click from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
        if (ulRef.current && !ulRef.current.contains(e.target)) {
            setShowMenu(false);
        }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu])

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} id='menu-button'>
        <IoIosMenu />
        <FaUserCircle id='profile-logo'/>
      </button>
      <div className={ulClassName} ref={ulRef}>
        <li className='profile-menu-item'>
            <OpenModalButton
              buttonText="Sign Up"
              buttonClassName='profile-button-log'
              modalComponent={<SignupFormModal />}
            />
        </li>
        <li className='profile-menu-item'>
            <OpenModalButton
              buttonText="Log In"
              buttonClassName='profile-button-log'
              modalComponent={<LoginFormModal />}
            />
        </li>
      </div>
    </>
  );
}

export default ProfileButtonLoggedOut;