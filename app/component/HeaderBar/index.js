import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LogoJPG, ProfileDummy } from '../../assets';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';

const HeaderBar = ({ title }) => {

    return (
        <View style={styles.HeaderContainer}>
            <View style={styles.Container}>
                <Image source={LogoJPG} style={{ width: 100, height: 50, borderRadius: 5 }} />
            </View>
            <Text style={styles.HeaderText}>{title}</Text>
            <View style={styles.ImageContainer}>
                <Image
                    source={ProfileDummy}
                    style={styles.Image}
                />
            </View>
        </View>
    )
}

export default HeaderBar

const styles = StyleSheet.create({
    Container: {
        borderWidth: 2,
        borderColor: COLORS.secondaryDarkGreyHex,
        borderRadius: SPACING.space_12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.secondaryDarkGreyHex,
        overflow: 'hidden',
    },
    LinearGradientBG: {
        height: SPACING.space_36,
        width: SPACING.space_36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ImageContainer: {
        height: SPACING.space_36,
        width: SPACING.space_36,
        borderRadius: SPACING.space_12,
        borderWidth: 2,
        borderColor: COLORS.secondaryDarkGreyHex,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    Image: {
        height: SPACING.space_36,
        width: SPACING.space_36,
    },
    HeaderContainer: {
        // padding: SPACING.space_30,
        paddingTop: SPACING.space_36,
        paddingHorizontal: SPACING.space_15,
        paddingVertical: SPACING.space_15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    HeaderText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_20,
        color: COLORS.primaryWhiteHex,
    },
})