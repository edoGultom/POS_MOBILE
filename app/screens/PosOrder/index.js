import { BE_API_HOST } from '@env';
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import QRCode from 'react-native-qrcode-svg';
import { useDispatch, useSelector } from 'react-redux';
import { IcNoMenu, IlQris, IlSuccesFully } from '../../assets';
import BottomSheetCustom from '../../component/BottomSheet';
import CountdownTimer from '../../component/CountdownTimer';
import EventStatusChecker from '../../component/EventStatusChecker';
import HeaderBar from '../../component/HeaderBar';
import OrderItem from '../../component/OrderItem';
import PaymentFooter from '../../component/PaymentFooter';
import PopUpAnimation from '../../component/PopUpAnimation';
import TextInput from '../../component/TextInput';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';
import { addOrder, addPembayaran, addStateMidtrans, addToOrderHistoryListFromCart, decrementCartItemQuantity, incrementCartItemQuantity } from '../../redux/orderSlice';
import { getData, useForm } from '../../utils';
import useAxios from '../../api/useAxios';

const PosOrder = ({ route, navigation }) => {
    const { listMenu, table } = route.params?.order;
    const [pembayaran, setPembayaran] = useState('cash')
    const ListRef = useRef();
    const dispatch = useDispatch();
    const totalBayar = listMenu.reduce((acc, curr) => acc + curr.harga * curr.qty, 0);
    const [showAnimation, setShowAnimation] = useState(false);
    const { fetchData: axiosBe } = useAxios();

    const incrementCartItemQuantityHandler = (id, temperatur) => {
        const data = { id, temperatur }
        dispatch(incrementCartItemQuantity(data))
    };
    const decrementCartItemQuantityHandler = (id, temperatur) => {
        const data = { id, temperatur }
        dispatch(decrementCartItemQuantity(data))
    };
    const ordered = async (data) => {
        try {
            await dispatch(addOrder(data)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };
    const buttonPressHandler = () => {
        const formData = {
            status: 'ordered',
            table: table,
            ordered: listMenu
        }
        const data = { formData, setShowAnimation, axiosBe };
        ordered(data)
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

    const renderItem = ({ item }) => {
        return (
            <OrderItem
                id={item.id}
                name={item.nama}
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
                            data={listMenu}
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
                        buttonPressHandler={buttonPressHandler}
                        buttonTitle="Lanjut"
                        price={{
                            totalPesanan: listMenu.reduce((sum, item) => sum + item.qty, 0),
                            totalBayar: totalBayar,
                            currency: 'Rp'
                        }}
                        pembayaran={pembayaran}
                        setPembayaran={setPembayaran}
                    />

                </View>
            </View>
        </BottomSheetModalProvider >
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