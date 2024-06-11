import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import HeaderBar from '../../component/HeaderBar';
import OrderItem from '../../component/OrderItem';
import PaymentFooter from '../../component/PaymentFooter';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { addPembayaran, addStateMidtrans, addToOrderHistoryListFromCart, batalPembayaran, calculateCartPrice, decrementCartItemQuantity, incrementCartItemQuantity, successPembayaran } from '../../redux/orderSlice';
import { getData, useForm } from '../../utils';
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import BottomSheetCustom from '../../component/BottomSheet';
import QRCode from 'react-native-qrcode-svg';
import Button from '../../component/Button';
import CountdownTimer from '../../component/CountdownTimer';
import EventStatusChecker from '../../component/EventStatusChecker';
import { BE_API_HOST } from '@env';
import { IlQris, IlSuccesFully } from '../../assets';
import LottieView from 'lottie-react-native';
import PopUpAnimation from '../../component/PopUpAnimation';

const AdminOrder = ({ navigation }) => {
    const { CartList, Midtrans } = useSelector(state => state.orderReducer);
    const [pembayaran, setPembayaran] = useState('cash')
    const ListRef = useRef();
    const dispatch = useDispatch();
    const bottomSheetModalRef = useRef(null);
    const totalBayar = CartList.reduce((acc, curr) => acc + curr.harga * curr.qty, 0);
    const [showAnimation, setShowAnimation] = useState(false);

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
                metode_pembayaran: pembayaran,
                status: 'PENDING'
            }
            const token = resToken.value;
            const properties = { data, token };
            dispatch(addPembayaran(properties))
        });
    };
    useEffect(() => {
        if (Midtrans !== null) openModal();
    }, [Midtrans])

    const openModal = () => {
        bottomSheetModalRef.current.present();
    };
    const closeModal = () => {
        bottomSheetModalRef.current.dismiss();
    };
    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                // disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );
    const handleSuccess = () => {
        closeModal();
        setShowAnimation(true);
        setTimeout(() => {
            setShowAnimation(false);
            dispatch(addStateMidtrans(null))
            dispatch(addToOrderHistoryListFromCart())
            navigation.reset({ index: 4, routes: [{ name: 'Admin' }] });
        }, 2000);
    }
    const FormComponent = ({ dataMidtrans }) => {
        const expiryTime = dataMidtrans.expiry_time;
        const orderId = dataMidtrans.order_id;
        const apiUrl = `${BE_API_HOST}/verify/isfinish?orderId=${orderId}`

        return (
            <View style={{ marginBottom: 5, gap: 20 }}>
                <View style={styles.qrContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                        <Text style={{ fontSize: FONTSIZE.size_20, color: COLORS.secondaryLightGreyHex }}>Scan this QR code to customer</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: 250, height: 300, gap: 10, borderRadius: BORDERRADIUS.radius_15 }}>
                            <Image
                                source={IlQris}
                                style={{ height: 50, width: 200, margin: 0 }}
                            />
                            <QRCode
                                value={dataMidtrans.qr_string}
                                size={200}
                                logoBackgroundColor='transparent'
                            />
                        </View>
                    </View>

                    {
                        expiryTime && (
                            <>
                                <CountdownTimer targetDate={expiryTime} />
                                <EventStatusChecker apiUrl={apiUrl} handleSuccess={handleSuccess} />
                            </>
                        )
                    }
                </View>
            </View>
        );
    }
    return (
        <BottomSheetModalProvider>
            <View style={styles.ScreenContainer}>
                <StatusBar style='light' />
                {showAnimation ? (
                    <PopUpAnimation
                        style={styles.LottieAnimation}
                        source={IlSuccesFully}
                    />
                )
                    : (
                        <></>
                    )}
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
                {Midtrans && (
                    <BottomSheetCustom
                        ref={bottomSheetModalRef}
                        backdropComponent={renderBackdrop}
                        enablePanDownToClose={false} // Disable swipe down to close
                    >
                        <FormComponent dataMidtrans={Midtrans} />
                    </BottomSheetCustom>
                )}

            </View>
        </BottomSheetModalProvider >
    )
}

export default AdminOrder

const styles = StyleSheet.create({
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