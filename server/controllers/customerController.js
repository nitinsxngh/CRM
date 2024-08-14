const Customer = require('../models/Customers');

// Create a new customer
exports.createCustomer = async (req, res) => {
    const { panNumber, poc: { email, phone } } = req.body;

    try {
        const existingCustomer = await Customer.findOne({ $or: [{ panNumber }, { "poc.email": email }, { "poc.phone": phone }] });

        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer with this PAN number, email, or phone number already exists' });
        }

        const customer = new Customer(req.body);
        await customer.save();

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { customerId: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { "poc.name": { $regex: search, $options: 'i' } },
                    { "poc.email": { $regex: search, $options: 'i' } },
                    { "poc.phone": { $regex: search, $options: 'i' } },
                    { panNumber: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const customers = await Customer.find(query);
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer: ' + error.message });
    }
};

// Update customer status
exports.updateCustomerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const customer = await Customer.findByIdAndUpdate(id, { status }, { new: true });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update customer status: ' + error.message });
    }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update customer: ' + error.message });
    }
};
