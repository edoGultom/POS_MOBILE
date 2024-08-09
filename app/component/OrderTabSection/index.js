import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HScrollView } from 'react-native-head-tab-view';
import { SceneMap, TabBar } from 'react-native-tab-view';
import { CollapsibleHeaderTabView } from 'react-native-tab-view-collapsible-header';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../api/useAxios';
import { COLORS, FONTFAMILY, FONTSIZE } from '../../config';
import { addLoading } from '../../redux/globalSlice';
import { getOrders, getReadyOrder, servedOrder } from '../../redux/orderSlice';
import ItemListOrder from '../ItemListOrder';
import ModalCustom from '../Modal';
// import { getInPastOrder, getInProgress } from '../../../redux/action';
// import { getData } from '../../../utils';
// import ItemListOrder from '../ItemListOrder';

const renderTabBar = (props) => (
    <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBarStyle}
        tabStyle={styles.tabStyle}
        renderLabel={({ route, focused }) => (
            <Text style={styles.tabText(focused)}>{route.title}</Text>
        )}
    />
);


const Ordered = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { fetchData: axiosBe } = useAxios();
    useEffect(() => {
        const param = { status: 'ordered', axiosBe };
        dispatch(addLoading(true));
        dispatch(getOrders(param));
    }, [])
    const { orders } = useSelector(state => state.orderReducer)
    // console.log(orders, 'data')
    return (
        <HScrollView index={0} vertival showsVerticalScrollIndicator={false}>
            <View style={styles.containerOrdered}>
                {orders && orders.map((order) => (
                    <ItemListOrder
                        key={order.id}
                        id={order.id}
                        orderDetail={order}
                        status={order.status}
                        name={order.meja.nomor_meja}
                        price={parseInt(order.total)}
                        qty={order.quantity}
                        type="ordered"
                        // image={order.}
                        onPress={() => {
                            return
                            navigation.navigate('OrderDetail', order)
                        }}
                    />
                ))}
            </View>
        </HScrollView>
    );
};

const ReadyOrder = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const { fetchData: axiosBe } = useAxios();
    const param = { status: 'ready', axiosBe };

    useEffect(() => {
        dispatch(addLoading(true));
        dispatch(getReadyOrder(param));
    }, [])
    const { readyOrders } = useSelector(state => state.orderReducer)
    // console.log(readyOrders, 'data')

    const openModal = (item) => {
        setIsVisible(true);
        setSelectedItem(item);
    };

    const closeModal = () => {
        setIsVisible(false);
    };
    const onServed = async (id) => {
        const item = readyOrders.find((item) => item.id == id);
        closeModal()
        try {
            const formData = {
                id_order: item.id,
            }
            // console.log(item, 'itemxxxxx')
            // return;
            await dispatch(servedOrder({ status: 'served', formData, axiosBe })).unwrap();
            getReadyOrder()
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            dispatch(getReadyOrder(param));
        }
    };
    return (
        <>
            <HScrollView index={0} vertival showsVerticalScrollIndicator={false}>
                <View style={styles.containerOrdered}>
                    {readyOrders && readyOrders.map((order) => (
                        <ItemListOrder
                            key={order.id}
                            id={order.id}
                            orderDetail={order}
                            status={order.status}
                            name={order.meja.nomor_meja}
                            price={parseInt(order.total)}
                            qty={order.quantity}
                            type="past_order"
                            isVisible={isVisible}
                            onPress={() => openModal(order)}
                        />
                    ))}
                </View>
                <ModalCustom visible={isVisible} onClose={closeModal} headerName={`Order #${selectedItem?.id}`}>
                    <Text style={{ fontSize: FONTSIZE.size_12, fontFamily: FONTFAMILY.poppins_medium }}>Apakah anda yakin pesanan sudah ready???</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.secondaryLightGreyHex }]} onPress={closeModal}>
                            <Text style={styles.buttonText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primaryOrangeHex }]} onPress={() => onServed(selectedItem?.id)}>
                            <Text style={styles.buttonText}>Ya</Text>
                        </TouchableOpacity>
                    </View>
                </ModalCustom>
            </HScrollView>

        </>
    );
};


const initialLayout = { width: Dimensions.get('window').width };

const OrderTabSection = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: '1', title: 'Running Order' },
        { key: '2', title: 'Ready Order' },
    ]);

    const renderScene = SceneMap({
        1: Ordered,
        2: ReadyOrder,
    });

    return (
        <CollapsibleHeaderTabView
            renderScrollHeader={() =>
                <View style={{ height: 1 }} />
            }
            makeHeaderHeight={() => 200}
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            scrollEnabled={false}
            style={{ backgroundColor: 'white' }}
        />
    );
};

export default OrderTabSection;

const styles = StyleSheet.create({
    indicator: {
        backgroundColor: COLORS.primaryOrangeHex,
        height: 3,
        width: '0.2%',
    },
    tabBarStyle: {
        backgroundColor: COLORS.secondaryBlackRGBA,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomColor: COLORS.secondaryLightGreyHex,
        borderBottomWidth: 1,
    },
    tabStyle: { width: 'auto' },
    tabText: (focused) => ({
        fontFamily: FONTFAMILY.poppins_medium,
        color: focused ? COLORS.primaryOrangeHex : COLORS.secondaryLightGreyHex,
    }),
    containerOrdered: { paddingTop: 8, paddingHorizontal: 24, backgroundColor: COLORS.primaryBlackHex, flex: 1 },
    containerPasOrder: { paddingTop: 8, paddingHorizontal: 24, backgroundColor: COLORS.primaryBlackHex, flex: 1 },
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
});
