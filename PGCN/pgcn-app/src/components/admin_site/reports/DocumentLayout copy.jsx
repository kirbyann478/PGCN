import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
export const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    section: {
        marginTop: 10,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        width: "60%", // Full width of the page
        height: 100, // Adjust height for debugging
        marginTop: 15,
        marginLeft: 0,
        padding: 10,
        flexGrow: 1,
        textAlign: 'center',
        fontSize: 12,
        alignItems: 'center', 
        justifyContent: 'center', // Center vertically
        borderWidth: 1, 
        /* borderColor: 'red',  */ 
    },
    DongLogo: {
        marginLeft: 20,
        width: 80,
        height: 70,
    },
    CamNorteLogo: {
        marginLeft: 0,
        width: 80,
        height: 70,
    },
});

export const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Image style={styles.DongLogo} src="/assets/img/dong_tulong_logo.jpg" />
            </View> 

            <View style={styles.header}>
                <Text>Republic of the Philippines</Text>
                <Text>Province of Camarines Norte</Text>
                <Text>Dong Tulong</Text> 
            </View> 

            <View style={styles.section}>
                <Image style={styles.CamNorteLogo} src="/assets/img/cam_norte_logo.png" />
            </View>
        </Page>
    </Document>
);
