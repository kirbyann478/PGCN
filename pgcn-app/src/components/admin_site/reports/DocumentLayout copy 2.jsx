import React from 'react';
import { Page, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';

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
        width: '100%', // Full width for text
        padding: 10,
        /* borderTopWidth: 1, */
        marginTop: 0,
    },
    header1: {
        fontSize: 18,
        fontWeight: 'extrabold', 
        marginBottom: 20
    },
    header2: {
        fontSize: 14,
        fontWeight: 'extrabold', 
        marginBottom: 20
    }
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
            </View>

        </Page>
    </Document>
);
