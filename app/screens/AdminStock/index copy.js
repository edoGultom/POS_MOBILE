import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
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
import { getIngridients } from '../../redux/ingridientsSlice'
import { addTable, deleteTable, updateTable } from '../../redux/tableSice'
import { showMessage, useForm } from '../../utils'
import TextInput from '../../component/TextInput'
import { id } from 'date-fns/locale'
import { addTransaksiStok, getTransaksiStok, updateTransaksiStok } from '../../redux/stockSlice'

const AdminStock = ({ navigation }) => {
    const bottomSheetModalRef = useRef(null);
    const { stocks } = useSelector(state => state.stockReducer);
    const { ingridients } = useSelector(state => state.ingridientsReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(null);

    useEffect(() => {
        navigation.addListener('focus', () => {
            getData();
        });
    }, [navigation]);

    const getData = () => {
        dispatch(getTransaksiStok())
        dispatch(getIngridients())
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

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setRefreshData = (val) => {
        setRefreshing(val);
    }

    const handleDelete = useCallback(async (id) => {
        const param = { id, setRefreshData };
        dispatch(deleteTable(param))
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
        if (selectedMenu) {
            bottomSheetModalRef.current.present();
        }
    }, [selectedMenu])

    const openModal = () => {
        bottomSheetModalRef.current?.present();
    };

    const closeModal = () => {
        bottomSheetModalRef.current?.dismiss();
    };
    const onChangeStart = (event, selectedDate) => {
        const currentDateStart = selectedDate || date;
        setShowDate(false);
        setDate(currentDateStart);
    };
    const FormComponent = ({ dataBahanBaku, selected }) => {
        const tipe = [{ id: 'Masuk', nama: 'Masuk' }, { id: 'Keluar', nama: 'Keluar' }];
        const [unit, setUnit] = useState(dataBahanBaku[0]?.unit);

        const [form, setForm] = useForm({
            tipe: selected !== null ? selected.tipe : 'Masuk',
            // waktu: selected !== null ? selected.waktu : date,
            waktu: selected !== null ? selected.waktu : format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            quantity: selected !== null ? selected.quantity : 0,
            id_bahan_baku: selected !== null ? selected.id_bahan_baku : dataBahanBaku[0]?.id,
        });
        const Title = selected !== null ? 'Ubah Stok' : 'Tambah Stok';

        const onSubmit = () => {
            if (form.quantity < 1) {
                showMessage('Please input stok to continue!', 'danger');
            } else {
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                closeModal();
                const param = { dataInput, setRefreshData };
                if (selected !== null) {//update
                    const updatedParam = { ...param, id: selected.id };
                    dispatch(updateTransaksiStok(updatedParam));
                } else {//add
                    dispatch(addTransaksiStok(param));
                }
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
                    {/* <View style={{ flexShrink: 1, flexGrow: 1 }}>
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
                                {date ? format(new Date(date), 'dd MMMM yyyy', { locale: id }) : 'Pilih Tanggal'}
                            </Text>
                        </TouchableOpacity>
                        {showDate && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display="default"
                                onChange={onChangeStart}
                                minimumDate={new Date()}
                            />
                        )}
                    </View> */}
                </View>

                <View style={{ flex: 1, flexDirection: 'row', gap: SPACING.space_8 }}>
                    <View style={{ flexBasis: 'auto', flexShrink: 1, flexGrow: 0 }}>
                        <TextInput
                            keyboardType="numeric"
                            label="Stok"
                            placeholder="Masukkan stok"
                            value={form.quantity}
                            onChangeText={(value) => setForm('quantity', value ? parseInt(value) : 0)}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Select
                            label="Bahan Baku"
                            data={dataBahanBaku}
                            value={form.id_bahan_baku}
                            onSelectChange={(value) => {
                                const unitBahanBaku = dataBahanBaku.find((item) => item.id === value)
                                setUnit(unitBahanBaku.unit)
                                setForm('id_bahan_baku', value)
                            }}
                        />
                    </View>
                    <View style={{ flexShrink: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.labelUnit}>Unit</Text>
                        <Text style={styles.valUnit}>{unit}</Text>
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
                {!stocks ? (
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
                                bahan_baku={item.bahan_baku}
                                tipe={item.tipe}
                                waktu={item.waktu}
                                unit={item.unit}
                                quantity={item.quantity}
                                onPressDelete={() => handleDelete(item.id)}
                                onPressUpdate={() => setSelectedMenu(item)}
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
                >
                    <FormComponent dataBahanBaku={ingridients} selected={selectedMenu} />
                </BottomSheetCustom>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonTambah}
                        onPress={() => {
                            openModal()
                            setSelectedMenu(null)
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