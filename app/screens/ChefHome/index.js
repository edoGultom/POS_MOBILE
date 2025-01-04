import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import ItemOrderChef from './ItemOrderChef'

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
            console.log(formData, 'itemxxxxx')
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
        setIsVisible(true);
    };

    const closeModal = () => {
        setIsVisible(false);
    };

    const [contentHeight, setContentHeight] = useState(0);
    const handleHeight = useCallback(
        (event) => {
            // const height = event.nativeEvent.layout.height;
            setContentHeight(350); // Simpan tinggi total dari kon
        },
        [],
    )

    const renderItem = ({ item }) => {
        const itemState = expandedState[item.id];

        const animatedHeight = itemState?.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, contentHeight], // Sesuaikan tinggi konten Anda
        });
        if (!itemState) {
            return null; // Pastikan itemState terdefinisi
        }

        return <ItemOrderChef
            item={item}
            itemState={itemState}
            animatedHeight={animatedHeight}
            handleHeight={handleHeight}
            openModal={openModal}
            onProcess={onProcess}
            toggleContent={toggleContent}
            isVisible={isVisible}
        />
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
                            paddingHorizontal: 10,
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