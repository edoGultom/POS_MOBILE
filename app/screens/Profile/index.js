import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileDummy } from '../../assets';
import HeaderBar from '../../component/HeaderBar';
import ProfileTabSection from '../../component/ProfileTabSection';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { getData } from '../../utils';
import { BE_API_HOST } from '@env';

const Profile = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState({});
    useEffect(() => {
        navigation.addListener('focus', () => {
            updateUserProfile();
        });
    }, [navigation]);

    const updateUserProfile = () => {
        getData('userProfile').then((res) => {
            setUserProfile(res);
        });
    };

    return (
        <View style={styles.ScreenContainer}>
            <BottomSheetModalProvider>
                <StatusBar style='light' />
                <HeaderBar title="Profile" />

                <View style={styles.photo}>
                    <TouchableOpacity
                    //    onPress={updatePhoto}
                    >
                        <View style={styles.borderPhoto}>
                            <Image
                                source={{ uri: `${BE_API_HOST}/lihat-file/profile?path=${userProfile.profile_photo_path}` }}
                                // source={photo}
                                style={styles.photoContainer}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>
                    {userProfile.username}</Text>
                <Text style={styles.email}>{userProfile.email}</Text>

                <View style={styles.content}>
                    <ProfileTabSection />
                </View>
            </BottomSheetModalProvider>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    content: { flex: 1, marginTop: SPACING.space_24 },
    name: {
        fontSize: FONTSIZE.size_18,
        fontFamily: FONTFAMILY.poppins_medium,
        color: COLORS.primaryWhiteHex,
        textAlign: 'center',
    },
    email: {
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.secondaryLightGreyHex,
        textAlign: 'center',
    },
    photoContainer: {
        width: 90,
        height: 90,
        borderRadius: BORDERRADIUS.radius_25 * 3,
        backgroundColor: '#F0F0F0',
        padding: SPACING.space_24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    borderPhoto: {
        borderWidth: 1,
        borderColor: '#8D92A3',
        width: 110,
        height: 110,
        borderRadius: BORDERRADIUS.radius_25 * 4,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: { alignItems: 'center', marginTop: SPACING.space_24, marginBottom: SPACING.space_16 },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },

})