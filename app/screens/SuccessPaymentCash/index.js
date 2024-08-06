import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IlSuccesFully } from '../../assets';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE } from '../../config';

const SuccessPaymentCash = ({ navigation, route }) => {
    const {
        cash,
        redirect
    } = route.params;

    const { tipe_pembayaran, jumlah, jumlah_diberikan, jumlah_kembalian, waktu_pembayaran } = cash;
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    const handleDone = () => {
        navigation.reset({ index: redirect.index, routes: [{ name: redirect.name }] })
    }
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', gap: 10, }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView style={styles.LottieAnimation} source={IlSuccesFully} autoPlay loop={true} />
                    <Text style={{ justifyContent: 'center', alignItems: 'center', color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_20, }}>Payment Success</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                </View>
                <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>PAYMENT METHOD</Text>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{tipe_pembayaran}</Text>
                    <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
                </View>
                <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>TOTAL PRICE</Text>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{formatCurrency(jumlah, 'IDR')}</Text>
                    <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
                </View>
                <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>PAYMENT</Text>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{formatCurrency(jumlah_diberikan, 'IDR')}</Text>
                    <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
                </View>
                <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>PRICE RETURN</Text>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{formatCurrency(jumlah_kembalian, 'IDR')}</Text>
                    <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
                </View>
                <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>TRANSACTION TIME</Text>
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{waktu_pembayaran}</Text>
                    <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
                </View>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: BORDERRADIUS.radius_15, height: 50, backgroundColor: COLORS.primaryOrangeHex }} onPress={handleDone}>
                    <Text style={{ fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_semibold, color: COLORS.primaryWhiteHex }}>DONE</Text>
                </TouchableOpacity>
            </View >
        </View>
    )
}

export default SuccessPaymentCash

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
})