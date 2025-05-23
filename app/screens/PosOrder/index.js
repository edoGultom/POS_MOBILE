import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import useAxios from '../../api/useAxios';
import { IcNoMenu } from '../../assets';
import BottomSheetCustom from '../../component/BottomSheet';
import HeaderBar from '../../component/HeaderBar';
import OrderItem from '../../component/OrderItem';
import OrderSummary from '../../component/OrderSummary';
import PaymentFooter from '../../component/PaymentFooter';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { addOrder, decrementCartItemQuantity, incrementCartItemQuantity } from '../../redux/orderSlice';

const PosOrder = ({ route, navigation }) => {
    const { table } = route.params?.order;
    const { CartList } = useSelector(state => state.orderReducer);
    const [pembayaran, setPembayaran] = useState('cash')
    const ListRef = useRef();
    const dispatch = useDispatch();
    const totalBayar = CartList.reduce((acc, curr) => acc + (curr.harga + curr.harga_ekstra) * curr.qty, 0);
    const bottomSheetModalRef = useRef(null);
    const { fetchData: axiosBe } = useAxios();

    const incrementCartItemQuantityHandler = (id, temperatur) => {
        const data = { id, temperatur }
        dispatch(incrementCartItemQuantity(data))
    };
    const decrementCartItemQuantityHandler = (id, temperatur) => {
        const data = { id, temperatur }
        dispatch(decrementCartItemQuantity(data))
    };

    const renderItem = ({ item }) => {
        return (
            <OrderItem
                id={item.id}
                name={item.nama}
                link={item.path}
                kind={item.nama_kategori}
                price={item.harga}
                extraPrice={item.harga_ekstra}
                totalHarga={item.totalHarga}
                qty={item.qty}
                temperatur={item.temperatur}
                incrementCartItemQuantityHandler={
                    incrementCartItemQuantityHandler
                }
                decrementCartItemQuantityHandler={
                    decrementCartItemQuantityHandler
                }
            />
        );
    };

    const openModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // Fungsi untuk menutup BottomSheetModal
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);
    const onOrdered = () => {
        try {
            const formData = {
                table,
                status: 'ordered',
                ordered: CartList,
            }
            // console.log(formData, 'formData'); return
            const data = {
                formData,
                closeModal,
                axiosBe,
                navigation
            }
            dispatch(addOrder(data))
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Order Detail" onBack={() => navigation.goBack()} />
            {/* {isShowSuccess && (
                    <PopUpAnimation
                        style={styles.LottieAnimation}
                        source={IlSuccesFully}
                    />
                )} */}
            <View style={[styles.orderContainer, { marginBottom: SPACING.space_2 }]}>
                <View style={styles.orderItemFlatlist}>
                    <FlatList
                        ref={ListRef}
                        showsHorizontalScrollIndicator={false}
                        data={CartList}
                        contentContainerStyle={styles.FlatListContainer}
                        ListEmptyComponent={
                            <View style={styles.EmptyListContainer}>
                                <IcNoMenu />
                                <Text style={styles.EmptyText}>No Ordered Menu</Text>
                            </View>
                        }
                        keyExtractor={item => `${item.id}-${item.temperatur}`}
                        renderItem={renderItem}
                    />
                </View>
                <PaymentFooter
                    buttonPressHandler={() => openModal()}
                    buttonTitle="Checkout"
                    price={{
                        totalPesanan: CartList.reduce((sum, item) => sum + item.qty, 0),
                        totalBayar: totalBayar,
                        currency: 'Rp'
                    }}
                    pembayaran={pembayaran}
                    setPembayaran={setPembayaran}
                />
            </View>

            <BottomSheetCustom
                ref={bottomSheetModalRef}
                onClose={closeModal}
            >
                <OrderSummary
                    item={{
                        status: 'ordered',
                        table: table,
                        ordered: CartList
                    }}
                    onAddOrder={onOrdered}
                />
            </BottomSheetCustom>
        </View>
    )
}

export default PosOrder

const styles = StyleSheet.create({
    processBtnTitle: {
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_semibold,
        color: COLORS.primaryWhiteHex
    },
    processBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDERRADIUS.radius_15,
        height: 50,
        backgroundColor: COLORS.primaryOrangeHex
    },
    SizeText: {
        fontFamily: FONTFAMILY.poppins_medium,
    },
    KindOuterContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        gap: SPACING.space_15,
        paddingVertical: 10
    },
    KindBox: {
        flex: 1,
        backgroundColor: COLORS.secondaryDarkGreyHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: SPACING.space_24 * 2.5,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        elevation: 1
    },
    LottieAnimation: {
        flex: 1,
    },
    animation: {
        width: 90,
        height: 90,
        marginTop: -25,
    },
    qrContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        // alignItems: 'center',
        paddingVertical: SPACING.space_20,
        gap: SPACING.space_12
    },
    photoContainer: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: COLORS.primaryWhiteHex,
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        // backgroundColor: COLORS.primaryWhiteHex,
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