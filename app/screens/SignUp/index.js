import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../component/Button';
import CustomIcon from '../../component/CustomIcon';
import Select from '../../component/Select';
import TextInput from '../../component/TextInput';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { getRoles, signUpAction } from '../../redux/signUpSlice';
import { showMessage, useForm } from '../../utils';
import useAxios from '../../api/useAxios';

const SignUp = ({ navigation }) => {
    const [photo, setPhoto] = useState(null);
    const { roles } = useSelector(state => state.signUpReducer);
    const dispatch = useDispatch();
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        navigation.addListener('focus', () => {
            dispatch(getRoles())
        });
    }, [navigation]);

    const [form, setForm] = useForm({
        name: '',
        address: '',
        username: '',
        email: '',
        password: '',
        role: '',
    });
    const choosePhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });
        // console.log(result)
        if (!result.canceled) {
            // setPhoto(result.assets[0].uri);
            setPhoto(result);
        }
    };

    const onSubmit = () => {
        if (photo === null) {
            showMessage('Silahkan masukkan foto Anda!', 'danger');
            return;
        }
        const data = {
            form,
            navigation,
            photo,
            axiosBe
        };
        dispatch(signUpAction(data));
    };

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <View style={styles.HeaderContainer}>
                <Pressable
                    android_ripple={{
                        color: '#CFD2CF',
                        borderless: false,
                        foreground: true,
                    }}
                    style={styles.back}
                    onPress={() => navigation.goBack()}
                >
                    <CustomIcon
                        name={'chevron-left'}
                        color={COLORS.primaryLightGreyHex}
                        size={FONTSIZE.size_16}
                    />
                </Pressable>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.HeaderText}>Sign Up</Text>
                    <Text style={styles.HeaderTextSubtitle}>Register and continue!</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.photo}>
                        <View style={styles.borderPhoto}>
                            <Pressable
                                android_ripple={{
                                    color: 'rgb(224, 224, 224)',
                                    borderless: true,
                                    foreground: true,
                                }}
                                onPress={choosePhoto}
                                style={{
                                    height: 75,
                                    width: 75,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    elevation: 4,
                                }}>
                                {photo ? (
                                    <Image source={{ uri: photo.assets[0].uri }} style={styles.photoContainer} />
                                ) : (
                                    <View style={styles.photoContainer}>
                                        <CustomIcon
                                            name={'camera'}
                                            color={COLORS.primaryOrangeHex}
                                            size={FONTSIZE.size_16}
                                        />
                                        <Text style={styles.addPhoto}>
                                            Add Photo</Text>
                                    </View>
                                )}
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', paddingHorizontal: SPACING.space_15, gap: SPACING.space_20 }}>
                        <TextInput
                            label="Full Name"
                            placeholder="Type your full name"
                            value={form.name}
                            onChangeText={value => setForm('name', value)}
                        />
                        <TextInput
                            label="Address"
                            placeholder="Type your address"
                            value={form.address}
                            onChangeText={value => setForm('address', value)}
                        />
                        <TextInput
                            label="Username"
                            placeholder="Type your username"
                            value={form.username}
                            onChangeText={value => setForm('username', value)}
                        />
                        <Select
                            label="Role"
                            data={roles}
                            value={form.role}
                            onSelectChange={(value) => {
                                setForm('role', value)
                            }}
                        />
                        <TextInput
                            label="Email Address"
                            placeholder="Type your email address"
                            value={form.email}
                            onChangeText={value => setForm('email', value)}
                        />
                        <TextInput
                            label="Password"
                            placeholder="Type your password"
                            value={form.password}
                            onChangeText={value => setForm('password', value)}
                            secureTextEntry
                        />
                        <Button text="Register Now" onPress={onSubmit} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SignUp;

const styles = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },
    container: {
        backgroundColor: COLORS.primaryBlackHex,
        paddingTop: SPACING.space_20,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_24,
        marginTop: SPACING.space_10,
        flex: 1,
    },
    addPhoto: {
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryOrangeHex,
        textAlign: 'center',
    },
    photoContainer: {
        width: 90,
        height: 90,
        borderRadius: BORDERRADIUS.radius_10 * 9,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    borderPhoto: {
        borderWidth: 1,
        borderColor: COLORS.primaryOrangeHex,
        width: 110,
        height: 110,
        borderRadius: BORDERRADIUS.radius_10 * 10 + 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: {
        alignItems: 'center',
        marginBottom: SPACING.space_16,
    },
    HeaderText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_28,
        color: COLORS.primaryOrangeHex,
    },
    HeaderTextSubtitle: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.secondaryLightGreyHex,
    },
    HeaderContainer: {
        paddingTop: SPACING.space_36,
        paddingHorizontal: SPACING.space_24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: COLORS.secondaryBlackRGBA,
        gap: SPACING.space_10
    },
    back: {
        padding: 16,
        marginRight: 16,
        marginLeft: -10,
        backgroundColor: COLORS.secondaryDarkGreyHex,
        borderRadius: 10
    },
})