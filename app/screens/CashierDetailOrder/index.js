import { BE_API_HOST } from '@env';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { IlQris, IlSuccesFully } from '../../assets';
import BottomSheetCustom from '../../component/BottomSheet';
import CountdownTimer from '../../component/CountdownTimer';
import EventStatusChecker from '../../component/EventStatusChecker';
import HeaderBar from '../../component/HeaderBar';
import OrderHistoryItem from '../../component/OrderHistoryItem';
// import PaymentFooter from '../../component/PaymentFooter';
import useAxios from '../../api/useAxios';
import CashierPaymentFooter from '../../component/CashierPaymentFooter';
import PopUpAnimation from '../../component/PopUpAnimation';
import TextInput from '../../component/TextInput';
import useDebounce from '../../component/UseDebounce';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { addPembayaran, addStateMidtrans, addToOrderHistoryListFromCart } from '../../redux/orderSlice';
import { useForm } from '../../utils';

const CashierDetailOrder = ({ route, navigation }) => {
    const item = route.params
    // console.log(item.order_detail, 'route.params;')
    const { fetchData: axiosBe } = useAxios();
    const { Midtrans } = useSelector(state => state.orderReducer);
    const [pembayaran, setPembayaran] = useState('cash')
    const ListRef = useRef();
    const dispatch = useDispatch();
    const bottomSheetModalRef = useRef(null);
    const totalBayar = item.order_detail.reduce((sum, item) => sum + parseInt(item.total), 0);
    const [showAnimation, setShowAnimation] = useState(false);

    const postPembayaran = async (data) => {
        try {
            await dispatch(addPembayaran({ data, axiosBe, navigation })).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    const buttonPressHandler = () => {
        if (pembayaran == 'qris') {
            const data = {
                id_pemesanan: item.id,
                CartList: item.order_detail,
                totalBayar,
                metode_pembayaran: pembayaran,
                status: 'PENDING'
            }
            // console.log(data, 'dataxx'); return;
            postPembayaran(data)
        } else {
            openModal();
        }
    };
    useEffect(() => {
        if (Midtrans !== null) openModal();
    }, [Midtrans])

    const openModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // Fungsi untuk menutup BottomSheetModal
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

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
                // disappearsOnIndex={-1}
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
            navigation.reset({ index: 21, routes: [{ name: 'MainAppCashier' }] });
        }, 2000);
    }
    const renderItem = ({ item }) => {
        return (
            // <CashierOrderItem
            //     id={item.id}
            //     name={item.menu.nama}
            //     link={item.menu.path}
            //     kind={item.menu.nama_kategori}
            //     price={item.harga}
            //     totalHarga={item.total}
            //     qty={item.quantity}
            //     extraPrice={item.menu.harga_ekstra}
            //     temperatur={item.temperatur}
            // />
            <OrderHistoryItem
                key={item.id}
                name={item.menu.nama}
                kind={item.menu.nama_kategori}
                link={item.menu.path}
                price={parseInt(item.harga)}
                qty={item.quantity}
                temperatur={item.temperatur}
                ItemPrice={parseInt(item.total)}
                subKatgori={item.menu.nama_sub_kategori}
            />
        );
    };

    // FORM CASH
    const FormComponentCash = () => {
        const formatCurrency = (amount, currency) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };
        const [tempKembalian, setTempKembalian] = useState(0);
        const debounceKembalian = useDebounce(tempKembalian, 500);
        const [form, setForm] = useForm({
            totalBayar: totalBayar,
            jumlah_diberikan: 15000,
            jumlah_diberikan: 15000,
            jumlah_kembalian: (15000 > totalBayar) ? 15000 - totalBayar : 0
        });

        const [currencyMenu, setCurrencyMenu] = useState({
            index: 0,
            value: formatCurrency(15000, 'IDR')
        });
        const arrCurrency = [
            {
                key: 0,
                label: formatCurrency(15000, 'IDR'),
                value: 15000
            },
            {
                key: 1,
                label: formatCurrency(50000, 'IDR'),
                value: 50000
            },
        ];

        const handleProcessPaymentCash = () => {
            if (form.jumlah_diberikan < totalBayar) {
                ToastAndroid.showWithGravity(
                    `Proses tidak dapat dilakukan, Uang yang harus dibayar adalah ${formatCurrency(totalBayar, 'IDR')}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                )
                return;
            }
            const dataPembayaran = {
                jumlah_diberikan: form.jumlah_diberikan,
                jumlah_kembalian: form.jumlah_kembalian
            }
            const data = {
                CartList: item.order_detail,
                id_pemesanan: item.id,
                totalBayar,
                metode_pembayaran: pembayaran,
                status: 'PAID',
                cash: dataPembayaran,
            }
            postPembayaran(data)

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
                setCurrencyMenu({ index: undefined, value: undefined })
            }
            const check = isFailedJumlahBayar(form.jumlah_diberikan);
            if (!check) {
                let kembalian = parseInt(form.jumlah_diberikan) - parseInt(totalBayar)
                setForm('jumlah_kembalian', parseInt(kembalian))
            }
        };
        useEffect(() => {
            if (debounceKembalian) {
                if (debounceKembalian < totalBayar) {
                    ToastAndroid.showWithGravity(
                        `Uang yang harus dibayar adalah ${formatCurrency(totalBayar, 'IDR')}`,
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                    )
                    setForm('jumlah_kembalian', 0)
                    return;
                }
                let kembalian = parseInt(debounceKembalian) - parseInt(totalBayar)
                setForm('jumlah_kembalian', kembalian)
            }
        }, [debounceKembalian]);

        return (
            <View style={{
                paddingHorizontal: 20,
                gap: 10
            }}>
                <Text style={{ marginTop: 20, color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_16, fontFamily: FONTFAMILY.poppins_semibold }}>Total Pembayaran - <Text style={{ color: COLORS.primaryOrangeHex, fontSize: FONTSIZE.size_20, fontFamily: FONTFAMILY.poppins_semibold }}>{formatCurrency(totalBayar, 'IDR')}</Text></Text>
                <CurrencyInput
                    value={form.jumlah_diberikan}
                    onChangeValue={(value) => {
                        setForm('jumlah_diberikan', value)
                        setCurrencyMenu({ index: undefined, value: '' })
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
                                setCurrencyMenu({ index: item.key, value: item.label })
                                setForm('jumlah_diberikan', parseInt(item.value))
                                setTempKembalian(item.value)
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
        );
    }

    // FORM QRIS
    const FormComponentQris = ({ dataMidtrans }) => {
        const expiryTime = dataMidtrans.expiry_time;
        const trxId = dataMidtrans.transaction_id;
        const apiUrl = `${BE_API_HOST}/verify/isfinish?idTrx=${trxId}`

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
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            {showAnimation && (
                <PopUpAnimation
                    style={styles.LottieAnimation}
                    source={IlSuccesFully}
                />
            )}
            <HeaderBar title="Order Detail" onBack={() => navigation.goBack()} />
            <View style={[styles.orderContainer, { marginBottom: 2 }]}>
                <View style={styles.orderItemFlatlist}>
                    <FlatList
                        ref={ListRef}
                        showsHorizontalScrollIndicator={false}
                        data={item.order_detail}
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
                <CashierPaymentFooter
                    buttonPressHandler={buttonPressHandler}
                    buttonTitle="Bayar"
                    price={{
                        totalPesanan: item.order_detail.reduce((sum, item) => sum + parseInt(item.quantity), 0),
                        totalBayar: totalBayar,
                        currency: 'IDR'
                    }}
                    pembayaran={pembayaran}
                    setPembayaran={setPembayaran}
                />

            </View>
            {Midtrans && pembayaran === 'qris' ? (
                <BottomSheetCustom
                    // backdropComponent={renderBackdropQris}
                    // enablePanDownToClose={false} // Disable swipe down to close
                    ref={bottomSheetModalRef}
                    onClose={closeModal}
                    appearsOnIndex={0}
                >
                    <FormComponentQris dataMidtrans={Midtrans} />
                </BottomSheetCustom>
            )
                :
                <BottomSheetCustom
                    // backdropComponent={renderBackdrop}
                    ref={bottomSheetModalRef}
                    onClose={closeModal}
                    disappearsOnIndex={-1}
                >
                    <FormComponentCash />
                </BottomSheetCustom>
            }

        </View>
    )
}

export default CashierDetailOrder

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
        backgroundColor: COLORS.primaryOrangeHex,
        marginBottom: 10
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