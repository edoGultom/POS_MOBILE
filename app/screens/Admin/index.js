import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { useNavigation } from '@react-navigation/native'

const IconTextView = ({ index, iconName, text, menuIndex, setMenuIndex, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            // onPress={() => {
            //     setMenuIndex({ index: index, menu: text });
            //     if (iconName === 'POS') {
            //         console.log(iconName, 'menuIndex')
            //         navigation.navigate('Home', item)
            //     }
            // }}
            style={[
                styles.box,
                menuIndex.index === index
                    ? { borderColor: COLORS.primaryOrangeHex } : {},
            ]}>

            <CustomIcon
                name={iconName}
                color={menuIndex.index === index
                    ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_30}
            />
            <Text
                style={[
                    styles.SizeText,
                    {
                        fontSize: FONTSIZE.size_18,
                    },
                    menuIndex.index === index
                        ? { color: COLORS.primaryOrangeHex } : { color: COLORS.primaryLightGreyHex },
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
                setMenuIndex({ index: 1, menu: 'Menu' });
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
                setMenuIndex({ index: 3, menu: 'Laporan' });
            },
        },
        {
            key: 4,
            label: 'Riwayat',
            icon: 'chart-simple',
            onPress: () => {
                setMenuIndex({ index: 4, menu: 'Riwayat' });
            },
        },

    ]
    const [menuIndex, setMenuIndex] = useState({
        index: 0,
        menu: 'Menu',
    });
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
            }}>
                {
                    menus.map((item) => (
                        <IconTextView key={item.key} index={item.key} iconName={item.icon} text={item.label} menuIndex={menuIndex} setMenuIndex={setMenuIndex} onPress={item.onPress} />
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    text: {
        marginLeft: 10,
        fontSize: 18,
        color: COLORS.secondaryLightGreyHex
    },
    KindOuterContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: SPACING.space_15,
        paddingVertical: SPACING.space_15,
        paddingHorizontal: SPACING.space_15,
        backgroundColor: 'red',
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