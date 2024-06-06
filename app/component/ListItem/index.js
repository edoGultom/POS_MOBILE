import { BE_API_HOST } from '@env'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomIcon from '../CustomIcon'

const ListItem = (props) => {
    const { name, uri, kind, price, onPress } = props;

    return (
        <View>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={[COLORS.primaryBlackHex, COLORS.primaryGreyHex]}
                style={styles.ItemSingleLinearGradient}>
                <View>
                    <Image
                        style={styles.ItemSingleImage}
                        source={{ uri: `${BE_API_HOST}/lihat-file/profile?path=${uri}` }}
                    />
                </View>
                <View style={styles.ItemSingleInfoContainer}>
                    <View>
                        <Text style={styles.ItemTitle}>{name}</Text>
                        <Text style={styles.ItemSubtitle}>{kind}</Text>
                        <Text style={styles.SizeCurrency}>
                            IDR <Text style={styles.SizePrice}>{price.toLocaleString('id-ID')}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.CartItemSingleQuantityContainer}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.CartItemIcon}
                        onPress={onPress}
                    >
                        <CustomIcon
                            name="trash-can"
                            color={COLORS.primaryRedHex}
                            size={FONTSIZE.size_18}
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
}

export default ListItem

const styles = StyleSheet.create({
    CartItemIcon: {
        backgroundColor: COLORS.primaryBlackRGBA,
        padding: SPACING.space_12,
        borderRadius: BORDERRADIUS.radius_10,
    },
    CartItemSingleQuantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
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