import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import logo from "../assets/Logo-Vive.png";
import axios from 'axios';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [permissions, setPermissions] = useState({
    customer: { editor: false, viewer: false },
    partners: { editor: false, viewer: false },
    transports: { editor: false, viewer: false },
    boq: { editor: false, viewer: false },
    lead: { editor: false, viewer: false },
  });
  const [role, setRole] = useState('user');
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    // Fetch user data from local storage or API
    const userDataFromStorage = {
      name: localStorage.getItem('name') || "Admin",
      phone: localStorage.getItem('phone') || "6202105424",
      email: localStorage.getItem('email') || "admin@gmail.com",
      department: localStorage.getItem('department') || "Product Designer",
      designation: localStorage.getItem('designation') || "Senior",
    };
    setUserData(userDataFromStorage);

    // Set role from local storage
    const userRole = localStorage.getItem('role') || 'user';
    setRole(userRole);

    // Fetch permissions from API if the role is not admin
    if (userRole !== 'admin') {
      fetchPermissions(userDataFromStorage.email);
    }
  }, []);

  const fetchPermissions = async (email) => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in local storage
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/permissions/${email}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPermissions(response.data.permissions);
    } catch (error) {
      console.error('Error fetching permissions', error);
    }
  };

  const onProfileClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openAccessModal = () => {
    setIsAccessModalOpen(true);
  };

  const openProfileModal = () => {
    setIsAccessModalOpen(false);
  };

  const closeAccessModal = () => {
    setIsAccessModalOpen(false);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const [category, type] = name.split('-');
    setPermissions({
      ...permissions,
      [category]: {
        ...permissions[category],
        [type]: checked,
      },
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Save the updated user data to local storage or send it to an API
    Object.keys(userData).forEach(key => {
      localStorage.setItem(key, userData[key]);
    });
    setIsModalOpen(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <img src={logo} className={styles.logoImg} alt="Logo" />
        </div>
        <div className={`${styles.headerContainer} ${styles.headerContainerData}`}>
          <div className={styles.profile} onClick={onProfileClick}>
            <FontAwesomeIcon icon={faUser} className={styles.profileIcon} />
          </div>
          <div className={styles.profileName}><b>Logged In as</b> {userData.email}</div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Edit Profile Modal"
            className={styles.modal}
            overlayClassName={styles.overlay}
          >
            <div className={styles.modalContent}>
              <div className={styles.modalContentHeader}>
                <h2>Edit Profile</h2>
                <div className={styles.modalContentHeaderInfo}>
                  <div className={styles.modalContentHeaderInfoBtn}>
                    Your Info
                  </div>
                  {role !== 'admin' && (
                    <div className={styles.modalContentHeaderInfoBtn} onClick={openAccessModal}>
                      Access
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.userImage}>
                <img className={styles.userProfile} src="people.png" alt="User" />
              </div>
              <form className={styles.form} onSubmit={handleFormSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} />
                <label htmlFor="phone">Phone no.</label>
                <input type="tel" id="phone" name="phone" value={userData.phone} onChange={handleInputChange} />
                <label htmlFor="email">Email Id.</label>
                <input type="email" id="email" name="email" value={userData.email} onChange={handleInputChange} />
                <label htmlFor="department">Department</label>
                <select id="department" name="department" value={userData.department} onChange={handleInputChange}>
                  <option value="Product Designer">Product Designer</option>
                  <option value="Development">Development</option>
                </select>
                <label htmlFor="designation">Designation</label>
                <select id="designation" name="designation" value={userData.designation} onChange={handleInputChange}>
                  <option value="Product Designer">Product Designer</option>
                  <option value="Developer">Developer</option>
                </select>
                <div className={styles.modalContentBottom}>
                  <button type="submit" className={styles.saveButton}>Save</button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
      {role !== 'admin' && (
        <Modal
          isOpen={isAccessModalOpen}
          onRequestClose={closeAccessModal}
          contentLabel="Access Modal"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <div className={styles.accessModalContent}>
            <div className={styles.modalContentHeader}>
              <h2>Edit Access</h2>
              <div className={styles.modalContentHeaderInfo}>
                <div className={styles.modalContentHeaderInfoBtn} onClick={openProfileModal}>
                  Your Info
                </div>
                <div className={styles.modalContentHeaderInfoBtn}>
                  Access
                </div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td><strong>Editor</strong></td>
                  <td>Viewer</td>
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissions).filter(([category]) => category !== 'admin').map(([category, perm]) => (
                  <tr key={category}>
                    <td><strong>{category.charAt(0).toUpperCase() + category.slice(1)}</strong></td>
                    <td>
                      <input
                        type="checkbox"
                        name={`${category}-editor`}
                        checked={perm.editor}
                        onChange={handleCheckboxChange}
                        disabled={role !== 'admin'}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        name={`${category}-viewer`}
                        checked={perm.viewer}
                        onChange={handleCheckboxChange}
                        disabled={role !== 'admin'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Header;
