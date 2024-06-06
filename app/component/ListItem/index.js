import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ImChocolate } from '../../assets'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'

const ListItem = (props) => {
    const { id, name, imagelink_square, kind, price } = props;

    function currencyFormat(num) {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }
    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}
                style={styles.ItemSingleLinearGradient}>
                <View>
                    <Image
                        source={ImChocolate}
                        style={styles.ItemSingleImage}
                    />
                </View>
                <View style={styles.ItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.ItemTitle}>Chocolate</Text>
                        <Text style={styles.ItemSubtitle}>Non Coffee</Text>
                        <Text style={styles.SizeCurrency}>
                            IDR <Text style={styles.SizePrice}>{currencyFormat(price)}</Text>
                        </Text>
                    </View>
                </View>

            </LinearGradient >
        </View >
    )
}

export default ListItem

const styles = StyleSheet.create({
    ItemSingleLinearGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.space_12,
        gap: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_25,
        marginHorizontal: SPACING.space_15,
        marginVertical: SPACING.space_10
    },
    ItemSingleImage: {
        height: 50,
        width: 50,
        borderRadius: BORDERRADIUS.radius_8,
    },

    SizeCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },

    SizePrice: {
        color: COLORS.primaryWhiteHex,
    },

    ItemSingleInfoContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'space-around',
    },

    ItemTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryWhiteHex,
    },

    ItemSubtitle: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_12,
        color: COLORS.secondaryLightGreyHex,
    },
})