import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { ImChocolate } from '../../assets'
import { LinearGradient } from 'expo-linear-gradient'
import { Image } from 'expo-image';
import CustomIcon from '../CustomIcon'

const OrderItem = () => {
    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
                style={styles.CartItemSingleLinearGradient}>
                {/* <View style={styles.CartItemRow}>
                    <Image source={ImChocolate} style={styles.CartItemImage} />
                    <View style={styles.CartItemInfo}>
                        <View>
                            <Text style={styles.CartItemTitle}>Chocolate</Text>
                            <Text style={styles.CartItemSubtitle}>
                                Non Coffee
                            </Text>
                        </View>
                        <View style={styles.CartItemRoastedContainer}>
                            <Text style={styles.CartItemRoastedText}>Robusta</Text>
                        </View>
                    </View>
                </View> */}
                <View>
                    <Image
                        source={ImChocolate}
                        style={styles.CartItemSingleImage}
                    />
                </View>
                <View style={styles.CartItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.CartItemTitle}>Chocolate</Text>
                        <Text style={styles.CartItemSubtitle}>Non Coffee</Text>
                    </View>
                    <View style={styles.CartItemSingleSizeValueContainer}>
                        <Text style={styles.SizeCurrency}>
                            IDR <Text style={styles.SizePrice}>12.000</Text>
                        </Text>
                    </View>
                    <View style={styles.CartItemSingleQuantityContainer}>
                        <TouchableOpacity
                            style={styles.CartItemIcon}
                        // onPress={() => {
                        //   decrementCartItemQuantityHandler(id, prices[0].size);
                        // }}
                        >
                            <CustomIcon
                                name="minus"
                                color={COLORS.primaryWhiteHex}
                                size={FONTSIZE.size_10}
                            />
                        </TouchableOpacity>
                        <View style={styles.CartItemQuantityContainer}>
                            <Text style={styles.CartItemQuantityText}>
                                3
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.CartItemIcon}
                        // onPress={() => {
                        //   incrementCartItemQuantityHandler(id, prices[0].size);
                        // }}
                        >
                            <CustomIcon
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
    CartItemSingleLinearGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.space_12,
        gap: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
        marginHorizontal: SPACING.space_15,
        marginVertical: SPACING.space_10
    },
    CartItemSingleImage: {
        height: 150,
        width: 150,
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    CartItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },
    CartItemLinearGradient: {
        flex: 1,
        gap: SPACING.space_12,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
    },
    CartItemRoastedContainer: {
        height: 50,
        width: 50 * 2 + SPACING.space_20,
        borderRadius: BORDERRADIUS.radius_15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryDarkGreyHex,
    },
    CartItemRoastedText: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_10,
        color: COLORS.primaryWhiteHex,
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