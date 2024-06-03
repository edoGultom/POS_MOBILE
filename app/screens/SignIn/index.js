import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../component/Button'
import TextInput from '../../component/TextInput'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { signInAction } from '../../redux/signInSlice'
import { useForm } from '../../utils'
import { Image } from 'expo-image'
import { IcLogo, LogoJPG } from '../../assets'

const SignIn = ({ navigation }) => {
    const [form, setForm] = useForm({
        username: '',
        password: '',
    });
    const dispatch = useDispatch();
    const onSubmit = () => {
        const obj = {
            form,
            navigation: navigation,
        };
        dispatch(signInAction(obj));

    };
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <View style={styles.HeaderContainer}>
                <Text style={styles.HeaderText}>Sign In</Text>
                <Text style={styles.HeaderTextSubtitle}>Find your best drink!</Text>
            </View>
            {/* <View style={{ marginTop: 0, marginBottom: 0 }}>
                <Image
                    style={{ width: 150, height: 100 }}
                    source={LogoJPG} />
            </View> */}
            <View style={styles.container}>
                <TextInput
                    label="Username"
                    placeholder="Type your username"
                    value={form.username}
                    onChangeText={value => setForm('username', value)}
                />
                <TextInput
                    label="Password"
                    placeholder="Type your password"
                    value={form.password}
                    onChangeText={(value) => setForm('password', value)}
                    secureTextEntry
                />
                <Button text="Sign In" onPress={onSubmit} />
                <Button
                    text="Create New Account"
                    color={COLORS.primaryLightGreyHex}
                    textColor={COLORS.primaryWhiteHex}
                    onPress={() => navigation.navigate('SignUp')}
                />
            </View>
        </View>
    )
}

export default SignIn

const styles = StyleSheet.create({
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
        paddingHorizontal: SPACING.space_15,
        paddingVertical: SPACING.space_15,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    container: {
        backgroundColor: COLORS.primaryBlackHex,
        paddingHorizontal: SPACING.space_24,
        paddingVertical: SPACING.space_24,
        marginTop: SPACING.space_24,
        flex: 1,
        gap: SPACING.space_16
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },
})