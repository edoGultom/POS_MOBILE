import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { useNavigation } from '@react-navigation/native'

const IconTextView = ({ iconName, text, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.box,
                { borderColor: COLORS.primaryOrangeHex }
            ]}>

            <CustomIcon
                name={iconName}
                color={COLORS.primaryOrangeHex}
                size={FONTSIZE.size_30}
            />
            <Text
                style={[
                    styles.SizeText,
                    {
                        fontSize: FONTSIZE.size_18,
                    },
                    { color: COLORS.primaryOrangeHex }
                ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const Admin = () => {
    const navigation = useNavigation();
    const menus = [
        {
            key: 1,
            label: 'Menu',
            icon: 'pen-to-square',
            onPress: () => {
                navigation.navigate('AdminMenu')
            },
        },
        {
            key: 2,
            label: 'POS',
            icon: 'shop',
            onPress: (label) => {
                // setMenuIndex({ index: 2, menu: 'POS' });
                navigation.navigate('MainApp')
            },
        },
        {
            key: 3,
            label: 'Laporan',
            icon: 'print',
            onPress: () => {
                // setMenuIndex({ index: 3, menu: 'Laporan' });
            },
        },
        {
            key: 4,
            label: 'Riwayat',
            icon: 'chart-simple',
            onPress: () => {
                // setMenuIndex({ index: 4, menu: 'Riwayat' });
            },
        },

    ]
    // const [menuIndex, setMenuIndex] = useState({
    //     index: 0,
    //     menu: '',
    // });
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
            <View style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {
                    menus.map((item) => (
                        <IconTextView key={item.key} index={item.key} iconName={item.icon} text={item.label} onPress={item.onPress} />
                    ))
                }
            </View>


        </View>
    )
}

export default Admin

const styles = StyleSheet.create({
    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
    },

    text: {
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.secondaryLightGreyHex
    },

    box: {
        flexGrow: 1,
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlackRGBA,
        flexDirection: 'column',
        width: 100,
        height: 100,
        borderRadius: BORDERRADIUS.radius_20,
        borderWidth: 2,
        elevation: 1
    },
})