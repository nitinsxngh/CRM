import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import styles from './BoqTable.module.css';
import { useNavigate } from 'react-router-dom';

function LeadTable() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData());
    const [leads, setLeads] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [expandedLeadId, setExpandedLeadId] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [role, setRole] = useState('user');
    const [editingLeadId, setEditingLeadId] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        const storedRole = localStorage.getItem('role');
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions));
        }
        if (storedRole) {
            setRole(storedRole);
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leads`);
            setLeads(response.data);
        } catch (error) {
            console.error('Error fetching the leads!', error);
        }
    };

    const openModal = (lead = null) => {
        if (lead) {
            setFormData(lead);
            setEditingLeadId(lead._id);
        } else {
            setFormData(initialFormData());
            setEditingLeadId(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError('');
        setErrors({});
        setCurrentStep(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let tempErrors = {};
        if (currentStep === 1) {
            if (!formData.type) tempErrors.type = 'Type is required';
            if (!formData.pincode) tempErrors.pincode = 'Pincode is required';
            if (!formData.name) tempErrors.name = 'Name is required';
            if (!formData.number) tempErrors.number = 'Number is required';
            if (!formData.email) tempErrors.email = 'Email is required';
        } else if (currentStep === 2) {
            if (!formData.plotSize) tempErrors.plotSize = 'Plot Size is required';
            if (!formData.floors) tempErrors.floors = 'Floors requirement is required';
            if (!formData.rooms) tempErrors.rooms = 'Rooms requirement is required';
            if (!formData.budget) tempErrors.budget = 'Budget is required';
            if (!formData.dayToStart) tempErrors.dayToStart = 'Day to start is required';
            if (formData.type === 'Interior') {
                if (!formData.interiorType) tempErrors.interiorType = 'Interior Type is required';
                if (!formData.subType) tempErrors.subType = 'Sub Type is required';
            }
        } else if (currentStep === 3) {
            if (!formData.addressLine1) tempErrors.addressLine1 = 'Address Line 1 is required';
            if (!formData.addressLine2) tempErrors.addressLine2 = 'Address Line 2 is required';
            if (!formData.pincode) tempErrors.pincode = 'Pincode is required';
            if (!formData.country) tempErrors.country = 'Country is required';
            if (!formData.city) tempErrors.city = 'City is required';
            if (!formData.state) tempErrors.state = 'State is required';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingLeadId) {
                await axios.put(`${API_BASE_URL}/leads/${editingLeadId}`, formData);
            } else {
                await axios.post(`${API_BASE_URL}/leads`, formData);
            }

            fetchData();
            closeModal();
            setFormData(initialFormData());
        } catch (error) {
            console.error('Error adding the lead!', error);
            setFormError('There was an error adding the lead. Please try again.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const nextStep = () => {
        if (!validateForm()) return;
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const toggleExpand = (leadId) => {
        setExpandedLeadId(expandedLeadId === leadId ? null : leadId);
    };

    const handlePriorityChange = async (e, lead) => {
        const { value } = e.target;
        try {
            await axios.patch(`${API_BASE_URL}/leads/${lead._id}/priority`, { priority: value });
            setLeads(leads.map(l => l._id === lead._id ? { ...l, priority: value } : l));
        } catch (error) {
            console.error('Error updating the lead priority!', error);
        }
    };

    const handleStatusChange = async (e, lead) => {
        const { value } = e.target;
        try {
            await axios.patch(`${API_BASE_URL}/leads/${lead._id}/status`, { status: value });
            setLeads(leads.map(l => l._id === lead._id ? { ...l, status: value } : l));
        } catch (error) {
            console.error('Error updating the lead status!', error);
        }
    };

    const handleCreateBoq = (lead) => {
        navigate('/boq', { state: { lead } });
    };

    const filteredLeads = leads.filter(lead =>
        lead.leadId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High':
                return styles.highPriority;
            case 'Medium':
                return styles.mediumPriority;
            case 'Low':
                return styles.lowPriority;
            default:
                return '';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return styles.activeStatus;
            case 'Inactive':
                return styles.inactiveStatus;
            case 'Boq Sent':
                return styles.boqSentStatus;
            case 'Deal Closed':
                return styles.dealClosedStatus;
            case 'Meeting Done':
                return styles.meetingDoneStatus;
            default:
                return '';
        }
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.layoutBar}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                {(role === 'admin' || permissions.lead?.editor) && (
                    <button type="button" onClick={() => openModal()} className={styles.addCustomerButton}>+ Add Leads</button>
                )}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Lead Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        <h2>{editingLeadId ? 'Edit Lead' : 'Add Lead'}</h2>
                        {formError && <div className={styles.formError}>{formError}</div>}
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {currentStep === 1 && (
                                <>
                                    <SelectField
                                        id="type"
                                        name="type"
                                        label="Type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        options={[
                                            { value: '', label: 'Select type' },
                                            { value: 'Construction', label: 'Construction' },
                                            { value: 'Interior', label: 'Interior' },
                                            { value: 'Interior + Construction', label: 'Interior + Construction' },
                                        ]}
                                        error={errors.type}
                                    />
                                    <TextField
                                        id="name"
                                        name="name"
                                        label="Name"
                                        placeholder="Enter name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                    />
                                    <TextField
                                        id="number"
                                        name="number"
                                        label="Number"
                                        placeholder="Enter number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        error={errors.number}
                                    />
                                    <TextField
                                        id="email"
                                        name="email"
                                        label="Email"
                                        placeholder="Enter email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                    />
                                    <TextField
                                        id="pincode"
                                        name="pincode"
                                        label="Pincode"
                                        placeholder="Enter pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        error={errors.pincode}
                                    />
                                    <SelectField
                                        id="priority"
                                        name="priority"
                                        label="Priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'High', label: 'High' },
                                            { value: 'Medium', label: 'Medium' },
                                            { value: 'Low', label: 'Low' },
                                        ]}
                                        error={errors.priority}
                                    />
                                    <div className={styles.formGroupBottom}>
                                        <button type="button" className={styles.closeButton} onClick={closeModal}>Close</button>
                                        <button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>
                                    </div>
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    {formData.type === 'Interior' && (
                                        <>
                                            <SelectField
                                                id="interiorType"
                                                name="interiorType"
                                                label="Interior Type"
                                                value={formData.interiorType}
                                                onChange={handleChange}
                                                options={[
                                                    { value: '', label: 'Select Interior Type' },
                                                    { value: 'Modern', label: 'Modern' },
                                                    { value: 'Traditional', label: 'Traditional' },
                                                ]}
                                                error={errors.interiorType}
                                            />
                                            <SelectField
                                                id="subType"
                                                name="subType"
                                                label="Sub Type"
                                                value={formData.subType}
                                                onChange={handleChange}
                                                options={[
                                                    { value: '', label: 'Select Sub Type' },
                                                    { value: 'Kitchen', label: 'Kitchen' },
                                                    { value: 'Living Room', label: 'Living Room' },
                                                ]}
                                                error={errors.subType}
                                            />
                                        </>
                                    )}
                                    <TextField
                                        id="plotSize"
                                        name="plotSize"
                                        label="Plot Size (Sq. Ft.)"
                                        placeholder="Enter plot size"
                                        value={formData.plotSize}
                                        onChange={handleChange}
                                        error={errors.plotSize}
                                    />
                                    <TextField
                                        id="floors"
                                        name="floors"
                                        label="Floors requirements"
                                        placeholder="Enter floors requirements"
                                        value={formData.floors}
                                        onChange={handleChange}
                                        error={errors.floors}
                                    />
                                    <TextField
                                        id="rooms"
                                        name="rooms"
                                        label="Rooms requirements"
                                        placeholder="Enter rooms requirements"
                                        value={formData.rooms}
                                        onChange={handleChange}
                                        error={errors.rooms}
                                    />
                                    <TextField
                                        id="budget"
                                        name="budget"
                                        label="Budget"
                                        placeholder="Enter budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        error={errors.budget}
                                    />
                                    <TextField
                                        id="dayToStart"
                                        name="dayToStart"
                                        label="Day to start"
                                        placeholder="Enter day to start"
                                        value={formData.dayToStart}
                                        onChange={handleChange}
                                        error={errors.dayToStart}
                                    />
                                    <TextArea
                                        id="extraInfo"
                                        name="extraInfo"
                                        label="Extra info"
                                        placeholder="Add comments"
                                        value={formData.extraInfo}
                                        onChange={handleChange}
                                        error={errors.extraInfo}
                                    />
                                    <div className={styles.formGroupBottom}>
                                        <button type="button" className={styles.backButton} onClick={prevStep}>Back</button>
                                        <button type="button" className={styles.nextButton} onClick={nextStep}>Next</button>
                                    </div>
                                </>
                            )}
                            {currentStep === 3 && (
                                <>
                                    <TextField
                                        id="addressLine1"
                                        name="addressLine1"
                                        label="Address Line 1"
                                        placeholder="Enter address line 1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        error={errors.addressLine1}
                                    />
                                    <TextField
                                        id="addressLine2"
                                        name="addressLine2"
                                        label="Address Line 2"
                                        placeholder="Enter address line 2"
                                        value={formData.addressLine2}
                                        onChange={handleChange}
                                        error={errors.addressLine2}
                                    />
                                    <TextField
                                        id="pincode"
                                        name="pincode"
                                        label="Pincode"
                                        placeholder="Enter pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        error={errors.pincode}
                                    />
                                    <SelectField
                                        id="country"
                                        name="country"
                                        label="Country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'India', label: 'India' },
                                        ]}
                                        error={errors.country}
                                    />
                                    <SelectField
                                        id="city"
                                        name="city"
                                        label="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'Gurgaon', label: 'Gurgaon' },
                                        ]}
                                        error={errors.city}
                                    />
                                    <SelectField
                                        id="state"
                                        name="state"
                                        label="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'Haryana', label: 'Haryana' },
                                        ]}
                                        error={errors.state}
                                    />
                                    <SelectField
                                        id="status"
                                        name="status"
                                        label="Status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'Active', label: 'Active' },
                                            { value: 'Inactive', label: 'Inactive' },
                                            { value: 'Boq Sent', label: 'Boq Sent' },
                                            { value: 'Deal Closed', label: 'Deal Closed' },
                                            { value: 'Meeting Done', label: 'Meeting Done' },
                                        ]}
                                        error={errors.status}
                                    />
                                    <div className={styles.formGroupBottom}>
                                        <button type="button" className={styles.backButton} onClick={prevStep}>Back</button>
                                        <button type="submit" className={styles.saveButton}>Save</button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </Modal>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Lead ID</th>
                        <th>Name</th>
                        <th>Phone No.</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Priority</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeads.map((lead, index) => (
                        <React.Fragment key={index}>
                            <tr 
                                onClick={() => toggleExpand(lead._id)}
                                className={`${getPriorityClass(lead.priority)} ${getStatusClass(lead.status)}`}
                            >
                                <td>{lead.leadId}</td>
                                <td>{lead.name}</td>
                                <td>{lead.number}</td>
                                <td>{lead.email}</td>
                                <td>{lead.city}</td>
                                <td>{lead.type}</td>
                                <td>
                                    {(role === 'admin' || permissions.lead?.editor) ? (
                                        <select value={lead.priority} onChange={(e) => handlePriorityChange(e, lead)} className={styles.actionSelect}>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    {(role === 'admin' || permissions.lead?.editor) ? (
                                        <select value={lead.status} onChange={(e) => handleStatusChange(e, lead)} className={styles.actionSelect}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Boq Sent">Boq Sent</option>
                                            <option value="Deal Closed">Deal Closed</option>
                                            <option value="Meeting Done">Meeting Done</option>
                                        </select>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            </tr>
                            {expandedLeadId === lead._id && (
                                <tr>
                                    <td colSpan="9">
                                        <div className={styles.expandedRow}>
                                            <p><strong>Budget:</strong> {lead.budget}</p>
                                            <p><strong>Type:</strong> {lead.type}</p>
                                            <p><strong>Plot:</strong> {lead.plotSize}</p>
                                            <p><strong>Email:</strong> {lead.email}</p>
                                            <p><strong>Number:</strong> {lead.number}</p>
                                            <p><strong>Pincode:</strong> {lead.pincode}</p>
                                            <p><strong>Address Line 1:</strong> {lead.addressLine1}</p>
                                            <p><strong>Address Line 2:</strong> {lead.addressLine2}</p>
                                            <p><strong>Day to Start:</strong> {lead.dayToStart}</p>
                                            <p><strong>Extra Info:</strong> {lead.extraInfo}</p>
                                            {(role === 'admin' || permissions.lead?.editor) && (
                                                <>
                                                    <button onClick={(e) => { e.stopPropagation(); handleCreateBoq(lead); }} className={styles.actionButton}>Create BOQ</button>
                                                    <button onClick={(e) => { e.stopPropagation(); openModal(lead); }} className={styles.actionButton}>Edit</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const initialFormData = () => ({
    type: '',
    interiorType: '',
    subType: '',
    pincode: '',
    name: '',
    number: '',
    email: '',
    plotSize: '',
    floors: '',
    rooms: '',
    budget: '',
    dayToStart: '',
    extraInfo: '',
    addressLine1: '',
    addressLine2: '',
    country: 'India',
    city: 'Gurgaon',
    state: 'Haryana',
    priority: 'Medium',
    status: 'Active',
});

const TextField = ({ id, name, label, placeholder, value, onChange, error }) => (
    <>
        <label htmlFor={id}>{label}</label>
        <input
            type="text"
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={error ? styles.errorInput : ''}
        />
        {error && <p className={styles.error}>{error}</p>}
    </>
);

const SelectField = ({ id, name, label, value, onChange, options, error }) => (
    <>
        <label htmlFor={id}>{label}</label>
        <select id={id} name={name} value={value} onChange={onChange} className={error ? styles.errorInput : ''}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {error && <p className={styles.error}>{error}</p>}
    </>
);

const TextArea = ({ id, name, label, placeholder, value, onChange, error }) => (
    <>
        <label htmlFor={id}>{label}</label>
        <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={error ? styles.errorInput : ''}
        />
        {error && <p className={styles.error}>{error}</p>}
    </>
);

export default LeadTable;
