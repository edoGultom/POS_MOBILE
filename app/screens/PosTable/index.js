import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import { IcSmallTable, IlDisableTable } from '../../assets'
import IcTableActive from '../../assets/Icon/IcTableActive'
import Button from '../../component/Button'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addSelectedTableState, emptySelectedTable, emptyTables, getTables } from '../../redux/tableSice'
import { addToOrderHistoryListFromCart } from '../../redux/orderSlice'

const PosTable = ({ navigation }) => {
    const CARD_WIDTH = Dimensions.get('window').width;
    const tabBarHeight = useBottomTabBarHeight();
    const dispatch = useDispatch();
    const { tables, selectedTable } = useSelector(state => state.tablesReducer);
    const { fetchData: axiosBe } = useAxios();
    const slideAnim = useRef(new Animated.Value(0)).current;
    const slideUp = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0], // Adjust the 300 value to how far you want it to slide
    });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: (selectedTable.id !== null) ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [selectedTable.id !== null]);
    const getData = async () => {
        dispatch(addToOrderHistoryListFromCart())
        dispatch(emptyTables([]));
        dispatch(emptySelectedTable({ id: null, table: '', }));
        try {
            await dispatch(getTables(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Table List" />
            <Text style={styles.ScreenTitle}>
                Let's choose a table ,{'\n'}
                to get some food and drink
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}>
                <View style={{
                    // paddingVertical: 15,
                    // paddingHorizontal: 15,
                    flexDirection: 'row',
                    gap: 10,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    flex: 1,
                    marginBottom: tabBarHeight + 100
                }}>
                    {tables.length > 0 && tables.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            disabled={item.status === 'Occupied'}
                            onPress={() => {
                                dispatch(addSelectedTableState(item))
                            }}
                            style={[
                                styles.ContainerTable,
                                selectedTable.id === item.id
                                    ? { backgroundColor: COLORS.secondaryBlackRGBA, borderColor: COLORS.primaryOrangeHex } : { backgroundColor: COLORS.primaryBlackRGBA, borderColor: COLORS.secondaryLightGreyHex },
                                item.status === 'Occupied'
                                    ? { backgroundColor: COLORS.primaryDarkGreyHex, borderColor: COLORS.secondaryDarkGreyHex } : {},
                            ]}
                        >
                            <View style={[styles.ContainerTableNumber, { zIndex: 1 }]}>
                                {
                                    selectedTable && selectedTable.table === item.nomor_meja ?
                                        (
                                            <IcTableActive />
                                        ) :
                                        (
                                            <Image
                                                source={IlDisableTable}
                                                style={{ height: 147, width: 147 }}
                                            />
                                        )
                                }
                            </View>
                            <View style={[styles.ContainerTableNumber, { zIndex: 2 }]}>
                                <Text style={[
                                    styles.NameTable,
                                    selectedTable.id === item.id ?
                                        { color: COLORS.primaryOrangeHex } : { color: COLORS.secondaryLightGreyHex },
                                    item.status === 'Occupied' ?
                                        { transform: [{ rotate: '-45deg' }], color: COLORS.secondaryLightGreyHex, } : {}
                                ]}>
                                    {item.status === 'Occupied' ? item.status : item.nomor_meja}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            {
                selectedTable.id !== null && (
                    <Animated.View style={[{ transform: [{ translateY: slideUp }] }]}>
                        <View style={{
                            position: 'absolute',
                            bottom: tabBarHeight,
                            backgroundColor: COLORS.primaryOrangeHex,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: CARD_WIDTH,
                            gap: SPACING.space_10,
                            paddingVertical: SPACING.space_10,
                            paddingHorizontal: SPACING.space_10,
                            marginVertical: SPACING.space_10,
                        }}>
                            <View style={{ flexDirection: 'row', gap: SPACING.space_10 }}>
                                <IcSmallTable />
                                <Text style={{
                                    fontSize: FONTSIZE.size_14,
                                    fontFamily: FONTFAMILY.poppins_semibold
                                }}>Table <Text style={{
                                    marginLeft: 10,
                                    fontFamily: FONTFAMILY.poppins_semibold,
                                    color: COLORS.primaryWhiteHex
                                }}>
                                        {selectedTable.table}
                                    </Text>
                                </Text>
                            </View>
                            <Button
                                text="Select and Continue"
                                textColor={COLORS.primaryWhiteHex}
                                onPress={() => navigation.navigate('PosMenu')}
                                color={COLORS.secondaryBlackRGBA}
                            />
                        </View>
                    </Animated.View>
                )
            }

        </View >
    )
}

export default PosTable

const styles = StyleSheet.create({
    ScrollViewFlex: {
        flexGrow: 1,
    },
    ContainerTable: {
        width: 165,
        height: 164,
        borderRadius: BORDERRADIUS.radius_20 + 5,
        position: 'relative',
        borderWidth: 2,

    },
    ContainerTableNumber: {
        borderRadius: 10,
        position: 'absolute',
        top: 0, // Center vertically
        bottom: 0, // Center horizontally
        left: 0, // Center horizontally
        right: 0, // Center horizontally
        justifyContent: 'center',
        alignItems: 'center',
    },

    NameTable: {
        fontSize: FONTSIZE.size_18,
        fontFamily: FONTFAMILY.poppins_semibold,
    },

    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
    // ScreenTitle: {
    //     textAlign: 'center',
    //     fontSize: FONTSIZE.size_24,
    //     fontFamily: FONTFAMILY.poppins_semibold,
    //     color: COLORS.primaryWhiteHex,
    //     paddingLeft: SPACING.space_15,
    // },
    ScreenTitle: {
        fontSize: FONTSIZE.size_24,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex,
        paddingLeft: SPACING.space_15,
    },

})