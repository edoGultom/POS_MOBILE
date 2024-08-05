import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { HScrollView } from 'react-native-head-tab-view';
import { SceneMap, TabBar } from 'react-native-tab-view';
import { CollapsibleHeaderTabView } from 'react-native-tab-view-collapsible-header';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTFAMILY } from '../../config';
import { getOrders, getPasOrders } from '../../redux/orderSlice';
import useAxios from '../../api/useAxios';
import ItemListOrder from '../ItemListOrder';
import IcTableActive from '../../assets/Icon/IcTableActive';
import { addLoading } from '../../redux/globalSlice';
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
    const { orders } = useSelector(state => state.orderReducer)
    const [data, setData] = useState([])
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        if (data.length < 1) {
            const param = { status: 'ordered', axiosBe };
            dispatch(addLoading(true));
            dispatch(getOrders(param));
        }
    }, [data]);

    useEffect(() => {
        setData(orders)
        return () => {
            if (data) {
                setData([])
            }
        }
    }, [orders])

    return (
        <HScrollView index={0} vertival showsVerticalScrollIndicator={false}>
            <View style={styles.containerOrdered}>
                {data && data.map((order) => (
                    <ItemListOrder
                        key={order.id}
                        id={order.id}
                        orderDetail={order}
                        status={order.status}
                        name={order.meja.nomor_meja}
                        price={parseInt(order.total)}
                        qty={order.quantity}
                        type="ordered"
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

const PastOrder = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { pastOrders } = useSelector(state => state.orderReducer)
    const [dataPasOrder, setDataPasOrder] = useState([])
    const { fetchData: axiosBe } = useAxios();

    console.log(dataPasOrder, 'datx')
    useEffect(() => {
        if (!dataPasOrder) {
            const param = { status: 'paid', axiosBe };
            dispatch(addLoading(true));
            dispatch(getPasOrders(param));
        }
    }, [dataPasOrder]);

    useEffect(() => {
        setDataPasOrder(pastOrders)
        return () => {
            if (dataPasOrder) {
                setDataPasOrder([])
            }
        }
    }, [pastOrders])

    return (
        <HScrollView index={1} vertival showsVerticalScrollIndicator={false}>
            <View style={styles.containerPasOrder}>
                <Text>Past Order</Text>
                {pastOrders && pastOrders.map(order => {
                    return <ItemListOrder
                        key={order.id}
                        id={order.id}
                        orderDetail={order}
                        status={order.status}
                        name={order.meja.nomor_meja}
                        price={parseInt(order.total)}
                        qty={order.quantity}
                        type="past_order"
                        onPress={() => {
                            return
                            navigation.navigate('OrderDetail', order)
                        }}
                    />
                })}
            </View>
        </HScrollView>
    );
};


const initialLayout = { width: Dimensions.get('window').width };

const OrderTabSection = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: '1', title: 'Running Order' },
        { key: '2', title: 'Past Orders' },
    ]);

    const renderScene = SceneMap({
        1: Ordered,
        2: PastOrder,
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
});
