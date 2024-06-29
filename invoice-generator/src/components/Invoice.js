// src/components/Invoice.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import numToWords from 'num-to-words';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 150,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  col: {
    width: '48%',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#E4E4E4',
    textAlign: 'center',
    padding: 5,
    fontSize: 10,
  },
  tableCol: {
    width: '16%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    textAlign: 'center',
    padding: 5,
    fontSize: 10,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  total: {
    width: '25%',
    textAlign: 'right',
    paddingRight: 5,
  },
  signature: {
    marginTop: 30,
    textAlign: 'right',
  },
  signatureImage: {
    width: 100,
    height: 'auto',
  },
});

const Invoice = ({
  sellerDetails,
  placeOfSupply,
  billingDetails,
  shippingDetails,
  placeOfDelivery,
  orderDetails,
  invoiceDetails,
  reverseCharge,
  items,
  signatureImage,
}) => {
  const calculateNetAmount = (price, quantity, discount) => {
    return (price * quantity) - discount;
  };

  const calculateTaxAmount = (netAmount, taxRate) => {
    return netAmount * taxRate / 100;
  };

  const calculateTotalAmount = (netAmount, taxAmount) => {
    return netAmount + taxAmount;
  };

  const getAmountInWords = (amount) => {
    return numToWords(amount).toUpperCase();
  };

  const taxType = placeOfSupply === placeOfDelivery ? 'CGST & SGST' : 'IGST';
  const taxRate = placeOfSupply === placeOfDelivery ? 9 : 18;

  const totalNetAmount = items.reduce((sum, item) => sum + calculateNetAmount(item.unitPrice, item.quantity, item.discount), 0);
  const totalTaxAmount = items.reduce((sum, item) => {
    const netAmount = calculateNetAmount(item.unitPrice, item.quantity, item.discount);
    return sum + calculateTaxAmount(netAmount, item.taxRate);
  }, 0);
  const totalAmount = totalNetAmount + totalTaxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="path/to/logo.png" />
          <Text>Tax Invoice/Bill of Supply/Cash Memo</Text>
        </View>

        <Text style={styles.title}>Tax Invoice/Bill of Supply/Cash Memo</Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Sold By: {sellerDetails.name}</Text>
              <Text>Address: {sellerDetails.address}</Text>
              <Text>PAN No: {sellerDetails.pan}</Text>
              <Text>GST Registration No: {sellerDetails.gst}</Text>
            </View>
            <View style={styles.col}>
              <Text>Billing Address: {billingDetails.name}</Text>
              <Text>Address: {billingDetails.address}</Text>
              <Text>State/UT Code: {billingDetails.stateCode}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Shipping Address: {shippingDetails.name}</Text>
              <Text>Address: {shippingDetails.address}</Text>
              <Text>State/UT Code: {shippingDetails.stateCode}</Text>
            </View>
            <View style={styles.col}>
              <Text>Place of Supply: {placeOfSupply}</Text>
              <Text>Place of Delivery: {placeOfDelivery}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Order No: {orderDetails.orderNo}</Text>
              <Text>Order Date: {orderDetails.orderDate}</Text>
            </View>
            <View style={styles.col}>
              <Text>Invoice No: {invoiceDetails.invoiceNo}</Text>
              <Text>Invoice Date: {invoiceDetails.invoiceDate}</Text>
            </View>
          </View>
          <Text>Reverse Charge: {reverseCharge}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeader}>Unit Price</Text>
            <Text style={styles.tableColHeader}>Quantity</Text>
            <Text style={styles.tableColHeader}>Net Amount</Text>
            <Text style={styles.tableColHeader}>Tax Amount</Text>
            <Text style={styles.tableColHeader}>Total Amount</Text>
          </View>
          {items.map((item, index) => {
            const netAmount = calculateNetAmount(item.unitPrice, item.quantity, item.discount);
            const taxAmount = calculateTaxAmount(netAmount, item.taxRate);
            const totalAmount = calculateTotalAmount(netAmount, taxAmount);
            return (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{item.description}</Text>
                <Text style={styles.tableCol}>{item.unitPrice}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
                <Text style={styles.tableCol}>{netAmount.toFixed(2)}</Text>
                <Text style={styles.tableCol}>{taxAmount.toFixed(2)}</Text>
                <Text style={styles.tableCol}>{totalAmount.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.total}>Total Net Amount: {totalNetAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.total}>Total Tax Amount: {totalTaxAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.total}>Total Amount: {totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.total}>Amount in Words: {getAmountInWords(totalAmount)}</Text>
        </View>

        <View style={styles.signature}>
          <Text>For {sellerDetails.name}:</Text>
          <Image style={styles.signatureImage} src={signatureImage} />
          <Text>Authorized Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
