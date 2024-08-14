// Invoice.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        fontSize: 12,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    header: {
        fontSize: 14,
        marginBottom: 10,
    },
    item: {
        marginBottom: 5,
    },
});

const Invoice = ({ formData, getCustomerNameById }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Invoice Preview</Text>
                <Text style={styles.header}>BOQ Name: {formData.boqName}</Text>
                <Text style={styles.header}>Customer: {getCustomerNameById(formData.customer)}</Text>
                <Text style={styles.header}>Comments: {formData.boqComments}</Text>
                <Text style={styles.header}>Type: {formData.type}</Text>
                <Text style={styles.header}>Additional Info: {formData.additionalInfo}</Text>
                <Text style={styles.header}>Construction Details: {formData.constructionDetails}</Text>
                <Text style={styles.header}>Area: {formData.area}</Text>
                <Text style={styles.header}>Category: {formData.category}</Text>
                <Text style={styles.header}>Items:</Text>
                {formData.items.map((item, index) => (
                    <Text key={index} style={styles.item}>
                        {item.name}: {item.description}, Quantity: {item.quantity}, Rate: {item.rate}, Discount: {item.discount}, Cost: {item.cost}
                    </Text>
                ))}
                <Text style={styles.header}>Site Inspection: {formData.siteInspection}</Text>
                <Text style={styles.header}>Other Charges: {formData.otherCharges}</Text>
                <Text style={styles.header}>Site Conditions:</Text>
                {formData.siteConditions.map((condition, index) => (
                    <Text key={index} style={styles.item}>
                        {condition.description}, UOM: {condition.uom}, Standard: {condition.standard}
                    </Text>
                ))}
                <Text style={styles.header}>Specifications:</Text>
                {formData.specifications.map((specification, index) => (
                    <Text key={index} style={styles.item}>
                        {specification.categoryName}, {specification.description}
                    </Text>
                ))}
            </View>
        </Page>
    </Document>
);

export default Invoice;
