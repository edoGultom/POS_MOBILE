import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBar from '../../component/HeaderBar';
import OrderItem from '../../component/OrderItem';
import PaymentFooter from '../../component/PaymentFooter';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { addPembayaran, calculateCartPrice, decrementCartItemQuantity, incrementCartItemQuantity } from '../../redux/orderSlice';
import { getData, useForm } from '../../utils';

const AdminOrder = ({ navigation }) => {
    const { CartList } = useSelector(state => state.orderReducer);
    const [pembayaran, setPembayaran] = useState('cash')
    const ListRef = useRef();
    const dispatch = useDispatch();
    const totalBayar = CartList.reduce((acc, curr) => acc + curr.harga * curr.qty, 0);

    const incrementCartItemQuantityHandler = (id) => {
        dispatch(incrementCartItemQuantity(id))
    };
    const decrementCartItemQuantityHandler = (id) => {
        dispatch(decrementCartItemQuantity(id))
    };
    const renderItem = ({ item }) => {
        return (
            <OrderItem
                id={item.id}
                name={item.nama_barang}
                link={item.path}
                kind={item.nama_kategori}
                price={item.harga}
                totalHarga={item.totalHarga}
                qty={item.qty}
                incrementCartItemQuantityHandler={
                    incrementCartItemQuantityHandler
                }
                decrementCartItemQuantityHandler={
                    decrementCartItemQuantityHandler
                }
            />
        );
    };
    const buttonPressHandler = () => {
        getData('token').then((resToken) => {
            const data = {
                CartList,
                totalBayar,
                pembayaran,
                status: 'PENDING'
            }
            const token = resToken.value;
            const properties = { data, token };

            dispatch(addPembayaran(properties))
        });
        // navigation.push('Payment', { amount: CartPrice });
    };
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Order Detail" onBack={() => navigation.goBack()} />
            <View style={[styles.orderContainer, { marginBottom: SPACING.space_2 }]}>
                <View style={styles.orderItemFlatlist}>
                    <FlatList
                        ref={ListRef}
                        showsHorizontalScrollIndicator={false}
                        data={CartList}
                        contentContainerStyle={styles.FlatListContainer}
                        ListEmptyComponent={
                            <View style={styles.EmptyListContainer}>
                                <Text style={styles.EmptyText}>No Ordered Coffee</Text>
                            </View>
                        }
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                    />
                </View>
                <PaymentFooter
                    buttonPressHandler={buttonPressHandler}
                    buttonTitle="Bayar"
                    price={{
                        totalPesanan: CartList.reduce((sum, item) => sum + item.qty, 0),
                        totalBayar: totalBayar,
                        currency: 'IDR'
                    }}
                    pembayaran={pembayaran}
                    setPembayaran={setPembayaran}
                />
            </View>
        </View>

    )
}

export default AdminOrder

const styles = StyleSheet.create({
    EmptyListContainer: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        paddingVertical: SPACING.space_15,
    },
    EmptyText: {
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_16,
        color: COLORS.primaryLightGreyHex,
        marginBottom: SPACING.space_4,
    },
    FlatListContainer: {
        gap: SPACING.space_10,
        paddingVertical: SPACING.space_20,
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    orderItemFlatlist: {
        flex: 1,
    },
    orderContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
})