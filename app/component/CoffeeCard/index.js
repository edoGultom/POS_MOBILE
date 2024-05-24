import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import BGIcon from '../BGIcon'
import CustomIcon from '../CustomIcon'

const CARD_WIDTH = Dimensions.get('window').width * 0.32;

const CoffeCard = ({ imagelink_square, name, kind, price, buttonPressHandler }) => {
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0.7 }}
            style={styles.CardLinearGradientContainer}
            colors={[COLORS.primaryBlackHex, COLORS.primaryOrangeHex]}>
            <View style={{ padding: SPACING.space_10, flex: 1, flexDirection: 'row', gap: SPACING.space_15 }}>
                <ImageBackground
                    source={imagelink_square}
                    style={styles.CardImageBG}
                    resizeMode="cover">
                    <View style={styles.CardRatingContainer}>
                        <CustomIcon
                            name={'star'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_16}
                        />
                        <Text style={styles.CardRatingText}>Coffee</Text>
                    </View>
                </ImageBackground>
                <View>
                    <Text style={styles.CardTitle}>{name}</Text>
                    <Text style={styles.CardSubtitle}>{kind}</Text>
                    <View style={styles.CardFooterRow}>
                        <Text style={styles.CardPriceCurrency}>
                            IDR <Text style={styles.CardPrice}>{price.price}</Text>
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => {
                    buttonPressHandler();
                }}
                style={{
                    backgroundColor: COLORS.primaryOrangeHex,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopRightRadius: BORDERRADIUS.radius_25,
                    borderBottomRightRadius: BORDERRADIUS.radius_25,
                    width: SPACING.space_20 * 3
                }}
            >

                <CustomIcon
                    name={'add'}
                    color={COLORS.primaryWhiteHex}
                    size={FONTSIZE.size_20}
                />
            </TouchableOpacity>
        </LinearGradient >
    )
}

export default CoffeCard

const styles = StyleSheet.create({
    CardLinearGradientContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: SPACING.space_15,
        borderRadius: BORDERRADIUS.radius_25,
        justifyContent: 'space-between',
    },
    CardImageBG: {
        width: CARD_WIDTH,
        height: CARD_WIDTH,
        borderRadius: BORDERRADIUS.radius_20,
        overflow: 'hidden',
    },
    CardRatingContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primaryBlackRGBA,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.space_10,
        paddingHorizontal: SPACING.space_15,
        position: 'absolute',
        borderBottomLeftRadius: BORDERRADIUS.radius_20,
        borderTopRightRadius: BORDERRADIUS.radius_20,
        top: 0,
        right: 0,
    },
    CardRatingText: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryWhiteHex,
        lineHeight: 22,
        fontSize: FONTSIZE.size_14,
    },
    CardTitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_20,
    },
    CardSubtitle: {
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_14,
    },
    CardFooterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.space_15,
    },
    CardPriceCurrency: {
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryOrangeHex,
        fontSize: FONTSIZE.size_18,
    },
    CardPrice: {
        color: COLORS.primaryWhiteHex,
    },
})