import React from 'react';
import styles from './Form.module.css'; // Import your CSS module

function Form() {
  return (
    <div className={styles.formContainer}>
      <h3>Add Customers</h3>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="company-name">Company's Name*</label>
          <input type="text" id="company-name" name="company-name" placeholder='Company Name' required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="pan-no">Pan No.</label>
          <input type="text" id="pan-no" name="pan-no" placeholder='Pan No' className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="business-type">Type of Business</label>
          <select id="business-type" name="business-type" className={styles.select}>
            <option value="Contractors">Contractors</option>
            {/* Add more options if needed */}
          </select>
        </div>
      </div>
      <h3>POC Details</h3>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-name">Name</label>
          <input type="text" placeholder='Name' id="poc-name" name="poc-name" required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-email">Email</label>
          <input type="email" id="poc-email" name="poc-email" placeholder="example@gmail.com" className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-phone">Phone number</label>
          <input type="tel" id="poc-phone" name="poc-phone" placeholder="Enter phone number" className={styles.input} />
        </div>
      </div>
      <h3>Basic Details</h3>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.inputGroup}>
            <label htmlFor="address-line1">Address Line 1*</label>
            <input type="text" id="address-line1" name="address-line1" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="pincode">Pincode*</label>
            <input type="text" id="pincode" name="pincode" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="city">City*</label>
            <input type="text" id="city" name="city" required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone no.*</label>
            <input type="text" id="phone" name="phone" required className={styles.input} />
          </div>
          <button className={styles.addAddressBtn}>+ Add Address</button>
        </div>
        <div className={styles.column}>
          <div className={styles.inputGroup}>
            <label htmlFor="address-line2">Address Line 2</label>
            <input type="text" id="address-line2" name="address-line2" className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="country">Country</label>
            <input type="text" id="country" name="country" value="India" readOnly className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="state">State*</label>
            <select id="state" name="state" required className={styles.input}>
              <option value="">Choose state</option>
              {/* Add state options here */}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="gst-number">GST Number</label>
            <input type="text" id="gst-number" name="gst-number" className={styles.input} />
          </div>
        </div>
      </div>

      <h3>Payment Details</h3>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-name">Payment Type</label>
          <input type="text" placeholder='Credit' id="poc-name" name="poc-name" required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-email">Credit Time Period</label>
          <input type="email" id="poc-email" name="poc-email" placeholder="Enter Number of Days" className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-phone">%age of credit amount</label>
          <input type="tel" id="poc-phone" name="poc-phone" placeholder="60%" className={styles.input} />
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-phone">Credit amount</label>
          <input type="tel" id="poc-phone" name="poc-phone" placeholder="In numbers" className={styles.input} />
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-name">Payment Type</label>
          <input type="text" placeholder='Advance' id="poc-name" name="poc-name" required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-email">Payment Mode</label>
          <input type="email" id="poc-email" name="poc-email" placeholder="Select payment mode" className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-phone">%age amount paid</label>
          <input type="tel" id="poc-phone" name="poc-phone" placeholder="20%" className={styles.input} />
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-name">Amount Paid</label>
          <input type="text" placeholder='In numbers' id="poc-name" name="poc-name" required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-email">Add Comments</label>
          <input type="email" id="poc-email" name="poc-email" placeholder="Add comments" className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <input type="hidden" id="poc-email" name="poc-email" placeholder="Select payment mode" className={styles.input} />
        </div>
      </div>
      <button className={styles.addAddressBtn}>+ Add Payment</button>


      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-name">Payment Type</label>
          <input type="text" placeholder='Advance' id="poc-name" name="poc-name" required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-email">Payment Mode</label>
          <input type="email" id="poc-email" name="poc-email" placeholder="Select payment mode" className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-phone">%age amound paid</label>
          <input type="tel" id="poc-phone" name="poc-phone" placeholder="20%" className={styles.input} />
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-name">Amount Paid</label>
          <input type="text" placeholder='In numbers' id="poc-name" name="poc-name" required className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="poc-email">Comments</label>
          <input type="email" id="poc-email" name="poc-email" placeholder="Add comments" className={styles.input} />
        </div>
        <div className={styles.inputGroup}>
          <input type="hidden" id="poc-email" name="poc-email" placeholder="Select payment mode" className={styles.input} />
        </div>
      </div>
       <div className={styles.bottom}>
        <button className={styles.saveBtn}>Save</button>
      </div>
    </div>
  );
}

export default Form;
