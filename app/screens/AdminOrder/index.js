import { BE_API_HOST } from '@env';
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { IlQris, IlSuccesFully } from '../../assets';
import BottomSheetCustom from '../../component/BottomSheet';
import CountdownTimer from '../../component/CountdownTimer';
import EventStatusChecker from '../../component/EventStatusChecker';
import HeaderBar from '../../component/HeaderBar';
import OrderItem from '../../component/OrderItem';
import PaymentFooter from '../../component/PaymentFooter';
import PopUpAnimation from '../../component/PopUpAnimation';
import TextInput from '../../component/TextInput';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { addPembayaran, addStateMidtrans, addToOrderHistoryListFromCart, decrementCartItemQuantity, incrementCartItemQuantity } from '../../redux/orderSlice';
import { getData, useForm } from '../../utils';

const AdminOrder = ({ navigation }) => {
    const { CartList, Midtrans } = useSelector(state => state.orderReducer);
    const [pembayaran, setPembayaran] = useState('cash')
    const ListRef = useRef();
    const dispatch = useDispatch();
    const bottomSheetModalRef = useRef(null);
    const totalBayar = CartList.reduce((acc, curr) => acc + curr.harga * curr.qty, 0);
    const [showAnimation, setShowAnimation] = useState(false);

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const incrementCartItemQuantityHandler = (id, temperatur) => {
        const data = { id, temperatur }
        dispatch(incrementCartItemQuantity(data))
    };
    const decrementCartItemQuantityHandler = (id, temperatur) => {
        const data = { id, temperatur }
        dispatch(decrementCartItemQuantity(data))
    };

    const buttonPressHandler = () => {
        if (pembayaran == 'qris') {
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
        } else {
            openModal();
        }
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
                disappearsOnIndex={-1}
            // appearsOnIndex={0}
            />
        ),
        []
    );
    const renderBackdropQris = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
            />
        ),
        []
    );
    const handleSuccessQris = () => {
        closeModal();
        setShowAnimation(true);
        setTimeout(() => {
            setShowAnimation(false);
            dispatch(addStateMidtrans(null))
            dispatch(addToOrderHistoryListFromCart())
            navigation.reset({ index: 4, routes: [{ name: 'Admin' }] });
        }, 2000);
    }
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

    // FORM CASH
    const FormComponentCash = () => {
        const [form, setForm] = useForm({
            totalBayar: totalBayar,
            jumlah_diberikan: 35000,
            jumlah_kembalian: 0,
        });

        const [currencyMenu, setCurrencyMenu] = useState({
            index: 0,
            category: formatCurrency(35000, 'IDR')
        });
        const arrCurrency = [
            {
                key: 0,
                label: formatCurrency(35000, 'IDR'),
                value: 35000
            },
            {
                key: 1,
                label: formatCurrency(50000, 'IDR'),
                value: 50000
            },
        ];
        const handleSuccessCash = (data) => {
            setTimeout(() => {
                dispatch(addToOrderHistoryListFromCart())
            }, 1000);
            const params = {
                cash: data.cash,
                redirect: {
                    index: 4,
                    name: 'Admin'
                }
            }
            navigation.navigate('SuccessPaymentCash', params);

        }
        const handleProcessPaymentCash = () => {
            if (form.jumlah_diberikan < totalBayar) {
                ToastAndroid.showWithGravity(
                    `Proses tidak dapat dilakukan, Uang yang harus dibayar adalah ${formatCurrency(totalBayar, 'IDR')}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                )
                return;
            }
            getData('token').then((resToken) => {
                const dataPembayaran = {
                    jumlah_diberikan: form.jumlah_diberikan,
                    jumlah_kembalian: form.jumlah_kembalian
                }
                const data = {
                    CartList,
                    totalBayar,
                    metode_pembayaran: pembayaran,
                    status: 'PAID',
                    cash: dataPembayaran
                }
                console.log(data, 'cccccccc')
                const token = resToken.value;
                const properties = { data, token, handleSuccessCash };
                dispatch(addPembayaran(properties))
            });
        }
        const isFailedJumlahBayar = useCallback(
            debounce((val) => {
                if (val < totalBayar) {
                    ToastAndroid.showWithGravity(
                        `Uang yang harus dibayar adalah ${formatCurrency(totalBayar, 'IDR')}`,
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    )
                    return true;
                }
                return false
            }, 500),
            []
        );
        const handleBlur = () => {
            if (form.jumlah_diberikan !== currencyMenu.label) {
                setCurrencyMenu({ index: undefined, category: undefined })
            }
            const check = isFailedJumlahBayar(form.jumlah_diberikan);
            if (!check) {
                setForm('jumlah_kembalian', parseInt(form.jumlah_diberikan) - parseInt(totalBayar))
            }
        };

        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"} >
                <ScrollView>
                    <View style={{ marginBottom: 5, gap: 20 }}>
                        <Text style={{ color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_16, fontFamily: FONTFAMILY.poppins_semibold }}>Total Pembayaran - <Text style={{ color: COLORS.primaryOrangeHex, fontSize: FONTSIZE.size_20, fontFamily: FONTFAMILY.poppins_semibold }}>{formatCurrency(totalBayar, 'IDR')}</Text></Text>
                        <CurrencyInput
                            value={form.jumlah_diberikan}
                            onChangeValue={(value) => {
                                setForm('jumlah_diberikan', value)
                                setCurrencyMenu({ index: undefined, category: '' })
                            }}
                            onBlur={handleBlur}
                            renderTextInput={textInputProps => <TextInput {...textInputProps} variant='filled' />}
                            prefix="Rp "
                            delimiter="."
                            precision={0}
                            minValue={0}
                        />
                        <View style={styles.KindOuterContainer}>
                            {arrCurrency.map((item, index) => (
                                <TouchableOpacity
                                    key={item.key}
                                    onPress={() => {
                                        setCurrencyMenu({ index: item.key, category: item.label })
                                        setForm('jumlah_diberikan', item.value)
                                        handleBlur()
                                    }}
                                    style={[
                                        styles.KindBox,
                                        currencyMenu.index === item.key
                                            ? { borderColor: COLORS.primaryOrangeHex } : { borderColor: COLORS.primaryLightGreyHex },
                                    ]}>
                                    {currencyMenu.index === item.key ? item.iconOn : item.iconOff}
                                    <Text
                                        style={[
                                            styles.SizeText,
                                            {
                                                fontSize: FONTSIZE.size_16,
                                            },
                                            currencyMenu.index === item.key
                                                ? { color: COLORS.primaryOrangeHex } : { color: COLORS.primaryWhiteHex },
                                        ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.processBtn} onPress={handleProcessPaymentCash}>
                            <Text style={styles.processBtnTitle}>PROCESS</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    // FORM QRIS
    const FormComponentQris = ({ dataMidtrans }) => {
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
                                <EventStatusChecker apiUrl={apiUrl} handleSuccess={handleSuccessQris} />
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
                {showAnimation && (
                    <PopUpAnimation
                        style={styles.LottieAnimation}
                        source={IlSuccesFully}
                    />
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
                            keyExtractor={item => `${item.id}-${item.temperatur}`}
                            renderItem={renderItem}
                        />
                    </View>
                    <PaymentFooter
                        buttonPressHandler={buttonPressHandler}
                        buttonTitle="Bayar"
                        price={{
                            totalPesanan: CartList.reduce((sum, item) => sum + item.qty, 0),
                            totalBayar: totalBayar,
                            currency: 'Rp'
                        }}
                        pembayaran={pembayaran}
                        setPembayaran={setPembayaran}
                    />

                </View>
                {Midtrans && pembayaran === 'qris' ? (
                    <BottomSheetCustom
                        ref={bottomSheetModalRef}
                        backdropComponent={renderBackdropQris}
                        enablePanDownToClose={false} // Disable swipe down to close
                    >
                        <FormComponentQris dataMidtrans={Midtrans} />
                    </BottomSheetCustom>
                ) :

                    <BottomSheetCustom
                        ref={bottomSheetModalRef}
                        backdropComponent={renderBackdrop}
                    >
                        <FormComponentCash />
                    </BottomSheetCustom>
                }

            </View>
        </BottomSheetModalProvider >
    )
}

export default AdminOrder

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