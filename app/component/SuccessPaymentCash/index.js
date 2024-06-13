import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { IlSuccesFully } from '../../assets'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE } from '../../config'
import LottieView from 'lottie-react-native';

const SuccessPaymentCash = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', gap: 10, }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <LottieView style={styles.LottieAnimation} source={IlSuccesFully} autoPlay loop={true} />
                <Text style={{ justifyContent: 'center', alignItems: 'center', color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_20, }}>Payment Success</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>PAYMENT METHOD</Text>
                <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>Cash</Text>
                <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>TOTAL PRICE</Text>
                <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>Rp 32.500</Text>
                <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>PAYMENT</Text>
                <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>Rp 32.500</Text>
                <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>PRICE RETURN</Text>
                <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>Rp 32.500</Text>
                <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_16, color: COLORS.secondaryLightGreyHex }}>TRANSACTION TIME</Text>
                <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, fontSize: FONTSIZE.size_14, color: COLORS.primaryWhiteHex }}>12 Mei, 11:20</Text>
                <View style={{ borderBottomColor: COLORS.primaryLightGreyHex, borderWidth: 2, height: 5 }} />
            </View>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', borderRadius: BORDERRADIUS.radius_15, height: 50, backgroundColor: COLORS.primaryOrangeHex }} onPress={() => navigation.reset({ index: 4, routes: [{ name: 'Admin' }] })}>
                <Text style={{ fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_semibold, color: COLORS.primaryWhiteHex }}>DONE</Text>
            </TouchableOpacity>
        </View >
    )
}

export default SuccessPaymentCash

const styles = StyleSheet.create({
    LottieAnimation: {
        width: 100,
        height: 100,
    },
})