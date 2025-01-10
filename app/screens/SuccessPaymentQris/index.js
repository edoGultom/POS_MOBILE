import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IcPrint, IlSuccesFully } from '../../assets';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import * as Print from 'expo-print';
import { generateBill } from '../../pdf/generateBill';

const SuccessPaymentQris = ({ navigation, route }) => {
    const {
        data,
        redirect
    } = route.params;
    const printBill = async (data) => {
        try {
            await Print.printAsync({
                html: generateBill(data),
                options: {
                    orientation: "portrait",
                },
            });
        } catch (error) {
            console.error("Error saat mencetak:", error);
        }
    };
    const handleDone = () => {
        navigation.reset({ index: redirect.index, routes: [{ name: redirect.name }] })
    }
    return (
        <View style={styles.ScreenContainer}>
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', gap: 10, }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={styles.LottieAnimation} source={IlSuccesFully} autoPlay loop={true} />
                    <Text style={styles.successTitle}>Payment has been successfully</Text>
                </View>
            </View>
            <View style={{ marginTop: SPACING.space_32, flex: 1, flexDirection: 'column', gap: SPACING.space_10 }}>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={styles.title}>Payment Method</Text>
                    <Text style={styles.subTitle}>QRIS</Text>
                    <View style={styles.horizontalLine} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={styles.title}>Total Quantity</Text>
                    <Text style={styles.subTitle}>10</Text>
                    <View style={styles.horizontalLine} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={styles.title}>Total Bill</Text>
                    <Text style={styles.subTitle}>10</Text>
                    <View style={styles.horizontalLine} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={styles.title}>Cashier Name</Text>
                    <Text style={styles.subTitle}>EDO</Text>
                    <View style={styles.horizontalLine} />
                </View>
                <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', gap: 5 }}>
                    <Text style={styles.title}>Transaction Date</Text>
                    <Text style={styles.subTitle}>23 Januari 2025, 08:10</Text>
                    <View style={styles.horizontalLine} />
                </View>
            </View>
            <View style={{ flexDirection: "row", gap: SPACING.space_10, marginVertical: SPACING.space_18 }}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: BORDERRADIUS.radius_15, height: 50, backgroundColor: COLORS.primaryOrangeHex }} onPress={handleDone}>
                    <Text style={{ fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_semibold, color: COLORS.primaryWhiteHex }}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', gap: SPACING.space_8, alignItems: 'center', justifyContent: 'center', borderRadius: BORDERRADIUS.radius_15, height: 50, backgroundColor: COLORS.primaryWhiteHex }} onPress={() => printBill(data)}>
                    <IcPrint />
                    <Text style={{ fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_semibold, color: COLORS.secondaryBlackRGBA }}>Print</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
        paddingHorizontal: 20
    },
    LottieAnimation: {
        width: 200,
        height: 200,
    },
    successTitle: { justifyContent: 'center', alignItems: 'center', color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_18 },
    title: { color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_14 },
    subTitle: { color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, textTransform: 'capitalize' },
    horizontalLine: {
        width: '100%', // Adjust the width as needed
        height: 1, // Thickness of the line
        backgroundColor: 'gray', // Line color
        marginTop: SPACING.space_10
    },
});
export default SuccessPaymentQris;