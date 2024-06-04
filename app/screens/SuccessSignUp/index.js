import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { IlSuccess } from '../../assets/Ilustration';
import Button from '../../component/Button';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { StatusBar } from 'expo-status-bar';

const SuccessSignUp = ({ navigation }) => {
    return (
        <View style={styles.page}>
            <StatusBar style='light' />
            <Image
                source={IlSuccess}
                style={styles.image}
            />
            <Text style={[styles.title, { marginTop: SPACING.space_10 }]}>Yeay! Completed</Text>

            <Text style={styles.subTitle}>Now you are able to login</Text>
            <Text style={[styles.subTitle, { marginBottom: SPACING.space_30 }]}>some coffee for today's</Text>
            <View style={styles.buttonContainer}>
                <Button
                    text="Continue"
                    onPress={() =>
                        navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] })
                    }
                />
            </View>
        </View>
    );
};

export default SuccessSignUp;

const styles = StyleSheet.create({
    image: {
        width: 350,
        height: 250,
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primaryBlackHex
        // backgroundColor: COLORS.primaryOrangeHex
    },
    title: {
        fontSize: FONTSIZE.size_28,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.primaryWhiteHex,
        marginBottom: SPACING.space_2 * 3
    },
    subTitle: {
        fontSize: FONTSIZE.size_14,
        fontFamily: 'Poppins-Light',
        color: COLORS.primaryWhiteHex
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: SPACING.space_20 * 4,
    },
});
