import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { FaAngleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './CustomerTable.module.css';
import axios from 'axios';

const initialFormData = {
    companyName: '',
    panNumber: '',
    typeOfBusiness: '',
    firmType: '',
    poc: {
        name: '',
        email: '',
        phone: ''
    },
    basicDetails: {
        addressLine1: '',
        addressLine2: '',
        pincode: '',
        country: '',
        city: '',
        state: ''
    },
    hasGst: false,
    gstNumber: '',
    paymentDetails: {
        paymentType: '',
        creditTimePeriod: '',
        creditAmountPercentage: '',
        creditAmount: '',
        paymentMode: '',
        amountPaid: '',
        comments: ''
    },
    stagesOfPaymentOrWorkDone: []
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ITEMS_PER_PAGE = 5;

function CustomerTable() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCustomerId, setExpandedCustomerId] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const [editingCustomerId, setEditingCustomerId] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [role, setRole] = useState('user');

    useEffect(() => {
        const storedPermissions = localStorage.getItem('permissions');
        const storedRole = localStorage.getItem('role');
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions));
        }
        if (storedRole) {
            setRole(storedRole);
        }
        fetchCustomers(1, searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1 });
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, []);

    const fetchCustomers = async (pageNumber, query) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/customers`, {
                params: { search: query, page: pageNumber, limit: ITEMS_PER_PAGE }
            });
            const newCustomers = response.data;

            // Remove duplicates
            const uniqueCustomers = [...new Map([...customers, ...newCustomers].map(customer => [customer._id, customer])).values()];

            if (pageNumber === 1) {
                setCustomers(uniqueCustomers);
            } else {
                setCustomers(prevCustomers => uniqueCustomers);
            }

            setHasMore(newCustomers.length === ITEMS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleObserver = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore) {
            setPage(prevPage => {
                const newPage = prevPage + 1;
                fetchCustomers(newPage, searchQuery);
                return newPage;
            });
        }
    };

    const validateAndLimitInput = (e) => {
        const cleanedValue = e.target.value.replace(/[^A-Za-z]/g, '');
        if (cleanedValue.length <= 50) {
            e.target.value = cleanedValue;
        } else {
            e.target.value = cleanedValue.slice(0, 50);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData((prevData) => ({
                ...prevData,
                [keys[0]]: {
                    ...prevData[keys[0]],
                    [keys[1]]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const validateStep1 = () => {
        let tempErrors = {};

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.companyName) tempErrors.companyName = "Customer Name is required";
        if (!formData.panNumber || !panRegex.test(formData.panNumber)) tempErrors.panNumber = "Valid PAN Number is required";
        if (!formData.typeOfBusiness) tempErrors.typeOfBusiness = "Partner Type is required";
        if (!formData.firmType) tempErrors.firmType = "Firm Type is required";
        if (!formData.poc.email || !emailRegex.test(formData.poc.email)) tempErrors.pocEmail = "Valid Email is required";
        if (!formData.poc.phone || !phoneRegex.test(formData.poc.phone)) tempErrors.pocPhone = "Valid Phone Number is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const validateStep2 = () => {
        let tempErrors = {};

        if (!formData.basicDetails.addressLine1) tempErrors.addressLine1 = "Address Line 1 is required";
        if (!formData.basicDetails.pincode) tempErrors.pincode = "Pincode is required";
        if (!formData.basicDetails.country) tempErrors.country = "Country is required";
        if (!formData.basicDetails.city) tempErrors.city = "City is required";
        if (!formData.basicDetails.state) tempErrors.state = "State is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const validateStep3 = () => {
        let tempErrors = {};

        if (!formData.paymentDetails.paymentType) tempErrors.paymentType = "Payment Type is required";
        if (!formData.paymentDetails.creditTimePeriod) tempErrors.creditTimePeriod = "Credit Time Period is required";
        if (!formData.paymentDetails.creditAmountPercentage) tempErrors.creditAmountPercentage = "Credit Amount Percentage is required";
        if (!formData.paymentDetails.creditAmount) tempErrors.creditAmount = "Credit Amount is required";
        if (!formData.paymentDetails.paymentMode) tempErrors.paymentMode = "Payment Mode is required";
        if (!formData.paymentDetails.amountPaid) tempErrors.amountPaid = "Amount Paid is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleNext = () => {
        let isValid = false;
        if (currentStep === 1) {
            isValid = validateStep1();
        } else if (currentStep === 2) {
            isValid = validateStep2();
        } else if (currentStep === 3) {
            isValid = validateStep3();
        }

        if (isValid) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleGoBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep3()) return;

        try {
            if (editingCustomerId) {
                // Update existing customer
                await axios.put(`${API_BASE_URL}/customers/${editingCustomerId}`, formData);
            } else {
                // Create new customer
                await axios.post(`${API_BASE_URL}/customers`, formData);
            }

            setCustomers([]);
            setPage(1);
            fetchCustomers(1, searchQuery);
            closeModal();
        } catch (error) {
            console.error('There was an error adding/updating the customer!', error);
        }
    };

    const openModal = (customer = null) => {
        if (customer) {
            setFormData(customer);
            setEditingCustomerId(customer._id);
        } else {
            setFormData(initialFormData);
            setEditingCustomerId(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(1);
        setFormData(initialFormData);
        setErrors({});
        setEditingCustomerId(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/customers/${id}`);
            setCustomers([]);
            setPage(1);
            fetchCustomers(1, searchQuery);
        } catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchClick = () => {
        setCustomers([]);
        setPage(1);
        fetchCustomers(1, searchQuery);
    };

    const toggleCustomerDetails = (customerId) => {
        setExpandedCustomerId(expandedCustomerId === customerId ? null : customerId);
    };

    const handleActionChange = async (e, customer) => {
        const action = e.target.value;
        try {
            await axios.patch(`${API_BASE_URL}/customers/${customer._id}/status`, { status: action });
            setCustomers([]);
            setPage(1);
            fetchCustomers(1, searchQuery);
        } catch (error) {
            console.error('Failed to update customer status:', error);
        }
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.poc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.panNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.poc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.poc.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <button type="button" className={styles.searchButton} onClick={handleSearchClick}>Search</button>
                </div>
                {(role === 'admin' || permissions.customer?.editor) && (
                    <button type="button" onClick={() => openModal()} className={styles.addCustomerButton}>+ Add Customer</button>
                )}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add Customer Modal"
                    className={styles.modal}
                    overlayClassName={styles.overlay}
                >
                    <div className={styles.modalContent}>
                        {currentStep === 1 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={closeModal} />
                                    <h2 className={styles.addCustomerHeading}>Add Customer</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Customer Name*</label>
                                            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} onInput={validateAndLimitInput} />
                                            {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>PAN Number*</label>
                                            <input type="text" name="panNumber" maxLength={10} style={{ textTransform: 'uppercase' }} value={formData.panNumber} onChange={handleChange} />
                                            {errors.panNumber && <p className={styles.error}>{errors.panNumber}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Partner Type*</label>
                                            <select name="typeOfBusiness" value={formData.typeOfBusiness} onChange={handleChange}>
                                                <option value="">Select Partner Type</option>
                                                <option value="Pvt. Ltd">Pvt. Ltd</option>
                                                <option value="LLP">LLP</option>
                                                <option value="Sole proprietorship">Sole proprietorship</option>
                                                <option value="Others">Others</option>
                                            </select>
                                            {errors.typeOfBusiness && <p className={styles.error}>{errors.typeOfBusiness}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Firm Type*</label>
                                            <select name="firmType" value={formData.firmType} onChange={handleChange}>
                                                <option value="">Select Firm Type</option>
                                                <option value="Contractor">Contractor</option>
                                                <option value="Retailer">Retailer</option>
                                                <option value="Wholesaler">Wholesaler</option>
                                                <option value="Manufacturer">Manufacturer</option>
                                            </select>
                                            {errors.firmType && <p className={styles.error}>{errors.firmType}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Name*</label>
                                            <input type="text" name="poc.name" maxLength={50} value={formData.poc.name} onChange={handleChange} />
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Email*</label>
                                            <input type="email" name="poc.email" maxLength={50} value={formData.poc.email} onChange={handleChange} />
                                            {errors.pocEmail && <p className={styles.error}>{errors.pocEmail}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Phone*</label>
                                            <input type="text" name="poc.phone" maxLength={10} value={formData.poc.phone} onChange={handleChange} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} />
                                            {errors.pocPhone && <p className={styles.error}>{errors.pocPhone}</p>}
                                        </div>
                                    </div>
                                </div>

                                <button type="button" onClick={handleNext} className={styles.nextButton}>Next</button>
                            </form>
                        )}
                        {currentStep === 2 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} />
                                    <h2 className={styles.addCustomerHeading}>Add Customer</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Address Line 1*</label>
                                            <input type="text" name="basicDetails.addressLine1" value={formData.basicDetails.addressLine1} onChange={handleChange} />
                                            {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Address Line 2</label>
                                            <input type="text" name="basicDetails.addressLine2" value={formData.basicDetails.addressLine2} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Pincode*</label>
                                            <input type="text" maxLength={6} name="basicDetails.pincode" value={formData.basicDetails.pincode} onChange={handleChange} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); }} />
                                            {errors.pincode && <p className={styles.error}>{errors.pincode}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Country*</label>
                                            <input type="text" name="basicDetails.country" value={formData.basicDetails.country} onChange={handleChange} />
                                            {errors.country && <p className={styles.error}>{errors.country}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>City*</label>
                                            <input type="text" name="basicDetails.city" value={formData.basicDetails.city} onChange={handleChange} />
                                            {errors.city && <p className={styles.error}>{errors.city}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>State*</label>
                                            <input type="text" name="basicDetails.state" value={formData.basicDetails.state} onChange={handleChange} />
                                            {errors.state && <p className={styles.error}>{errors.state}</p>}
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onClick={handleNext} className={styles.nextButton}>Next</button>
                            </form>
                        )}
                        {currentStep === 3 && (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGroupTop}>
                                    <FaAngleLeft className={styles.backIcon} onClick={handleGoBack} />
                                    <h2 className={styles.addCustomerHeading}>Add Customer</h2>
                                </div>
                                <div className={styles.formGroup}>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Payment Type*</label>
                                            <select name="paymentDetails.paymentType" value={formData.paymentDetails.paymentType} onChange={handleChange}>
                                                <option value="">Select Payment Type</option>
                                                <option value="NEFT">NEFT</option>
                                                <option value="RTGS">RTGS</option>
                                                <option value="Cheque">Cheque</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Others">Others</option>
                                            </select>
                                            {errors.paymentType && <p className={styles.error}>{errors.paymentType}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Credit Time Period*</label>
                                            <input type="text" name="paymentDetails.creditTimePeriod" value={formData.paymentDetails.creditTimePeriod} onChange={handleChange} />
                                            {errors.creditTimePeriod && <p className={styles.error}>{errors.creditTimePeriod}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Credit Amount Percentage*</label>
                                            <input type="text" name="paymentDetails.creditAmountPercentage" value={formData.paymentDetails.creditAmountPercentage} onChange={handleChange} />
                                            {errors.creditAmountPercentage && <p className={styles.error}>{errors.creditAmountPercentage}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Credit Amount*</label>
                                            <input type="text" name="paymentDetails.creditAmount" value={formData.paymentDetails.creditAmount} onChange={handleChange} />
                                            {errors.creditAmount && <p className={styles.error}>{errors.creditAmount}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumn}>
                                            <label>Payment Mode*</label>
                                            <input type="text" name="paymentDetails.paymentMode" value={formData.paymentDetails.paymentMode} onChange={handleChange} />
                                            {errors.paymentMode && <p className={styles.error}>{errors.paymentMode}</p>}
                                        </div>
                                        <div className={styles.formColumn}>
                                            <label>Amount Paid*</label>
                                            <input type="text" name="paymentDetails.amountPaid" value={formData.paymentDetails.amountPaid} onChange={handleChange} />
                                            {errors.amountPaid && <p className={styles.error}>{errors.amountPaid}</p>}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formColumnFull}>
                                            <label>Comments</label>
                                            <input type="text" name="paymentDetails.comments" value={formData.paymentDetails.comments} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formGroupBottom}>
                                    <button type="submit" className={styles.submitButton}>Submit</button>
                                </div>
                            </form>
                        )}
                    </div>
                </Modal>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Customer Id</th>
                        <th>Company Name</th>
                        <th>POC</th>
                        <th>PAN Number</th>
                        <th>Type Of Business</th>
                        <th>Firm Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((customer) => (
                        <React.Fragment key={customer._id}>
                            <tr 
                                onClick={() => toggleCustomerDetails(customer._id)}
                                className={customer.status === 'inactive' ? styles.inactiveCustomer : ''}
                            >
                                <td>{customer.customerId}</td>
                                <td>{customer.companyName}</td>
                                <td>{customer.poc.name}<br />{customer.poc.phone}<br />{customer.poc.email}</td>
                                <td>{customer.panNumber}</td>
                                <td>{customer.typeOfBusiness}</td>
                                <td>{customer.firmType}</td>
                                <td>
                                    {(role === 'admin' || permissions.customer?.editor) ? (
                                        <select className={styles.actionSelect} value={customer.status} onChange={(e) => handleActionChange(e, customer)}>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            </tr>
                            {expandedCustomerId === customer._id && (
                                <tr>
                                    <td colSpan="7">
                                        <div className={styles.detailsBox}>
                                            {(role === 'admin' || permissions.customer?.editor) && (
                                                <button onClick={(e) => { e.stopPropagation(); openModal(customer); }}>Edit</button>
                                            )}
                                            <p><strong>Address Line 1:</strong> {customer.basicDetails.addressLine1}</p>
                                            <p><strong>Address Line 2:</strong> {customer.basicDetails.addressLine2}</p>
                                            <p><strong>Pincode:</strong> {customer.basicDetails.pincode}</p>
                                            <p><strong>Country:</strong> {customer.basicDetails.country}</p>
                                            <p><strong>City:</strong> {customer.basicDetails.city}</p>
                                            <p><strong>State:</strong> {customer.basicDetails.state}</p>
                                            <p><strong>Has GST:</strong> {customer.hasGst ? 'Yes' : 'No'}</p>
                                            {customer.hasGst && <p><strong>GST Number:</strong> {customer.gstNumber}</p>}
                                            <h4>Payment Details:</h4>
                                            <p><strong>Payment Type:</strong> {customer.paymentDetails.paymentType}</p>
                                            <p><strong>Credit Time Period:</strong> {customer.paymentDetails.creditTimePeriod}</p>
                                            <p><strong>Credit Amount Percentage:</strong> {customer.paymentDetails.creditAmountPercentage}</p>
                                            <p><strong>Credit Amount:</strong> {customer.paymentDetails.creditAmount}</p>
                                            <p><strong>Payment Mode:</strong> {customer.paymentDetails.paymentMode}</p>
                                            <p><strong>Amount Paid:</strong> {customer.paymentDetails.amountPaid}</p>
                                            <p><strong>Comments:</strong> {customer.paymentDetails.comments}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div ref={loaderRef} className={styles.loader} />
        </div>
    );
}

export default CustomerTable;
