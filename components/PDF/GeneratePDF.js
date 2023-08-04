// components/GeneratePDF.js
import React from 'react';
import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer';

const MyPDF = () => {
    return (
        <PDFViewer width="100%" height="500px">
            <Document>
                <Page size="A4">
                    <View>
                        <Text>Hello, this is a sample PDF generated with react-pdf!</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default MyPDF;
