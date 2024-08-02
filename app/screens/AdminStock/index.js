import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItemStock from '../../component/ListItemStock'
import Select from '../../component/Select'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addTransaksiStok, deleteTransaksiStok, getTransaksiStok, updateTransaksiStok } from '../../redux/stockSlice'
import { useForm } from '../../utils'
import useAxios from '../../api/useAxios'

const AdminStock = ({ navigation }) => {
    const bottomSheetModalRef = useRef(null);
    const { stocks } = useSelector(state => state.stockReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);


    const getData = async () => {
        try {
            await dispatch(getTransaksiStok(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const fetchData = useCallback(async () => {
        setRefreshData(true);
        try {
            getData();
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshData(false);
        }
    }, []);

    const setRefreshData = (val) => {
        setRefreshing(val);
    }

    const handleDelete = useCallback(async (id) => {
        const param = { id, setRefreshData, axiosBe };
        dispatch(deleteTransaksiStok(param))
    }, []);

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
            />
        ),
        []
    );

    useEffect(() => {
        if (selectedStock) {
            bottomSheetModalRef.current.present();
        }
    }, [selectedStock])

    const openModal = () => {
        bottomSheetModalRef.current?.present();
    };

    const closeModal = () => {
        setSelectedStock(null)
        bottomSheetModalRef.current?.dismiss();
    };
    const convertDateIndo = (date) => {
        if (date) {
            return format(new Date(date), 'dd-MM-yyyy', { locale: id })
        }
        return format(new Date(), 'dd-MM-yyyy', { locale: id })
    }
    const convertOriginalDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return new Date(year, month, day);
    }

    const FormComponent = ({ selected }) => {
        const tipe = [{ id: 'Masuk', nama: 'Masuk' }, { id: 'Keluar', nama: 'Keluar' }];
        const [form, setForm] = useForm({
            tipe: selected !== null ? selected.tipe : 'Masuk',
            tanggal: selected !== null ? selected.tanggal : new Date(),
        });
        const [showDate, setShowDate] = useState(false);

        const Title = selected !== null ? `Ubah Transaksi Stok ${selected.kode}` : 'Tambah Transaksi Stok';

        const onChangeStart = (event, selectedDate) => {
            const currentDateStart = selectedDate || date;
            setShowDate(Platform.OS === 'ios');
            setForm('tanggal', currentDateStart)
        };

        const onSubmit = () => {
            const dataInput = new FormData();
            for (const key in form) {
                if (key === 'tanggal') {
                    dataInput.append(key, format(new Date(form[key]), 'yyyy-MM-dd', { locale: id }));
                } else {
                    dataInput.append(key, form[key]);
                }
            }
            closeModal();
            const param = { dataInput, setRefreshData, axiosBe };
            if (selected !== null) {//update
                const updatedParam = { ...param, id: selected.id };
                dispatch(updateTransaksiStok(updatedParam));
            } else {//add
                dispatch(addTransaksiStok(param));
            }
        };

        return (
            <View style={{ marginBottom: 5, gap: 20 }}>
                <Text style={{ color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>{Title}</Text>
                <View style={{ flex: 1, flexDirection: 'row', gap: SPACING.space_8 }}>
                    <View style={{ flexShrink: 1, flexGrow: 1 }}>
                        <Select
                            label="Tipe"
                            data={tipe}
                            value={form.tipe}
                            onSelectChange={(value) => setForm('tipe', value)}
                            style={{ flexShrink: 1 }}
                        />
                    </View>
                    <View style={{ flexShrink: 1, flexGrow: 1 }}>
                        <Text style={{ color: COLORS.secondaryLightGreyHex, fontFamily: FONTFAMILY.poppins_regular, fontSize: FONTSIZE.size_16 }}>Tanggal</Text>
                        <TouchableOpacity
                            onPress={() => { setShowDate(true) }}
                            style={styles.btnDate}
                        >
                            <CustomIcon
                                name={'calendar-month'}
                                color={COLORS.secondaryLightGreyHex}
                                size={FONTSIZE.size_20}
                            />
                            <Text style={{ fontFamily: FONTFAMILY.poppins_light, color: COLORS.secondaryLightGreyHex }}>
                                {selected !== null ? convertDateIndo(convertOriginalDate(form.tanggal)) : convertDateIndo(form.tanggal)}
                            </Text>
                        </TouchableOpacity>

                        {showDate && (
                            <RNDateTimePicker minimumDate={new Date()} value={convertOriginalDate(form.tanggal)} onChange={onChangeStart} />
                        )}
                    </View>
                </View>

                <Button title="Tutup" onPress={() => { closeModal() }} color={COLORS.primaryLightGreyHex} />
                <Button title="Simpan" onPress={() => { onSubmit() }} color={COLORS.primaryOrangeHex} />
            </View >
        );
    }

    return (
        <BottomSheetModalProvider>
            <View style={styles.ScreenContainer}>
                <StatusBar style='light' />
                <HeaderBar title="Tansaksi Stok" onBack={() => navigation.goBack()} />
                {stocks.length < 1 ? (
                    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                    </View>
                ) : (
                    <FlatList
                        data={stocks}
                        onRefresh={fetchData}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ListItemStock
                                key={item.id}
                                id={item.id}
                                tanggal={item.tanggal}
                                kode={item.kode}
                                tipe={item.tipe}
                                item={item}
                                onPressDelete={() => handleDelete(item.id)}
                                onPressUpdate={() => setSelectedStock(item)}
                                onPressDetail={() => navigation.navigate('AdminDetailStock', item)}
                            />
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ flexGrow: 1, columnGap: SPACING.space_10, paddingBottom: SPACING.space_10 * 9 }}
                        vertical
                    />
                )}

                <BottomSheetCustom
                    ref={bottomSheetModalRef}
                    backdropComponent={renderBackdrop}
                    onDismiss={closeModal}
                >
                    <FormComponent selected={selectedStock} />
                </BottomSheetCustom>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonTambah}
                        onPress={() => {
                            openModal()
                            setSelectedStock(null)
                        }}
                    >
                        <CustomIcon
                            name={'library-add'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_24}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModalProvider >
    )
}

export default AdminStock

const styles = StyleSheet.create({
    label: { fontSize: FONTSIZE.size_16, fontFamily: FONTFAMILY.poppins_regular, color: COLORS.secondaryLightGreyHex },
    input: { borderWidth: 1, borderColor: COLORS.secondaryLightGreyHex, borderRadius: BORDERRADIUS.radius_15, padding: SPACING.space_10, color: COLORS.secondaryLightGreyHex },
    ItemContainer: {
        flex: 1,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    containerButton: {
        marginVertical: SPACING.space_15,
        marginLeft: SPACING.space_2,
        marginRight: SPACING.space_2,
        overflow: 'hidden',
        borderRadius: BORDERRADIUS.radius_25,
    },
    containerForm: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
        gap: SPACING.space_16
    },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        height: '8%',
        bottom: 0,
    },
    buttonTambah: {
        borderWidth: 1,
        borderColor: COLORS.primaryOrangeHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        position: 'absolute',
        bottom: SPACING.space_20,
        left: 30,
        right: 30,
        backgroundColor: COLORS.secondaryBlackRGBA,
        borderRadius: BORDERRADIUS.radius_25
    },
    ScreenContainer: {
        position: 'relative',
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
    btnDate: {
        flexDirection: 'row',
        flex: 1,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryLightGreyHex,
        alignItems: 'center',
        paddingLeft: SPACING.space_10,
        elevation: 1,
        borderColor: COLORS.secondaryLightGreyHex,
        borderWidth: 1,
        borderRadius: BORDERRADIUS.radius_15,
        gap: SPACING.space_15,
    },
    labelUnit: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_14,
        color: COLORS.primaryOrangeHex,
    },
    valUnit: {
        fontFamily: FONTFAMILY.poppins_medium,
        fontSize: FONTSIZE.size_12,
        color: COLORS.primaryWhiteHex,
    },
})