import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { NumberFormat } from 'react-number-format';
import numberToWords from 'number-to-words';
import logo from './logo192.png'; // Add your logo path
import signature from './logo192.png'; // Add your signature image path

const convertNumberToWords = (amount) => {
  return numberToWords.toWords(amount) + ' only';
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  imagestyle:{
    width:50,
    height:50

  },
  details: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    margin: "10px 0",
    border: "1px solid #ccc",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12,
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
  items = items.map(item => {
    const netAmount = item.unitPrice * item.quantity - item.discount;
    const taxType = placeOfSupply === placeOfDelivery ? { CGST: 0.09, SGST: 0.09 } : { IGST: 0.18 };
    const taxAmount = placeOfSupply === placeOfDelivery
      ? { CGST: netAmount * 0.09, SGST: netAmount * 0.09 }
      : { IGST: netAmount * 0.18 };
    const totalAmount = netAmount + (taxType.CGST ? taxAmount.CGST + taxAmount.SGST : taxAmount.IGST);

    return { ...item, netAmount, taxType, taxAmount, totalAmount };
  });

  const totalRow = items.reduce((acc, item) => {
    acc.netAmount += item.netAmount;
    acc.taxAmount.CGST += item.taxAmount.CGST || 0;
    acc.taxAmount.SGST += item.taxAmount.SGST || 0;
    acc.taxAmount.IGST += item.taxAmount.IGST || 0;
    acc.totalAmount += item.totalAmount;
    return acc;
  }, { netAmount: 0, taxAmount: { CGST: 0, SGST: 0, IGST: 0 }, totalAmount: 0 });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.imagestyle} src={logo} />
          <Text>Tax Invoice/Bill of Supply/Cash Memo</Text>
          <Text>(Original for Recipient)</Text>
        </View>
        <View style={styles.details}>
          <Text>Sold By: {sellerDetails.name}</Text>
          <Text>{sellerDetails.address}</Text>
          <Text>PAN No: {sellerDetails.panNo}</Text>
          <Text>GST Registration No: {sellerDetails.gstNo}</Text>
        </View>
        <View style={styles.details}>
          <Text>Billing Address: {billingDetails.name}</Text>
          <Text>{billingDetails.address}</Text>
          <Text>State/UT Code: {billingDetails.stateCode}</Text>
        </View>
        <View style={styles.details}>
          <Text>Shipping Address: {shippingDetails.name}</Text>
          <Text>{shippingDetails.address}</Text>
          <Text>State/UT Code: {shippingDetails.stateCode}</Text>
        </View>
        <View style={styles.details}>
          <Text>Place of supply: {placeOfSupply}</Text>
          <Text>Place of delivery: {placeOfDelivery}</Text>
        </View>
        <View style={styles.details}>
          <Text>Order Number: {orderDetails.orderNo}</Text>
          <Text>Order Date: {orderDetails.orderDate}</Text>
        </View>
        <View style={styles.details}>
          <Text>Invoice Number: {invoiceDetails.invoiceNo}</Text>
          <Text>Invoice Date: {invoiceDetails.invoiceDate}</Text>
        </View>
        <View style={styles.details}>
          <Text>Reverse Charge: {reverseCharge}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Sl. No</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Description</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Unit Price</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Qty</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Net Amount</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Tax Rate</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Tax Type</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Tax Amount</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Total Amount</Text></View>
          </View>
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{index + 1}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.description}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.unitPrice.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.quantity}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.netAmount.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.taxRate}%</Text></View>
              <View style={styles.tableCol}>
                {item.taxType.CGST && <Text style={styles.tableCell}>CGST: {(item.taxAmount.CGST).toFixed(2)}, SGST: {(item.taxAmount.SGST).toFixed(2)}</Text>}
                {item.taxType.IGST && <Text style={styles.tableCell}>IGST: {(item.taxAmount.IGST).toFixed(2)}</Text>}
              </View>
              <View style={styles.tableCol}>
                {item.taxType.CGST && <Text style={styles.tableCell}>{(item.taxAmount.CGST + item.taxAmount.SGST).toFixed(2)}</Text>}
                {item.taxType.IGST && <Text style={styles.tableCell}>{(item.taxAmount.IGST).toFixed(2)}</Text>}
              </View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.totalAmount.toFixed(2)}</Text></View>
            </View>
          ))}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>TOTAL:</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{totalRow.netAmount.toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}></Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{(totalRow.taxAmount.CGST + totalRow.taxAmount.SGST + totalRow.taxAmount.IGST).toFixed(2)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{totalRow.totalAmount.toFixed(2)}</Text></View>
          </View>
        </View>
        <View style={styles.section}>
          <Text>Amount in Words: {convertNumberToWords(totalRow.totalAmount)}</Text>
        </View>
        <View style={styles.footer}>
          <Text>For {sellerDetails.name}:</Text>
          <Image style={styles.imagestyle} src={signatureImage} />
          <Text>Authorised Signatory</Text>
        </View>
      </Page>
    </Document>
  );
};

const App = () => {
  const sellerDetails = {
    name: "Varasiddhi Silk Exports",
    address: "* 75, 3rd Cross, Lalbagh Road, BENGALURU, KARNATAKA, 560027",
    panNo: "AACFV3325K",
    gstNo: "29AACFV3325K1ZY",
  };

  const placeOfSupply = "KARNATAKA";
  const billingDetails = {
    name: "Madhu B",
    address: "Eurofins IT Solutions India Pvt Ltd., 1st Floor, Maruti Platinum, Lakshminarayana Pura, AECS Layou, BENGALURU, KARNATAKA, 560037",
    stateCode: 29,
  };

  const shippingDetails = {
    name: "Madhu B",
    address: "Eurofins IT Solutions India Pvt Ltd., 1st Floor, Maruti Platinum, Lakshminarayana Pura, AECS Layou, BENGALURU, KARNATAKA, 560037",
    stateCode: 29,
  };

  const placeOfDelivery = "KARNATAKA";
  const orderDetails = {
    orderNo: "403-3225714-7676307",
    orderDate: "28.10.2019",
  };

  const invoiceDetails = {
    invoiceNo: "IN-761",
    invoiceDate: "28.10.2019",
  };

  const reverseCharge = "No";

  const items = [
    {
      description: "Varasiddhi Silks Men's Formal Shirt (SH-05-42, Navy Blue, 42)",
      unitPrice: 338.10,
      quantity: 1,
      discount: 0,
      taxRate: 18,
    },
    {
      description: "Varasiddhi Silks Men's Formal Shirt (SH-05-40, Navy Blue, 40)",
      unitPrice: 338.10,
      quantity: 1,
      discount: 0,
      taxRate: 18,
    },
  ];

  const signatureImage = signature;

  return (
    <PDFViewer width="100%" height="600">
      <Invoice
        sellerDetails={sellerDetails}
        placeOfSupply={placeOfSupply}
        billingDetails={billingDetails}
        shippingDetails={shippingDetails}
        placeOfDelivery={placeOfDelivery}
        orderDetails={orderDetails}
        invoiceDetails={invoiceDetails}
        reverseCharge={reverseCharge}
        items={items}
        signatureImage={signatureImage}
      />
    </PDFViewer>
  );
};

export default App;
