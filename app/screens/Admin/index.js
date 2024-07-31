import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import axiosInstance from '../../api/useAxiosBackend'

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
                        padding: 3,
                        justifyContent: 'flex-end',
                        textAlign: 'center'
                    },
                    { color: COLORS.primaryOrangeHex }
                ]}>
                {text}
            </Text>
        </TouchableOpacity>
    );
}
const Admin = ({ navigation }) => {
    const navMenu = [
        {
            key: 1,
            label: 'Menu',
            icon: 'fastfood',
            onPress: () => {
                navigation.navigate('AdminMenu')
            },
        },
        {
            key: 2,
            label: 'Meja',
            icon: 'table-restaurant',
            onPress: () => {
                navigation.navigate('AdminTable')
            },
        },
        {
            key: 3,
            label: 'Daftar Bahan Baku',
            icon: 'edit-document',
            onPress: () => {
                navigation.navigate('AdminIngridients')
            },
        },
        {
            key: 4,
            label: 'Menu Bahan Baku',
            icon: 'restaurant-menu',
            onPress: () => {
                navigation.navigate('AdminMenuIngridients')
            },
        },
        {
            key: 5,
            label: 'POS',
            icon: 'point-of-sale',
            onPress: () => {
                navigation.navigate('MainAppAdmin')
            },
        },
        {
            key: 6,
            label: 'Laporan',
            icon: 'print',
            onPress: () => {
                navigation.navigate('AdminReport')
            },
        },
        {
            key: 7,
            label: 'Stok',
            icon: 'food-bank',
            onPress: () => {
                navigation.navigate('AdminStock')
            },
        },
        {
            key: 8,
            label: 'Riwayat',
            icon: 'history',
            onPress: () => {
                navigation.navigate('AdminHistory')
            },
        },
    ]
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
            <View style={styles.content}>
                <View style={styles.containerHeader}>
                    <View style={styles.circleParent}>
                        <View style={styles.circleChild}>
                            <Text style={styles.titleCircle}>Aplikasi Point Of Sales</Text>
                            <Text style={styles.SubTitleCircle}>Hi, admin</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.constainerMenu}>
                    <View style={{
                        paddingVertical: 15,
                        paddingHorizontal: 15,
                        flexDirection: 'row',
                        gap: 10,
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignContent: 'center',
                        flex: 1,
                    }}>
                        {
                            navMenu.map((item) => (
                                <IconTextView key={item.key} index={item.key} iconName={item.icon} text={item.label} onPress={item.onPress} />
                            ))
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Admin

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackRGBA,
        // gap: SPACING.space_2
    },
    SubTitleCircle: {
        fontSize: FONTSIZE.size_20,
        fontFamily: FONTFAMILY.poppins_light,
        color: COLORS.primaryWhiteHex,
        fontStyle: 'italic'
    },
    titleCircle: {
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex
    },
    circleParent: {
        height: '100%',
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 200,
        borderBottomEndRadius: 200,
        overflow: 'hidden',
    },
    circleChild: {
        flex: 1,
        transform: [{ scaleX: 0.5 }],
        backgroundColor: COLORS.primaryOrangeHex,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerHeader: {
        flex: 2,
        backgroundColor: COLORS.primaryBlackHex,
    },
    constainerMenu: {
        flex: 3,
        backgroundColor: COLORS.primaryBlackHex,
        paddingHorizontal: 15,
        paddingHorizontal: 15,
    },
    FlatListContainer: {
        gap: SPACING.space_15,
        paddingVertical: SPACING.space_20,
        flexGrow: 1,
    },
    EmptyListContainer: {
        width: Dimensions.get('window').width - SPACING.space_30 * 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_36 * 3.6,
    },
    EmptyText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryLightGreyHex,
        marginBottom: SPACING.space_4,
    },
    KindOuterContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: SPACING.space_15,
        paddingVertical: 10
    },
    KindBox: {
        flex: 1,
        backgroundColor: COLORS.primaryDarkGreyHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: SPACING.space_24 * 2.5,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        elevation: 1
    },
    titleMenuAdmin: {
        fontSize: FONTSIZE.size_20,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex,
    },
    containerMenuAdmin: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flex: 2,
    },
    ScreenContainer: {
        backgroundColor: COLORS.primaryOrangeHex,
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