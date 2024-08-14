import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import styles from './BoqTable.module.css';
import logo from "../assets/housebanao.svg";

Modal.setAppElement('#root'); // Set the app element for react-modal

const steps = [
    { id: 1, name: "Create BOQ" },
    { id: 2, name: "Basic Details" },
    { id: 3, name: "Other Charges" },
    { id: 4, name: "Specifications" },
    { id: 5, name: "Terms & Conditions" },
    { id: 6, name: "Review" }
];

function BoqTable() {
    const location = useLocation();
    const leadData = location.state?.lead || {};
    
    const [expandedBoqId, setExpandedBoqId] = useState(null);

    const toggleDetails = (boqId) => {
        if (expandedBoqId === boqId) {
            setExpandedBoqId(null); // Collapse if already expanded
        } else {
            setExpandedBoqId(boqId); // Expand if not expanded
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        boqName: '',
        customer: leadData._id || '',
        boqComments: '',
        type: leadData.type || '',
        createdBy: 'Current User',
        additionalInfo: '',
        constructionDetails: '',
        area: '',
        category: '',
        items: [],
        siteInspection: '',
        otherCharges: '',
        siteConditions: [],
        specifications: [],
        name: leadData.name || '',
        email: leadData.email || '',
        number: leadData.number || '',
        addressLine1: leadData.addressLine1 || '',
        addressLine2: leadData.addressLine2 || '',
        city: leadData.city || '',
        state: leadData.state || '',
        country: leadData.country || '',
        pincode: leadData.pincode || '',
    });
    const [boqs, setBoqs] = useState([]);
    const [leads, setLeads] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [showTable, setShowTable] = useState(true); // State to toggle table visibility
    const [selectedCategory, setSelectedCategory] = useState(''); // State to track selected category
    const [permissions, setPermissions] = useState({});
    const [role, setRole] = useState('user');

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
        fetchBoqs();
        fetchLeads();
    }, []);

    const fetchBoqs = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/boq`);
            setBoqs(response.data);
        } catch (error) {
            console.error('There was an error fetching the BOQs!', error);
        }
    };

    const fetchLeads = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/leads`);
            setLeads(response.data);
        } catch (error) {
            console.error('There was an error fetching the leads!', error);
        }
    };

    const getCustomerNameById = (leadId) => {
        const lead = leads.find(ld => ld._id === leadId);
        return lead ? lead.name : '';
    };

    const openModal = () => {
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

    const handleItemChange = (e, index) => {
        const { name, value } = e.target;
        const items = [...formData.items];
        items[index] = { ...items[index], [name]: value };
        setFormData({ ...formData, items });
    };

    const addItem = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            items: [...prevFormData.items, { name: '', description: '', quantity: '', rate: '', discount: '', cost: '' }]
        }));
    };

    const addSiteCondition = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            siteConditions: [...prevFormData.siteConditions, { description: '', uom: '', standard: '' }]
        }));
    };

    const handleSiteConditionChange = (e, index) => {
        const { name, value } = e.target;
        const siteConditions = [...formData.siteConditions];
        siteConditions[index] = { ...siteConditions[index], [name]: value };
        setFormData({ ...formData, siteConditions });
    };

    const addSpecification = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            specifications: [...prevFormData.specifications, { categoryName: '', description: '', image: null }]
        }));
    };

    const handleSpecificationChange = (e, index) => {
        const { name, value } = e.target;
        const specifications = [...formData.specifications];
        specifications[index] = { ...specifications[index], [name]: value };
        setFormData({ ...formData, specifications });
    };

    const handleSpecificationImageChange = (e, index) => {
        const { files } = e.target;
        const specifications = [...formData.specifications];
        specifications[index] = { ...specifications[index], image: files[0] };
        setFormData({ ...formData, specifications });
    };

    const validateForm = () => {
        let tempErrors = {};
        let errorMessage = '';

        if (!formData.boqName) tempErrors.boqName = 'BOQ Name is required';
        if (!formData.customer) tempErrors.customer = 'Customer is required';
        if (!formData.boqComments) tempErrors.boqComments = 'BOQ Comments are required';
        if (!formData.type) tempErrors.type = 'Type is required';

        setErrors(tempErrors);
        setFormError(errorMessage);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && !validateForm()) return;
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepId) => {
        if (stepId <= currentStep || validateForm()) {
            setCurrentStep(stepId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/boq`, formData);
            const newBoq = response.data;
            setBoqs([...boqs, newBoq]);
            closeModal();
            setFormData({
                boqName: '',
                customer: '',
                boqComments: '',
                type: '',
                createdBy: 'Current User',
                additionalInfo: '',
                constructionDetails: '',
                area: '',
                category: '',
                items: [],
                siteInspection: '',
                otherCharges: '',
                siteConditions: [],
                specifications: []
            });
        } catch (error) {
            console.error('There was an error adding the BOQ!', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredBoqs = boqs.filter(boq =>
        boq.boqName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const printAsPdf = () => {
        const element = document.getElementById('reviewContent');
        const options = {
            margin: 0.5,
            filename: `${formData.boqName}_BOQ.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };

    const viewAsPdf = () => {
        const element = document.getElementById('reviewContent');
        const options = {
            margin: 0.5,
            filename: `${formData.boqName}_BOQ.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).output('blob').then(blob => {
            const url = URL.createObjectURL(blob);
            window.open(url);
        });
    };

    const toggleTable = () => {
        setShowTable(!showTable);
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
                    <button type="button" className={styles.searchButton}>Search</button>
                </div>
                {(role === 'admin' || permissions.boq?.editor) && (
                    <button type="button" onClick={openModal} className={styles.addCustomerButton}>+ Create BOQ</button>
                )}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add BOQ Modal"
                    className={`${styles.modal} ${currentStep > 1 ? styles.fullscreenModal : ''}`}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        {currentStep > 1 && (
                            <div className={styles.progressBar}>
                                {steps.map(step => (
                                    <div
                                        key={step.id}
                                        className={`${styles.step} ${currentStep === step.id ? styles.activeStep : ''}`}
                                        onClick={() => handleStepClick(step.id)}
                                    >
                                        {step.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {formError && <div className={styles.formError}>{formError}</div>}
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {currentStep === 1 && (
                                <div className={styles.singleColumn}>
                                    <label htmlFor="boqName">BOQ Name</label>
                                    <input type="text" id="boqName" name="boqName" placeholder="Enter BOQ Name" value={formData.boqName || ''} onChange={handleChange} className={errors.boqName ? styles.errorInput : ''} />
                                    {errors.boqName && <p className={styles.error}>{errors.boqName}</p>}
                                    
                                    <label htmlFor="type">Create For</label>
                                    <div className={styles.type}>
                                        <button 
                                            className={`${styles.typeBtn} ${selectedCategory === 'Construction' ? styles.selectedCategory : ''}`} 
                                            type="button" 
                                            onClick={() => {
                                                setFormData({ ...formData, type: 'Construction' });
                                                setSelectedCategory('Construction');
                                            }}>
                                            Construction
                                        </button>
                                        <button 
                                            className={`${styles.typeBtn} ${selectedCategory === 'Interior' ? styles.selectedCategory : ''}`} 
                                            type="button" 
                                            onClick={() => {
                                                setFormData({ ...formData, type: 'Interior' });
                                                setSelectedCategory('Interior');
                                            }}>
                                            Interior
                                        </button>
                                    </div>
                                    {errors.type && <p className={styles.error}>{errors.type}</p>}
                                    
                                    <label htmlFor="customer">Choose Customer</label>
                                    <select id="customer" name="customer" value={formData.customer || ''} onChange={handleChange} className={errors.customer ? styles.errorInput : ''}>
                                        <option value="">Choose Customer</option>
                                        {leads.map(lead => (
                                            <option key={lead._id} value={lead._id}>
                                                {lead.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer && <p className={styles.error}>{errors.customer}</p>}
                                    
                                    <label htmlFor="boqComments">Add BOQ Comments</label>
                                    <input type="text" id="boqComments" name="boqComments" placeholder="Comments" value={formData.boqComments || ''} onChange={handleChange} className={errors.boqComments ? styles.errorInput : ''} />
                                    {errors.boqComments && <p className={styles.error}>{errors.boqComments}</p>}
                                </div>
                            )}
                            {currentStep === 2 && (
                                <div className={styles.gridContainer}>
                                    <label htmlFor="boqName">BOQ Name</label>
                                    <input type="text" id="boqName" name="boqName" placeholder="Enter BOQ Name" value={formData.boqName || ''} onChange={handleChange} className={errors.boqName ? styles.errorInput : ''} disabled/>
                                    {errors.boqName && <p className={styles.error}>{errors.boqName}</p>}
                                    
                                    <label htmlFor="type">Type</label>
                                    <input type="text" id="type" name="type" placeholder="Type" value={formData.type || ''} onChange={handleChange} className={errors.type ? styles.errorInput : ''} disabled/>
                                    {errors.type && <p className={styles.error}>{errors.type}</p>}
                                    
                                    <label htmlFor="createdBy">Created On</label>
                                    <input type="text" id="createdBy" name="createdBy" value={new Date().toLocaleDateString()} disabled/>

                                    <label htmlFor="customer">Customer Name</label>
                                    <input type="text" id="customer" name="customer" placeholder="Customer Name" value={getCustomerNameById(formData.customer)} disabled/>
                                    
                                    <label htmlFor="constructionDetails">Construction Details</label>
                                    <textarea className={styles.textarea} id="constructionDetails" name="constructionDetails" placeholder="Enter Construction Details" value={formData.constructionDetails || ''} onChange={handleChange} />
                                    
                                    <label htmlFor="area">Area</label>
                                    <input type="text" id="area" name="area" placeholder="Per sqft" value={formData.area || ''} onChange={handleChange} />
                                    
                                    <label htmlFor="category">Category</label>
                                    <input type="text" id="category" name="category" placeholder="Category" value={formData.category || ''} onChange={handleChange} />
                                    
                                    <div className={styles.fullWidth}>
                                        <button type="button" onClick={addItem}>+ Add Items</button>
                                    </div>
                                    {formData.items.map((item, index) => (
                                        <div key={index} className={styles.singleColumn}>
                                            <input type="text" name="name" placeholder="Name" value={item.name || ''} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="text" name="description" placeholder="Description" value={item.description || ''} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="number" name="quantity" placeholder="Quantity" value={item.quantity || ''} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="number" name="rate" placeholder="Rate" value={item.rate || ''} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="number" name="discount" placeholder="Discount" value={item.discount || ''} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="number" name="cost" placeholder="Cost (inr)" value={item.cost || ''} onChange={(e) => handleItemChange(e, index)} />
                                            <input type="file" name="uploadImage" placeholder="Upload image" onChange={(e) => handleItemChange(e, index)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div className={styles.gridContainer}>
                                    <label>Do they want site inspection?</label>
                                    <div>
                                        <label>
                                            <input type="radio" name="siteInspection" value="Yes" checked={formData.siteInspection === 'Yes'} onChange={handleChange} />
                                            Yes
                                        </label>
                                        <label>
                                            <input type="radio" name="siteInspection" value="No" checked={formData.siteInspection === 'No'} onChange={handleChange} />
                                            No
                                        </label>
                                    </div>

                                    <label htmlFor="item">Item</label>
                                    <input type="text" id="item" name="item" placeholder="Item" value={formData.item || ''} onChange={handleChange} />
                                    
                                    <label htmlFor="description">Description</label>
                                    <input type="text" id="description" name="description" placeholder="Description" value={formData.description || ''} onChange={handleChange} />

                                    <label htmlFor="additionalCost">Additional Cost</label>
                                    <input type="text" id="additionalCost" name="additionalCost" placeholder="Additional Cost" value={formData.additionalCost || ''} onChange={handleChange} />

                                    <label htmlFor="additionalDays">Additional Days</label>
                                    <input type="text" id="additionalDays" name="additionalDays" placeholder="Additional Days" value={formData.additionalDays || ''} onChange={handleChange} />

                                    <div className={styles.fullWidth}>
                                        <h3>Site conditions impacting cost</h3>
                                        <button type="button" onClick={addSiteCondition}>+ Add Site Condition</button>
                                    </div>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Description</th>
                                                <th>UOM</th>
                                                <th>Standard</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.siteConditions.map((condition, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input type="text" name="description" placeholder="Description" value={condition.description || ''} onChange={(e) => handleSiteConditionChange(e, index)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" name="uom" placeholder="UOM" value={condition.uom || ''} onChange={(e) => handleSiteConditionChange(e, index)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" name="standard" placeholder="Standard" value={condition.standard || ''} onChange={(e) => handleSiteConditionChange(e, index)} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {currentStep === 4 && (
                                <div className={styles.gridContainer}>
                                    <label htmlFor="categoryName">Category Name</label>
                                    <input type="text" id="categoryName" name="categoryName" placeholder="Category Name" value={formData.categoryName || ''} onChange={handleChange} />

                                    <label htmlFor="uploadImage">Upload Image</label>
                                    <input type="file" id="uploadImage" name="uploadImage" onChange={handleChange} />
                                    
                                    <label htmlFor="description">Description (Specifications)</label>
                                    <textarea id="description" name="description" placeholder="Enter Specifications" value={formData.description || ''} onChange={handleChange} />

                                    <div className={styles.fullWidth}>
                                        <button type="button" onClick={addSpecification}>+ Add Categories</button>
                                    </div>
                                    {formData.specifications.map((specification, index) => (
                                        <div key={index} className={styles.singleColumn}>
                                            <input type="text" name="categoryName" placeholder="Category Name" value={specification.categoryName || ''} onChange={(e) => handleSpecificationChange(e, index)} />
                                            <input type="file" name="image" onChange={(e) => handleSpecificationImageChange(e, index)} />
                                            <textarea name="description" placeholder="Description" value={specification.description || ''} onChange={(e) => handleSpecificationChange(e, index)} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            {currentStep === 5 && (
                                <div className={styles.gridContainer}>
                                    <label htmlFor="terms">Terms & Conditions</label>
                                    <textarea id="terms" className={styles.terms} name="terms" placeholder="Enter terms and conditions" value={formData.terms || ''} onChange={handleChange} />
                                </div>
                            )}
                            {currentStep === 6 && (
                                <div>
                                    <h2>Review</h2>
                                    <div id="reviewContent" className={styles.reviewContent}>
                                        <div className={styles.reviewContentMain}>
                                            <div className={styles.topLeftDataPreview}>
                                                <img className={styles.logo} src={logo} alt="Logo" />
                                            </div>
                                            <div className={styles.topRightDataPreview}>
                                                <h1>Customer BOQ</h1>
                                                <h3>BOQ Name</h3>
                                                <hr></hr>
                                                <h3>Created For</h3>
                                                <p><strong>Customer Name:</strong> {formData.boqName}</p>
                                                <p><strong>Customer ID:</strong> {getCustomerNameById(formData.customer)}</p>
                                            </div>
                                        </div>
                                        <div className={styles.reviewContentMainPoster}>

                                        </div>
                                        <h3>BOQ Details</h3>
                                        <p><strong>BOQ Name:</strong> {formData.boqName}</p>
                                        <p><strong>Customer:</strong> {getCustomerNameById(formData.customer)}</p>
                                        <p><strong>Comments:</strong> {formData.boqComments}</p>
                                        <p><strong>Type:</strong> {formData.type}</p>
                                        <p><strong>Additional Info:</strong> {formData.additionalInfo}</p>
                                        <p><strong>Construction Details:</strong> {formData.constructionDetails}</p>
                                        <p><strong>Area:</strong> {formData.area}</p>
                                        <p><strong>Category:</strong> {formData.category}</p>
                                        <h3>Items</h3>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Quantity</th>
                                                    <th>Rate</th>
                                                    <th>Discount</th>
                                                    <th>Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.rate}</td>
                                                        <td>{item.discount}</td>
                                                        <td>{item.cost}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <h3>Site Inspection</h3>
                                        <p><strong>Site Inspection:</strong> {formData.siteInspection}</p>
                                        <h3>Other Charges</h3>
                                        <p><strong>Other Charges:</strong> {formData.otherCharges}</p>
                                        <h3>Site Conditions</h3>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Description</th>
                                                    <th>UOM</th>
                                                    <th>Standard</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.siteConditions.map((condition, index) => (
                                                    <tr key={index}>
                                                        <td>{condition.description}</td>
                                                        <td>{condition.uom}</td>
                                                        <td>{condition.standard}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <h3>Specifications</h3>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th>Category Name</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.specifications.map((specification, index) => (
                                                    <tr key={index}>
                                                        <td>{specification.categoryName}</td>
                                                        <td>{specification.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button type="button" className={styles.printButton} onClick={printAsPdf}>Print as PDF</button>
                                    <button type="button" className={styles.printButton} onClick={viewAsPdf}>View as PDF</button>
                                    <button type="submit" className={styles.nextButton}>Submit</button>
                                </div>
                            )}
                            <div className={styles.formGroupBottom}>
                                {currentStep > 1 && <button type="button" className={styles.backButton} onClick={handleBack}>Back</button>}
                                {currentStep < steps.length ? (
                                    <button type="button" className={styles.nextButton} onClick={handleNext}>Next</button>
                                ) : null}
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>BOQ ID</th>
                        <th>Customer</th>
                        <th>Created By</th>
                        <th>Type</th>
                        <th>BOQ Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBoqs.map((boq, index) => (
                        <React.Fragment key={index}>
                            <tr onClick={() => toggleDetails(boq.boqId)} className={styles.boqRow}>
                                <td>{boq.boqId}</td>
                                <td>{boq.boqName}</td>
                                <td>{boq.createdBy}</td>
                                <td>{boq.type}</td>
                                <td>{boq.boqComments}</td>
                            </tr>
                            {expandedBoqId === boq.boqId && (
                                <tr className={styles.detailsRow}>
                                    <td colSpan="5">
                                        <div className={styles.boqDetails}>
                                            <h3>BOQ Details</h3>
                                            <p><strong>BOQ Name:</strong> {boq.boqName}</p>
                                            <p><strong>Customer:</strong> {getCustomerNameById(boq.customer)}</p>
                                            <p><strong>Type:</strong> {boq.type}</p>
                                            <p><strong>Comments:</strong> {boq.boqComments}</p>
                                            {/* Add more details as needed */}
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
        </div>
    );
}

export default BoqTable;
