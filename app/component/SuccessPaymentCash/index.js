import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { IlSuccesFully } from '../../assets'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE } from '../../config'
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';

const SuccessPaymentCash = ({ navigation, route }) => {
    const { payment_method, jumlah, jumlah_diberikan, jumlah_kembalian, tanggal_pembayaran } = route.params;
    const date = new Date(tanggal_pembayaran);
    const formattedDate = format(date, "dd MMMM, HH:mm", { locale: id });

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    const handleDone = () => {
        navigation.reset({ index: 4, routes: [{ name: 'Admin' }] })
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
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{payment_method}</Text>
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
                    <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>{formattedDate}</Text>
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