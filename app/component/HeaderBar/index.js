import { BE_API_HOST } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LogoJPG, ProfileDummy } from '../../assets';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { getData } from '../../utils';
import CustomIcon from '../CustomIcon';
import Popover from 'react-native-popover-view';

const HeaderBar = ({ title, onBack }) => {
    const navigation = useNavigation();
    const [photo, setPhoto] = useState(ProfileDummy);
    const [profile, setProfile] = useState(false);
    useEffect(() => {
        updateUserProfile();
    }, [title]);

    const updateUserProfile = () => {
        getData('userProfile').then((res) => {
            setProfile(res)
        });
    };

    const signOut = () => {
        AsyncStorage.multiRemove(['userProfile', 'token']).then(() => {
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
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
            {!onBack && (
                <View style={styles.Container}>
                    <Image source={LogoJPG} style={{ width: 120, height: 50, borderRadius: 5 }} />
                </View>
            )}

            <Text style={styles.HeaderText}>{title}</Text>
            <Text style={styles.subHeaderText}></Text>

            <Popover
                from={(
                    <TouchableOpacity>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={styles.ImageContainer}>
                                <Image
                                    source={photo}
                                    style={styles.Image}
                                />
                            </View>
                            <Text style={{ color: COLORS.secondaryLightGreyHex }}>Hi, {profile.username}</Text>
                        </View>
                    </TouchableOpacity>
                )}>
                <TouchableOpacity
                    onPress={signOut}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: SPACING.space_10, paddingHorizontal: SPACING.space_15, paddingVertical: SPACING.space_15 }}>
                        <CustomIcon
                            name={'logout'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_16}
                        />
                        <Text style={{ fontSize: 16, fontFamily: FONTFAMILY.poppins_light }}>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </Popover>

        </View>
    )
}

export default HeaderBar

const styles = StyleSheet.create({
    customTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customTitle: {
        fontSize: 16,
        color: 'black', // Customize the text color as needed
        marginLeft: 10, // Space between icon and text
    },
    back: {
        padding: SPACING.space_16,
        marginRight: SPACING.space_16,
        marginLeft: -10,
        backgroundColor: COLORS.secondaryDarkGreyHex,
        borderRadius: BORDERRADIUS.radius_10,
        marginLeft: SPACING.space_10
    },
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
        backgroundColor: 'yellow',
        height: 50,
        width: 50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: COLORS.secondaryDarkGreyHex,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexDirection: 'column'
        // backgroundColor: 'red',
    },
    Image: {
        height: 50,
        width: 50,
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
    subHeaderText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_20,
        color: COLORS.primaryWhiteHex,
    },
})