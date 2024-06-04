import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LogoJPG, ProfileDummy } from '../../assets';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import CustomIcon from '../CustomIcon';
import { getData } from '../../utils';
import { BE_API_HOST } from '@env';

const HeaderBar = ({ title, onBack }) => {
    const [photo, setPhoto] = useState(ProfileDummy);
    useEffect(() => {
        updateUserProfile();
    }, [title]);

    const updateUserProfile = () => {
        getData('userProfile').then((res) => {
            setPhoto({
                uri: `${BE_API_HOST}/lihat-file/profile?path=${res.profile_photo_path}`,
            });
        });
    };

    return (
        <View style={styles.HeaderContainer}>
            {onBack && (
                <Pressable
                    android_ripple={{
                        color: COLORS.primaryOrangeHex,
                        borderless: false,
                        foreground: true,
                    }}
                    style={styles.back}
                    onPress={onBack}>
                    <CustomIcon
                        name={'chevron-left'}
                        color={COLORS.primaryOrangeHex}
                        size={FONTSIZE.size_16}
                    />
                </Pressable>
            )}
            <View style={styles.Container}>
                <Image source={LogoJPG} style={{ width: 120, height: 50, borderRadius: 5 }} />
            </View>
            <Text style={styles.HeaderText}>{title}</Text>
            <View style={styles.ImageContainer}>
                <Image
                    source={photo}
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