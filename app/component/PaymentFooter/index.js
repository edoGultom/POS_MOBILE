import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'

const PaymentFooter = ({ price, buttonTitle }) => {
    return (
        <View style={styles.PriceFooter}>
            <View style={styles.PriceContainer}>
                <Text style={styles.PriceTitle}>Total Price</Text>
                <Text style={styles.PriceText}>
                    {price.currency} <Text style={styles.Price}>{price.totalBayar}</Text>
                </Text>
            </View>
            <TouchableOpacity
                disabled={price.totalBayar === 0}
                style={[styles.PayButton, (price.totalBayar === 0) ? { backgroundColor: COLORS.secondaryLightGreyHex } : {}]}
                onPress={() => buttonPressHandler()}>
                <CustomIcon
                    name={'sack-dollar'}
                    color={COLORS.primaryBlackRGBA}
                    size={FONTSIZE.size_30}
                />
                <Text style={styles.ButtonText}>{buttonTitle}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default PaymentFooter

const styles = StyleSheet.create({
    PriceFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.space_20,
        padding: SPACING.space_20,
    },
    PriceContainer: {
        alignItems: 'center',
        width: 150,
    },
    PriceTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.secondaryLightGreyHex,
    },
    PriceText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_24,
        color: COLORS.primaryOrangeHex,
    },
    Price: {
        color: COLORS.primaryWhiteHex,
    },
    PayButton: {
        backgroundColor: COLORS.primaryOrangeHex,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: SPACING.space_36 * 2,
        borderRadius: BORDERRADIUS.radius_20,
    },
    ButtonText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryWhiteHex,
    },
})