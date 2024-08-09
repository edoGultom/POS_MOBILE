import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef } from 'react'
import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import HeaderBar from '../../component/HeaderBar'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getOrders } from '../../redux/orderSlice'
import IcTableActive from '../../assets/Icon/IcTableActive'
import CustomIcon from '../../component/CustomIcon'
import { IcNoMenu } from '../../assets'

const Cashier = ({ navigation }) => {
    const CARD_WIDTH = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const { fetchData: axiosBe } = useAxios();
    const ListRef = useRef();
    const { orders } = useSelector(state => state.orderReducer)

    useEffect(() => {
        dispatch(getOrders({ status: 'served', axiosBe }))
    }, []);

    const getDataOrder = async () => {
        try {
            await dispatch(getOrders({ status: 'served', axiosBe })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    const renderItem = ({ item }) => {
        return (
            <View style={styles.OrderCard}>
                {/* UP */}
                <View style={{ padding: 5 }}>
                    <View style={{
                        // backgroundColor: 'red',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        {/* 1 */}
                        <View style={styles.OrderHeader1}>
                            <IcTableActive width={55} height={50} />
                        </View>
                        {/* 2 */}
                        <View style={styles.OrderHeader2}>
                            <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_regular }}>Table {item.meja.nomor_meja}</Text>
                            <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_18, fontFamily: FONTFAMILY.poppins_semibold }}>ORDER #{item.id}</Text>
                            <Text style={{ color: COLORS.secondaryGreyHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_light }}>{item.waktu}</Text>
                        </View>
                        {/* 3 */}
                        <View style={styles.OrderHeader3}>
                            <Text style={{ color: COLORS.secondaryDarkGreyHex, fontSize: FONTSIZE.size_18, fontFamily: FONTFAMILY.poppins_semibold }}>IDR {parseInt(item.total).toLocaleString('id-ID')}</Text>
                        </View>
                    </View>
                </View>

                {/* DOWN */}
                <View style={styles.OrderCardDown}>
                    <Text style={{ padding: 10, color: COLORS.secondaryDarkGreyHex, fontSize: FONTSIZE.size_18, fontFamily: FONTFAMILY.poppins_light }}>{item.order_detail.length} {item.order_detail.length > 1 ? 'Items' : 'Item'}</Text>
                    <Pressable
                        android_ripple={{
                            color: COLORS.primaryBlackRGBA,
                            borderless: false,
                            foreground: true,
                        }}
                        style={{
                            flexDirection: 'row',
                            width: 150,
                            padding: 15,
                            backgroundColor: COLORS.primaryOrangeHex,
                            borderRadius: 10
                        }}
                        onPress={() => navigation.navigate('CashierDetailOrder', item)}>
                        <Text style={{ color: COLORS.primaryWhiteHex, fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_medium }}>Lanjut Pembayaran</Text>
                        <CustomIcon
                            name={'arrow-right'}
                            color={COLORS.primaryWhiteHex}
                            size={FONTSIZE.size_18}
                        />
                    </Pressable>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
            <View style={styles.ContainerButtonRefresh}>
                <TouchableOpacity
                    activeOpacity={0.4}
                    onPress={() => getDataOrder()}
                >
                    <View style={styles.ButtonRefresh}>
                        <CustomIcon
                            name={'refresh'}
                            color={COLORS.primaryWhiteHex}
                            size={FONTSIZE.size_18}
                        />
                        <Text style={{ color: COLORS.primaryWhiteHex }}>Refresh</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {orders.length > 0 ? (
                <FlatList
                    ref={ListRef}
                    showsHorizontalScrollIndicator={false}
                    data={orders}
                    ListEmptyComponent={
                        <View style={styles.EmptyListContainer}>
                            <IcNoMenu />
                            <Text style={styles.EmptyText}>No Order Found!</Text>
                        </View>
                    }
                    keyExtractor={item => `${item.id}-${item.temperatur}`}
                    renderItem={renderItem}
                />
            ) :
                (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.EmptyListContainer}>
                            <IcNoMenu />
                            <Text style={styles.EmptyText}>No Order Found</Text>
                        </View>
                    </View>
                )}
        </View>

    )
}

export default Cashier

const styles = StyleSheet.create({
    ButtonRefresh: {
        backgroundColor: COLORS.primaryOrangeHex,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 2
    },
    ContainerButtonRefresh: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    EmptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_36 * 3.6,
        gap: SPACING.space_20
    },
    EmptyText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryLightGreyHex,
        marginBottom: SPACING.space_4,
    },
    OrderCardDown: {
        backgroundColor: COLORS.primaryWhiteHex,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: COLORS.primaryWhiteHex,

    },
    OrderHeader3: {
        // backgroundColor: 'grey',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
        alignItems: 'flex-end'
    },
    OrderHeader2: {
        // backgroundColor: 'blue',
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 'auto',
        paddingHorizontal: 10
    },
    OrderHeader1: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto',
    },
    OrderCard: {
        borderWidth: 1,
        borderColor: COLORS.primaryWhiteHex,
        backgroundColor: COLORS.primaryOrangeHex,
        flexDirection: 'column',
        // alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 15,
        // padding: 15,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        gap: SPACING.space_10
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },

})