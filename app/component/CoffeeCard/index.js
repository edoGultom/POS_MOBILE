import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../CustomIcon'
import { BE_API_HOST } from '@env'
import { Ionicons } from '@expo/vector-icons';
const CARD_WIDTH = Dimensions.get('window').width * 0.25;

const CoffeCard = ({ id, link, name, kind, price, buttonPressHandler }) => {
    const [checked, setChecked] = useState({
        label: 'HOT',
        value: price,
    });
    const Checkboxs = [
        {
            label: 'HOT',
            value: price
        },
        {
            label: 'COLD',
            value: kind === 'Coffee' ? price + 3000 : price + 2000
        },
    ]
    return (
        <LinearGradient
            key={id}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0.7 }}
            style={styles.CardLinearGradientContainer}
            colors={[COLORS.primaryBlackHex, COLORS.primaryOrangeHex]}>
            <View style={{ padding: SPACING.space_10, justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row', gap: SPACING.space_15 }}>
                <ImageBackground
                    source={{ uri: `${BE_API_HOST}/lihat-file/profile?path=${link}` }}
                    style={styles.CardImageBG}
                    resizeMode="cover">
                    <View style={styles.CardRatingContainer}>
                        <CustomIcon
                            name={'hand-holding-heart'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_16}
                        />
                    </View>
                </ImageBackground>
                <View>
                    <Text style={styles.CardTitle}>{name}</Text>
                    <Text style={styles.CardSubtitle}>{kind}</Text>
                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center'
                    }}>
                        {Checkboxs.map((item, idx) => (
                            <View style={{
                                marginTop: 5,
                                flexDirection: 'row',
                                gap: 8,
                                alignItems: 'center'
                            }}
                                key={idx}
                            >
                                <Pressable
                                    style={[styles.checkboxBase, checked && styles.checkboxChecked]}
                                    onPress={() => {
                                        if (checked.label === item.label) {
                                            setChecked({ label: '', value: '' });
                                        } else {
                                            setChecked({ label: item.label, value: item.value });
                                        }
                                    }}>
                                    {checked.label == item.label && <Ionicons name="checkmark" size={24} color="white" />}
                                </Pressable>
                                <Text style={{ color: COLORS.primaryWhiteHex }}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.CardFooterRow}>
                        <Text style={styles.CardPriceCurrency}>
                            IDR <Text style={styles.CardPrice}>{price.toLocaleString('id-ID')}</Text>
                        </Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => {
                    buttonPressHandler(checked);
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
                    name={'plus'}
                    color={COLORS.primaryWhiteHex}
                    size={FONTSIZE.size_18}
                />
            </TouchableOpacity>
        </LinearGradient >
    )
}

export default CoffeCard

const styles = StyleSheet.create({
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: COLORS.secondaryDarkGreyHex,
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: COLORS.primaryBlackRGBA,
    },
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
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        gap: SPACING.space_10,
        paddingHorizontal: SPACING.space_15,
        position: 'absolute',
        borderBottomRightRadius: BORDERRADIUS.radius_20,
        borderTopLeftRadius: BORDERRADIUS.radius_20,
        bottom: 0,
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