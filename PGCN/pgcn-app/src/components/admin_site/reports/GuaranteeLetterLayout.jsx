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

// Ensure images are accessible via absolute URLs or imported
import camNorteLogo from '/assets/img/cam_norte_logo.png'; // Ensure correct path
import dongTulongLogo from '/assets/img/dong_tulong_logo.jpg'; // Ensure correct path
import sampleSignature from '/assets/img/sample_signature.png'; // Ensure correct path

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
    },
    section: {
        width: '30%',
        alignItems: 'center',
    },
    header: {
        width: '40%',
        textAlign: 'center',
        fontSize: 12,
    },
    logo: {
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
        textAlign: 'center', 
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
        paddingRight: 45,
        paddingLeft: 40,
        textAlign: 'right', 
        marginBottom: 5, 
        marginRight:  40, 
    },
    signature: {
        width: 150,
        height: 80,
        alignSelf: 'center',
        marginTop: -80,
        marginLeft: 300,
    }
});

const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const GuaranteeLetterLayout = ({patientFirstName, patientMiddleName, patientLastName, patientExtName, claimantFirstName, claimantMiddleName, claimantLastName, claimantExtName, patientPurok, patientBarangay, patientMunicipality, patientProvince, claimantAmount}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            
            {/* First Row - Header with Logos */}
            <View style={styles.row}>
                <View style={styles.section}>
                    <Image style={styles.logo} src={camNorteLogo} />
                </View>

                <View style={styles.header}>
                    <Text>Republic of the Philippines</Text>
                    <Text>Province of Camarines Norte</Text>
                    <Text>DAET</Text>
                </View>

                <View style={styles.section}>
                    <Image style={styles.logo} src={dongTulongLogo} />
                </View>
            </View>

            {/* Second Row - Body */}
            <View style={styles.body}>
                <Text style={styles.header1}>OFFICE OF THE GOVERNOR</Text>
                <Text style={styles.header2}>GUARANTEE LETTER</Text>
                <Text style={styles.dateText}>{currentDate}</Text>
                <Text style={styles.contentText}>
                    Respectfully referred to <Text style={styles.boldText}>{patientFirstName} {patientMiddleName} {patientLastName}</Text>, the herein attached approved request of 
                    MR./MS. <Text style={styles.boldText}>{claimantFirstName} {claimantMiddleName} {claimantLastName}</Text> from Purok - {patientPurok}, Barangay {patientBarangay}, {patientMunicipality}, {patientProvince} for hospital bill assistance stated below:
                </Text>
                <Text style={styles.amountText}>
                    AMOUNT OF THE HOSPITAL BILL ASSISTANCE
                </Text> 
                <Text style={styles.amountText}>
                    P {Number(claimantAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </Text>
                 
                <Text style={styles.signatoryText}>
                    HON. RICARTE R. PADILLA
                </Text>
                <Text style={styles.signatoryPositionText}>
                    Governor
                </Text>

                <Image style={styles.signature} src={sampleSignature} />
            </View>


            {/* Breaker */}

            <View style={styles.body}>
                <Text styles={styles.header}>
                    ------------------------------------------------------------------------------------------------------
                </Text>
            </View>
            
            
            {/* First Row - Header with Logos */}
            <View style={styles.row}>
                <View style={styles.section}>
                    <Image style={styles.logo} src={camNorteLogo} />
                </View>

                <View style={styles.header}>
                    <Text>Republic of the Philippines</Text>
                    <Text>Province of Camarines Norte</Text>
                    <Text>DAET</Text>
                </View>

                <View style={styles.section}>
                    <Image style={styles.logo} src={dongTulongLogo} />
                </View>
            </View>

            {/* Second Row - Body */}
            <View style={styles.body}>
                <Text style={styles.header1}>OFFICE OF THE GOVERNOR</Text>
                <Text style={styles.header2}>GUARANTEE LETTER</Text>
                <Text style={styles.dateText}>{currentDate}</Text>
                <Text style={styles.contentText}>
                    Respectfully referred to <Text style={styles.boldText}>{patientFirstName} {patientMiddleName} {patientLastName}</Text>, the herein attached approved request of 
                    MR./MS. <Text style={styles.boldText}>{claimantFirstName} {claimantMiddleName} {claimantLastName}</Text> from Purok - {patientPurok}, Barangay {patientBarangay}, {patientMunicipality}, {patientProvince} 
                    for hospital bill assistance stated below:
                </Text>
                <Text style={styles.amountText}>
                    AMOUNT OF THE HOSPITAL BILL ASSISTANCE
                </Text> 
                <Text style={styles.amountText}>
                    P {Number(claimantAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </Text>
                 
                <Text style={styles.signatoryText}>
                    HON. RICARTE R. PADILLA
                </Text>
                <Text style={styles.signatoryPositionText}>
                    Governor
                </Text>

                <Image style={styles.signature} src={sampleSignature} />
            </View>

        </Page>
    </Document>
);
