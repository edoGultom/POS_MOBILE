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
import { getOrders, processOrder, readyOrder } from '../../redux/orderSlice'
import ModalCustom from '../../component/Modal'

const ChefHome = ({ navigation }) => {
    const CARD_WIDTH = Dimensions.get('window').width;
    const dispatch = useDispatch();
    const ListRef = useRef();
    const { orders } = useSelector(state => state.orderReducer)
    const [expandedState, setExpandedState] = useState({});
    const expandedKeys = Object.keys(expandedState).filter(key => expandedState[key].expanded);
    const [isVisible, setIsVisible] = useState(false);
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataOrder);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    useEffect(() => {
        const initialState = orders.reduce((acc, item) => {
            acc[item.id] = { expanded: false, animation: new Animated.Value(0) };
            return acc;
        }, {});
        setExpandedState(initialState);
    }, [orders]);

    const getDataOrder = async () => {
        try {
            await dispatch(getOrders({ status: 'ordered', axiosBe })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const toggleContent = (id) => {
        const newState = { ...expandedState };
        Object.keys(newState).forEach(key => {
            if (parseInt(key) === id) {
                newState[key].expanded = !newState[key].expanded;
            } else {
                newState[key].expanded = false;
            }
        });

        Object.keys(newState).forEach(key => {
            Animated.timing(newState[key].animation, {
                toValue: newState[key].expanded ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });

        setExpandedState(newState);
    };
    const onProcess = async (item) => {
        try {
            const formData = {
                id_order: item.id_pemesanan,
                id_order_detail: item.id,
                list_bahan_baku: item.menu.list_bahan_baku,
            }
            // console.log(formData, 'itemxxxxx')
            // return;
            await dispatch(processOrder({ status: 'in_progress', formData, axiosBe, getDataOrder })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    const onReady = async (id) => {
        const item = orders.find((item) => item.id == id);
        closeModal()
        try {
            const formData = {
                id_order: item.id,
            }
            // console.log(item, 'itemxxxxx')
            // return;
            await dispatch(readyOrder({ status: 'ready', formData, axiosBe })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            getDataOrder()
        }
    };
    const openModal = () => {
        // toggleContent(expandedKeys.join(', '))
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
    };
    console.log(expandedState, 'expandedState')
    console.log(expandedKeys, 'expandedKeys')
    const renderItem = ({ item }) => {
        const itemState = expandedState[item.id];
        if (!itemState) {
            return null; // Ensure itemState is defined before rendering
        }
        const animatedHeight = itemState.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300], // Sesuaikan tinggi konten Anda
        });
        return (
            <>
                <View style={{
                    borderWidth: 1,
                    borderColor: COLORS.primaryWhiteHex,
                    backgroundColor: COLORS.primaryLightGreyHex,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    borderTopStartRadius: 25,
                    borderTopEndRadius: 25,
                    zIndex: 1
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
                    <TouchableOpacity onPress={() => toggleContent(item.id)}
                        style={{
                            backgroundColor: COLORS.primaryOrangeHex,
                            position: 'absolute',
                            bottom: -14,
                            left: '50%',
                            borderRadius: 50,
                            zIndex: 2
                        }}>
                        <CustomIcon
                            name={itemState.expanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                            color={COLORS.primaryWhiteHex}
                            size={FONTSIZE.size_30}
                        />
                    </TouchableOpacity>
                </View>

                {
                    itemState.expanded && (
                        <Animated.View style={[{ height: animatedHeight }]}>
                            <View style={{
                                borderWidth: 1,
                                borderColor: COLORS.primaryWhiteHex,
                                backgroundColor: COLORS.secondaryDarkGreyHex,
                                flexDirection: 'column',
                                paddingHorizontal: 15,
                                paddingVertical: 15,
                                gap: SPACING.space_10,
                                borderBottomStartRadius: 25,
                                borderBottomEndRadius: 25,
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

                                {item.status === 'In Progress' && (//Button ketika seluruh pesanan di process
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <TouchableOpacity
                                            onPress={openModal}
                                            disabled={isVisible}
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 150,
                                                padding: 15,
                                                backgroundColor: COLORS.primaryOrangeHex,
                                                borderRadius: 10
                                            }}>
                                            <Text style={{ color: COLORS.primaryWhiteHex }}>Ready to Waiters</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </Animated.View>
                    )
                }
            </>
        )
    }

    return (
        <>
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
                        contentContainerStyle={{
                            marginTop: 12,
                            flexGrow: 1,
                            gap: SPACING.space_18,
                            paddingHorizontal: 15
                        }}
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

            <ModalCustom visible={isVisible} onClose={closeModal} headerName={`Order #${expandedKeys.join(', ')}`}>
                <Text style={{ fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_medium }}>Apakah anda yakin pesanan sudah ready???</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryLightGreyHex }]} onPress={closeModal}>
                        <Text style={styles.buttonText}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primaryOrangeHex }]} onPress={() => onReady(expandedKeys.join(', '))}>
                        <Text style={styles.buttonText}>Ya</Text>
                    </TouchableOpacity>
                </View>
            </ModalCustom>
        </>
    )
}

export default ChefHome

const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        margin: 5,
        borderRadius: 5,
        width: 70
    },
    buttonText: {
        color: COLORS.primaryWhiteHex,
        fontFamily: FONTFAMILY.poppins_regular
    },
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
        borderRadius: 8,
        flexDirection: 'row',
        gap: 2
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