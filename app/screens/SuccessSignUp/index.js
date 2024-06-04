import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Gap } from '../../components';
import { IlSuccess } from '../../assets/Ilustration';

const SuccessSignUp = ({ navigation }) => {
    return (
        <View style={styles.page}>
            <IlSuccess />
            <Gap height={30} />

            <Text style={styles.title}>Yeay! Completed</Text>

            <Gap height={6} />

            <Text style={styles.subTitle}>Now you are able to login</Text>
            <Text style={styles.subTitle}>some coffee for today's</Text>

            <Gap height={30} />

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
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        color: '#020202',
    },
    subTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Light',
        color: '#8D92A3',
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 80,
    },
});
