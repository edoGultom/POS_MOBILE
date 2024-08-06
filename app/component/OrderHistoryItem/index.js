import { BE_API_HOST } from '@env'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'
const CARD_WIDTH = Dimensions.get('window').width * 0.32;

const OrderHistoryItem = ({
    name,
    kind,
    link,
    price,
    qty,
    temperatur,
    ItemPrice,
    subKatgori
}) => {
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
            style={styles.CardLinearGradient}>
            <View style={styles.CardInfoContainer}>
                <View style={styles.CardImageInfoContainer}>
                    <Image source={{ uri: `${BE_API_HOST}/lihat-file/profile?path=${link}` }} style={styles.Image} />
                    <View>
                        <Text style={styles.CardTitle}>{name}</Text>
                        <Text style={styles.CardSubtitle}>{kind}</Text>
                    </View>
                </View>
                {/* <View>
                    <Text style={styles.CardCurrency}>
                        Rp <Text style={styles.CardPrice}>{ItemPrice.toLocaleString('id-ID')}</Text>
                    </Text>
                </View> */}
            </View>
            <View style={styles.CardTableRow}>
                <View style={styles.CardTableRow}>
                    <View style={styles.SizeBoxLeft}>
                        <Text
                            style={[
                                styles.SizeText,
                                {
                                    fontSize: FONTSIZE.size_16,
                                },
                            ]}>
                            {kind !== 'Makanan' ? temperatur : subKatgori}
                        </Text>
                    </View>
                    <View style={styles.PriceBoxRight}>
                        <Text style={styles.PriceCurrency}>
                            IDR
                            <Text style={styles.Price}> {price.toLocaleString('id-ID')}</Text>
                        </Text>
                    </View>
                </View>

                <View style={styles.CardTableRow}>
                    <Text style={styles.CardQuantityPriceText}>
                        X <Text style={styles.Price}>{qty}</Text>
                    </Text>
                    <Text style={styles.CardQuantityPriceText}>
                        IDR {(qty * price).toLocaleString('id-ID')}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    )
}

export default OrderHistoryItem

const styles = StyleSheet.create({
    CardQuantityPriceText: {
        flex: 1,
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
    PriceBoxRight: {
        backgroundColor: COLORS.primaryBlackHex,
        height: 45,
        flex: 1,
        borderTopRightRadius: BORDERRADIUS.radius_10,
        borderBottomRightRadius: BORDERRADIUS.radius_10,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: COLORS.primaryGreyHex,
    },
    PriceCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
    Price: {
        color: COLORS.primaryWhiteHex,
    },
    SizeBoxLeft: {
        backgroundColor: COLORS.primaryBlackHex,
        height: 45,
        flex: 1,
        borderTopLeftRadius: BORDERRADIUS.radius_10,
        borderBottomLeftRadius: BORDERRADIUS.radius_10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: COLORS.primaryGreyHex,
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.secondaryLightGreyHex,
    },
    CardTableRow: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    CardCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_20,
        color: COLORS.primaryOrangeHex,
    },
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryWhiteHex,
    },
    CardPrice: {
        color: COLORS.primaryWhiteHex,
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.secondaryLightGreyHex,
    },
    CardLinearGradient: {
        // gap: SPACING.space_20,
        // padding: SPACING.space_10,
        padding: SPACING.space_15,
        borderRadius: BORDERRADIUS.radius_25,
    },
    CardInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    CardImageInfoContainer: {
        flexDirection: 'row',
        gap: SPACING.space_20,
        alignItems: 'center',
    },
    Image: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        borderRadius: BORDERRADIUS.radius_15,
        marginBottom: SPACING.space_15,
    },
})