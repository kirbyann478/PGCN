import React from 'react';
import { Font, Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';

// Register a custom font with ExtraBold weight
Font.register({
    family: 'Montserrat',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTUHjIg1_i6t8kCHKm45_dJE3gTD_u50.woff2', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_cJD3gTD_u50.woff2', fontWeight: 'bold' },
        { src: 'https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_epG3gTD_u50.woff2', fontWeight: '900' } // Use "900" for Extra Bold
    ]
});

// Create styles
export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column', // Stack rows vertically
        backgroundColor: 'white',
        padding: 20,
    },
    row: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'center', // Center items in the row
        alignItems: 'center',
        width: '100%',
        marginBottom: 10, // Space between rows
        marginTop: 10, // Space between rows
    },
    section: {
        width: '30%', // Adjust width for equal spacing
        alignItems: 'center',
    },
    header: {
        width: '40%', // Adjust width to fit between logos
        textAlign: 'center',
        fontSize: 12,
    },
    DongLogo: {
        width: 80,
        height: 70,
    },
    CamNorteLogo: {
        width: 80,
        height: 70,
    },
    body: {
        textAlign: 'center',
        fontSize: 12,
        width: '100%', 
        padding: 10,
    },
    header1: {
        fontFamily: 'Montserrat',
        fontSize: 18,
        fontWeight: '900', 
        marginBottom: 15
    },
    header2: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '900', 
        marginBottom: 15
    },
    dateText: {
        fontSize: 12,
        fontWeight: 'bold', 
        marginBottom: 12
    },
    contentText: {
        fontSize: 12,
        fontWeight: 'bold', 
        marginBottom: 15,
        paddingRight: 40,
        paddingLeft: 40,
        textAlign: 'center' 
    }, 
    boldText: {
        fontWeight: 'bold' 
    },    
    amountText: {
        fontSize: 12,
        fontWeight: 'bold', 
        paddingRight: 40,
        paddingLeft: 40,
        textAlign: 'center', 
        marginBottom: 5
    },
    signatoryText: {
        fontSize: 12,
        fontWeight: 'bold', 
        paddingRight: 40,
        paddingLeft: 40,
        textAlign: 'right', 
        marginBottom: 5,
        marginTop: 40
    },
    signatoryPositionText: {
        fontSize: 12,
        fontWeight: 'bold', 
        paddingRight: 40,
        paddingLeft: 40,
        textAlign: 'right', 
        marginBottom: 5, 
        marginRight:  40
    },
});

export const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            
            {/* First Row - Header with Logos */}
            <View style={styles.row}>
                <View style={styles.section}>
                    <Image style={styles.DongLogo} src="/assets/img/cam_norte_logo.png" />
                </View>

                <View style={styles.header}>
                    <Text>Republic of the Philippines</Text>
                    <Text>Province of Camarines Norte</Text>
                    <Text>DAET</Text>
                </View>

                <View style={styles.section}>
                    <Image style={styles.CamNorteLogo} src="/assets/img/dong_tulong_logo.jpg" />
                </View>
            </View>

            {/* Second Row - Body */}
            <View style={styles.body}>
                <Text style={styles.header1}>OFFICE OF THE GOVERNOR</Text>
                <Text style={styles.header2}>GUARANTEE LETTER</Text>
                <Text style={styles.dateText}>February 24, 2025</Text>
                <Text style={styles.contentText}>
                    Respectfully referred to <Text style={styles.boldText}>Juan Dela Cruz</Text>, the herein attached approved request of 
                    MR./MS. <Text style={styles.boldText}>JUAN DELA CRUZ</Text> from Purok - 1, Barangay Camambugan, Daet, Camarines Norte 
                    for hospital bill assistance stated below:
                </Text>
                <Text style={styles.amountText}>
                    AMOUNT OF THE HOSPITAL BILL ASSISTANCE
                </Text> 
                <Text style={styles.amountText}>
                    P 5,000.00
                </Text>
                 
                <Text style={styles.signatoryText}>
                    HON. RICARTE R. PADILLA
                </Text>
                <Text style={styles.signatoryPositionText}>
                    Governor
                </Text>
            </View>

        </Page>
    </Document>
);
