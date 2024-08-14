require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set the email and password for the admin user
const email = 'admin@housebanao.com';
const password = 'admin'; // Change this to a secure password

// Hash the password
const hashedPassword = bcrypt.hashSync(password, 10);

// Create a new admin user
const newAdmin = new Admin({ email, password: hashedPassword });

// Save the admin user to the database
newAdmin.save()
  .then(() => {
    console.log('Admin user created successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error creating admin user:', error);
    mongoose.connection.close();
  });
