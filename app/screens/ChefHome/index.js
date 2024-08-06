import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import { IcNoMenu } from '../../assets'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ItemListOrder from '../../component/ItemListOrder'
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getOrders, processOrder } from '../../redux/orderSlice'

const ChefHome = ({ navigation }) => {
    const CARD_WIDTH = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const ListRef = useRef();
    const { orders } = useSelector(state => state.orderReducer)
    const [isExpanded, setIsExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const animatedHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 300], // Sesuaikan tinggi konten Anda
    });

    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataOrder);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getDataOrder = async () => {
        try {
            await dispatch(getOrders({ status: 'ordered', axiosBe })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isExpanded]);

    const toggleContent = (item) => {
        setIsExpanded(!isExpanded);
    };
    const onProcess = async (item) => {
        try {
            const formData = {
                id_order: item.id_pemesanan,
                id_order_detail: item.id,
                list_bahan_baku: item.menu.list_bahan_baku,
            }
            console.log(formData, 'itemxxxxx')
            // return;
            await dispatch(processOrder({ status: 'in_progress', formData, axiosBe, getDataOrder })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    // console.log(orders, 'orders')

    const renderItem = ({ item }) => {
        // console.log(item, 'itemx')
        return (
            <View style={styles.Content}>
                <View style={{ position: 'relative' }}>
                    <View style={{
                        backgroundColor: COLORS.primaryLightGreyHex,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25
                    }}>
                        <View style={{
                            // backgroundColor: 'red',
                            gap: 4
                        }}>
                            <Text style={styles.HeaderName}>Order-ID : #{item.id}</Text>
                            <Text style={styles.HeaderName}>Table : {item.meja.nomor_meja}</Text>
                        </View>
                        <View style={{
                            // backgroundColor: 'yellow',
                            gap: 4,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end'
                        }}>
                            <Text style={styles.HeaderName}>Waktu : {item.waktu}</Text>
                            <Text style={styles.HeaderName}>Waiter : {item.pelayan}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={toggleContent}
                        style={{
                            backgroundColor: COLORS.secondaryBlackRGBA,
                            position: 'absolute',
                            bottom: -14,
                            alignSelf: 'center',
                            borderRadius: 50,
                            zIndex: 2
                        }}>
                        <CustomIcon
                            name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                            color={COLORS.primaryWhiteHex}
                            size={FONTSIZE.size_30}
                        />
                    </TouchableOpacity>
                </View>
                {isExpanded && (
                    <Animated.View style={[{ height: animatedHeight }]}>
                        <View style={{
                            backgroundColor: COLORS.secondaryBlackRGBA,
                            flexDirection: 'column',
                            paddingHorizontal: 15,
                            paddingVertical: 15,
                            gap: SPACING.space_10
                        }}>
                            {item.order_detail.map((detail, idx) => (//content order detail
                                <ItemListOrder
                                    key={idx}
                                    name={detail.menu.nama}
                                    type="chef_detail_order"
                                    price={detail.menu.harga}
                                    priceExtra={detail.menu.harga_ekstra}
                                    temperatur={detail.temperatur}
                                    image={detail.menu.path}
                                    qty={detail.quantity}
                                    bahanBaku={detail.menu.list_bahan_baku}
                                    status={detail.status}
                                    onProcess={() => onProcess(detail)}
                                />
                            ))}

                            {item.status == 'In Progress' && (//Button ketika seluruh pesanan di process
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={toggleContent}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 100,
                                            padding: 15,
                                            backgroundColor: COLORS.primaryOrangeHex,
                                            borderRadius: 10
                                        }}>
                                        <Text style={{ color: COLORS.primaryWhiteHex }}>Ready</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                )}
            </View>
        )
    }
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar />
            <Text style={styles.HeaderText}>Welcome to kitchen Chef!</Text>
            <View style={styles.ContainerButtonRefresh}>
                <TouchableOpacity
                    activeOpacity={0.4}
                    onPress={() => getDataOrder()}
                >
                    <View style={styles.ButtonRefresh}>
                        <Text>Refresh</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {orders.length > 0 ? (
                <FlatList
                    ref={ListRef}
                    contentContainerStyle={{ flexGrow: 1 }}
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

export default ChefHome

const styles = StyleSheet.create({
    ContainerButtonRefresh: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
    },
    ButtonRefresh: {
        backgroundColor: COLORS.primaryOrangeHex,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderRadius: 8
    },
    DetailLabel: {
        fontFamily: FONTFAMILY.poppins_regular,
        fontSize: FONTSIZE.size_14,
        color: COLORS.primaryOrangeHex,
        marginBottom: 8,
    },
    EmptyListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.space_36 * 3.6,
        gap: SPACING.space_20
    },

    HeaderName: {
        color: COLORS.primaryWhiteHex,
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_light
    },
    Content: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
        // backgroundColor: COLORS.secondaryBlackRGBA
    },
    ScreenContainer: {
        flex: 1,
        // backgroundColor: COLORS.secondaryLightGreyHex,
        backgroundColor: COLORS.primaryBlackHex,
    },
    HeaderText: {
        paddingHorizontal: 20,
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_18,
        color: COLORS.primaryOrangeHex,
    },
})