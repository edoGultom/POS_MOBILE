import { BE_API_HOST } from '@env'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'
import CustomIconFa6 from '../CustomIconFa6'

const OrderItem = ({
    id,
    key,
    name,
    link,
    kind,
    price,
    extraPrice,
    qty,
    temperatur,
    incrementCartItemQuantityHandler,
    decrementCartItemQuantityHandler
}) => {
    return (

        <View key={key}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
                style={styles.CartItemSingleLinearGradient}>
                <View>
                    <Image
                        source={{ uri: `${BE_API_HOST}/lihat-file/profile?path=${link}` }}
                        style={styles.CartItemSingleImage}
                    />
                </View>
                <View style={styles.CartItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.CartItemTitle}>{name}</Text>
                        <Text style={styles.CartItemSubtitle}>{kind}</Text>
                    </View>
                    <View style={styles.CartItemSingleSizeValueContainer}>
                        {temperatur !== '' && (
                            <View style={styles.SizeBox}>
                                <Text
                                    style={[
                                        styles.SizeText,
                                        {
                                            fontSize: FONTSIZE.size_12
                                        },
                                    ]}>
                                    {temperatur}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.SizeCurrency}>
                            IDR <Text style={styles.SizePrice}>{(price + extraPrice).toLocaleString('id-ID')}</Text>
                        </Text>
                    </View>
                    <View style={styles.CartItemSingleQuantityContainer}>
                        <TouchableOpacity
                            style={styles.CartItemIcon}
                            onPress={() => {
                                decrementCartItemQuantityHandler(id, temperatur);
                            }}
                        >
                            <CustomIconFa6
                                name="minus"
                                color={COLORS.primaryWhiteHex}
                                size={FONTSIZE.size_10}
                            />
                        </TouchableOpacity>
                        <View style={styles.CartItemQuantityContainer}>
                            <Text style={styles.CartItemQuantityText}>
                                {qty}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.CartItemIcon}
                            onPress={() => {
                                incrementCartItemQuantityHandler(id, temperatur);
                            }}
                        >
                            <CustomIconFa6
                                name="add"
                                color={COLORS.primaryWhiteHex}
                                size={FONTSIZE.size_10}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient >
        </View >
    )
}

export default OrderItem

const styles = StyleSheet.create({
    SizeBox: {
        backgroundColor: COLORS.primaryBlackHex,
        height: 40,
        width: 100,
        borderRadius: BORDERRADIUS.radius_10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.secondaryLightGreyHex,
    },
    CartItemSingleLinearGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.space_12,
        gap: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
        marginHorizontal: 15
    },
    CartItemSingleImage: {
        height: 140,
        width: 140,
        borderRadius: BORDERRADIUS.radius_20,
    },
    CartItemQuantityText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryWhiteHex,
    },
    CartItemQuantityContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        width: 80,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        borderColor: COLORS.primaryOrangeHex,
        alignItems: 'center',
        paddingVertical: SPACING.space_4,
    },
    CartItemIcon: {
        backgroundColor: COLORS.primaryOrangeHex,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
    CartItemSingleQuantityContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: 8
    },
    SizeCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
    SizePrice: {
        color: COLORS.primaryWhiteHex,
    },
    CartItemSingleSizeValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.space_10
    },
    CartItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
        gap: 10
        // backgroundColor: 'red'
    },

    CartItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryWhiteHex,
    },
    CartItemSubtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.secondaryLightGreyHex,
    },
    CartItemInfo: {
        flex: 1,
        paddingVertical: SPACING.space_4,
        justifyContent: 'space-between',
    },
    CartItemRow: {
        flexDirection: 'row',
        gap: SPACING.space_12,
        flex: 1,
    },
    CartItemImage: {
        height: 130,
        width: 130,
        borderRadius: BORDERRADIUS.radius_20,
    },
})