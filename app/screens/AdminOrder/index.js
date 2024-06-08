import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import HeaderBar from '../../component/HeaderBar';
import OrderItem from '../../component/OrderItem';
import PaymentFooter from '../../component/PaymentFooter';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';

const AdminOrder = () => {
    const { CartList } = useSelector(state => state.orderReducer);
    const ListRef = useRef();
    const totalBayar = CartList.reduce((acc, curr) => acc + curr.totalHarga, 0);
    console.log(totalBayar)
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
            // incrementCartItemQuantityHandler={
            //     incrementCartItemQuantityHandler
            // }
            // decrementCartItemQuantityHandler={
            //     decrementCartItemQuantityHandler
            // }
            />
        );
    };
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Orders Detail" />
            {/* <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.ScrollViewFlex}> */}
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
                    // buttonPressHandler={buttonPressHandler}
                    buttonTitle="Pay"
                    price={{ totalBayar: totalBayar, currency: 'IDR' }}
                />
            </View>

            {/* </ScrollView> */}
        </View>

    )
}

export default AdminOrder

const styles = StyleSheet.create({
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
    FlatListContainer: {
        gap: SPACING.space_10,
        paddingVertical: SPACING.space_20,
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