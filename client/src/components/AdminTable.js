import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import styles from './CustomerTable.module.css'; // Import your CSS module for styling

function AdminTable() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false); // State for access modal
    const [currentStep, setCurrentStep] = useState(1); // State to track current step
    const [selectedUser, setSelectedUser] = useState(null); // State to track the selected user for access modal
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        department: '',
        designation: '',
        password: '',
        confirmPassword: '',
        permissions: {
            customer: { editor: false, viewer: false },
            admin: { editor: false, viewer: false },
            partners: { editor: false, viewer: false },
            transports: { editor: false, viewer: false },
            boq: { editor: false, viewer: false },
            lead: { editor: false, viewer: false },
        },
    });
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null); // State to track expanded user
    const [passwordVisible, setPasswordVisible] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('There was an error fetching the users!', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
        setErrors({});
        setCurrentStep(1); // Reset to step 1 when closing the modal
    };

    const openAccessModal = (user) => {
        setSelectedUser(user);
        setIsAccessModalOpen(true);
    };

    const closeAccessModal = () => {
        setIsAccessModalOpen(false);
        setSelectedUser(null);
        setCurrentStep(1); // Reset to step 1 when closing the modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handlePermissionChange = (e, category, type) => {
        const { checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            permissions: {
                ...prevFormData.permissions,
                [category]: {
                    ...prevFormData.permissions[category],
                    editor: type === 'editor' ? checked : false,
                    viewer: type === 'viewer' ? checked : false
                }
            }
        }));
    };

    const handleAccessPermissionChange = (e, category, type) => {
        const { checked } = e.target;
        setSelectedUser(prevUser => ({
            ...prevUser,
            permissions: {
                ...prevUser.permissions,
                [category]: {
                    editor: type === 'editor' ? checked : false,
                    viewer: type === 'viewer' ? checked : false
                }
            }
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        let errorMessage = '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.name) tempErrors.name = 'Name is required';
        if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) tempErrors.phoneNumber = 'Valid phone number is required';
        if (!formData.email || !emailRegex.test(formData.email)) tempErrors.email = 'Valid email is required';
        if (!formData.department) tempErrors.department = 'Department is required';
        if (!formData.designation) tempErrors.designation = 'Designation is required';
        if (!formData.password) tempErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';

        setErrors(tempErrors);
        setFormError(errorMessage);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/users`, formData);
            const newUser = response.data;
            setUsers([...users, newUser]); // Add the new user to the list
            closeModal();
            setFormData({
                name: '',
                phoneNumber: '',
                email: '',
                department: '',
                designation: '',
                password: '',
                confirmPassword: '',
                permissions: {
                    customer: { editor: false, viewer: false },
                    admin: { editor: false, viewer: false },
                    partners: { editor: false, viewer: false },
                    transports: { editor: false, viewer: false },
                    boq: { editor: false, viewer: false },
                    lead: { editor: false, viewer: false },
                },
            });
        } catch (error) {
            console.error('There was an error adding the user!', error);
            // Display an error message to the user (e.g., using state)
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const toggleUserDetails = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const handleSavePermissions = async () => {
        try {
            await axios.put(`${API_BASE_URL}/users/${selectedUser._id}`, { permissions: selectedUser.permissions });
            fetchData(); // Refresh the user list
            closeAccessModal();
        } catch (error) {
            console.error('There was an error updating the permissions!', error);
        }
    };

    const nextStep = () => {
        if (validateForm()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleStatusChange = async (e, user) => {
        const { value } = e.target;
        try {
            await axios.patch(`${API_BASE_URL}/users/${user._id}/status`, { status: value });
            fetchData(); // Refresh the user list
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    // Updated filter logic to include userId and email
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.tableContainer}>
            <div className={styles.layoutBar}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search by User ID, Name, or Email"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <button type="button" onClick={openModal} className={styles.addCustomerButton}>+ Add User</button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add User Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        <h2>Add User</h2>
                        {formError && <div className={styles.formError}>{formError}</div>}
                        {currentStep === 1 && (
                            <div>
                                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={errors.name ? styles.errorInput : ''}
                                        onInput={(e) => { e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ''); }}
                                    />
                                    {errors.name && <p className={styles.error}>{errors.name}</p>}
                                    
                                    <label htmlFor="phoneNumber">Phone no.</label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="987654321"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={errors.phoneNumber ? styles.errorInput : ''}
                                        onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }}
                                    />
                                    {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
                                    
                                    <label htmlFor="email">Email Id.</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="example@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? styles.errorInput : ''}
                                    />
                                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                                    
                                    <label htmlFor="department">Department</label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className={errors.department ? styles.errorInput : ''}
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Product Designer">Product Designer</option>
                                        <option value="Developer">Developer</option>
                                    </select>
                                    {errors.department && <p className={styles.error}>{errors.department}</p>}
                                    
                                    <label htmlFor="designation">Designation</label>
                                    <select
                                        id="designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className={errors.designation ? styles.errorInput : ''}
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="Junior">Junior</option>
                                        <option value="Senior">Senior</option>
                                    </select>
                                    {errors.designation && <p className={styles.error}>{errors.designation}</p>}
                                    
                                    <label htmlFor="password">Password
                                        <span 
                                            className={styles.passwordToggle} 
                                            onClick={() => setPasswordVisible(!passwordVisible)}
                                        >
                                            {passwordVisible ? 'Hide' : 'Show'}
                                        </span>
                                    </label>
                                    <div className={styles.passwordWrapper}>
                                        <input 
                                            type={passwordVisible ? 'text' : 'password'} 
                                            id="password" 
                                            name="password" 
                                            placeholder="Enter your password" 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            className={errors.password ? styles.errorInput : ''} 
                                        />
                                    </div>
                                    {errors.password && <p className={styles.error}>{errors.password}</p>}
                                    
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className={styles.passwordWrapper}>
                                        <input 
                                            type={passwordVisible ? 'text' : 'password'} 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            placeholder="Confirm your password" 
                                            value={formData.confirmPassword} 
                                            onChange={handleChange} 
                                            className={errors.confirmPassword ? styles.errorInput : ''} 
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                                    
                                    <div className={styles.formGroupBottom}>
                                        <button type="button" className={styles.closeButton} onClick={closeModal}>Close</button>
                                        <button type="submit" className={styles.nextButton}>Next</button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div>
                                <div className={styles.permissionsContainer}>
                                    <h3>Permissions</h3>
                                    <table className={styles.permissionsTable}>
                                        <thead>
                                            <tr>
                                                <th>Access</th>
                                                <th>Editor</th>
                                                <th>Viewer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(formData.permissions).map(([category, permission]) => (
                                                <tr key={category}>
                                                    <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={permission.editor}
                                                            onChange={(e) => handlePermissionChange(e, category, 'editor')}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={permission.viewer}
                                                            onChange={(e) => handlePermissionChange(e, category, 'viewer')}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles.formGroupBottom}>
                                    <button type="button" className={styles.backButton} onClick={prevStep}>Back</button>
                                    <button type="submit" className={styles.saveButton} onClick={handleSubmit}>Save</button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email Id.</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Access</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <React.Fragment key={index}>
                            <tr 
                                onClick={() => toggleUserDetails(user.userId)}
                                className={user.status === 'inactive' ? styles.inactiveUser : ''}
                            >
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.department}</td>
                                <td>{user.designation}</td>
                                <td>
                                    <button onClick={(e) => { e.stopPropagation(); openAccessModal(user); }}>View Access</button>
                                </td>
                                <td>
                                    <select value={user.status} onChange={(e) => handleStatusChange(e, user)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td>
                            </tr>
                            {expandedUserId === user.userId && (
                                <tr>
                                    <td colSpan="8">
                                        <div className={styles.detailsBox}>
                                            <p><strong>Users ID:</strong> {user.userId}</p>
                                            <p><strong>Name:</strong> {user.name}</p>
                                            <p><strong>Email Id.:</strong> {user.email}</p>
                                            <p><strong>Department:</strong> {user.department}</p>
                                            <p><strong>Designation:</strong> {user.designation}</p>
                                            <div className={styles.permissionsContainer}>
                                                <h3>Permissions</h3>
                                                <table className={styles.permissionsTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Access</th>
                                                            <th>Editor</th>
                                                            <th>Viewer</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {user.permissions && Object.entries(user.permissions).map(([category, permission]) => (
                                                            <tr key={category}>
                                                                <td>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                                                                <td>{permission.editor ? '✔️' : ''}</td>
                                                                <td>{permission.viewer ? '✔️' : ''}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                {/* Pagination controls can be added here */}
            </div>

            {selectedUser && (
                <Modal
                    isOpen={isAccessModalOpen}
                    onRequestClose={closeAccessModal}
                    contentLabel="Access Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.accessModalContent}>
                        <div className={styles.modalContentHeader}>
                            <h2>Edit Profile</h2>
                            <div className={styles.modalContentHeaderInfo}>
                                {/* Additional info can be placed here */}
                            </div>
                        </div>
                        <div className={styles.permissionsContainer}>
                            <h3>Permissions</h3>
                            <table className={styles.permissionsTable}>
                                <thead>
                                    <tr>
                                        <th>Access</th>
                                        <th>Editor</th>
                                        <th>Viewer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(selectedUser.permissions).map(([category, permission]) => (
                                        <tr key={category}>
                                            <td><strong>{category.charAt(0).toUpperCase() + category.slice(1)}</strong></td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.editor}
                                                    onChange={(e) => handleAccessPermissionChange(e, category, 'editor')}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={permission.viewer}
                                                    onChange={(e) => handleAccessPermissionChange(e, category, 'viewer')}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.formGroupBottom}>
                            <button type="button" className={styles.closeButton} onClick={closeAccessModal}>Close</button>
                            <button type="button" className={styles.saveButton} onClick={handleSavePermissions}>Save</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AdminTable;
