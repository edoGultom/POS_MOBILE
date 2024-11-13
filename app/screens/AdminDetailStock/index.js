import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import Select from '../../component/Select'
import TextInput from '../../component/TextInput'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getIngridients } from '../../redux/ingridientsSlice'
import { addStok, deleteStock, getDetailStok, updateStok } from '../../redux/stockDetailSlice'
import { showMessage, useForm } from '../../utils'
import useAxios from '../../api/useAxios'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const AdminDetailStock = ({ navigation, route }) => {
    const { id, kode, tipe, tanggal } = route.params;
    const bottomSheetModalRef = useRef(null);
    const { details } = useSelector(state => state.stockDetailReducer);
    const { ingridients } = useSelector(state => state.ingridientsReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStock, setSelectedDetailStock] = useState(null);
    const { fetchData: axiosBe } = useAxios();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getData = async () => {
        try {
            await dispatch(getDetailStok({ id, axiosBe })).unwrap();
            await dispatch(getIngridients(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const setRefreshData = (val) => {
        setRefreshing(val);
    }

    const handleDelete = useCallback(async (id) => {
        const param = { id, setRefreshData, axiosBe };
        dispatch(deleteStock(param))
    }, []);

    const openModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // Fungsi untuk menutup BottomSheetModal
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
        if (setSelectedDetailStock) {
            setSelectedDetailStock(null)
        }
    }, []);

    const FormComponent = ({ dataBahanBaku, selected, onCloseModal }) => {
        const [unit, setUnit] = useState(selected !== null ? selected.list_bahan_baku.unit : dataBahanBaku[0]?.unit);
        const isExists = () => {
            return details?.find((item) => item.id_bahan_baku === form.id_bahan_baku)
        }
        // const existsDataIngridient = () => dataSelectedStok.find((item) => item.id === form.id_menu)?.list_bahan_baku.filter((bahan) => bahan.id_bahan_baku === form.id_bahan_baku && bahan.quantity === parseInt(form.quantity));
        const [form, setForm] = useForm({
            id_transaksi_stok: id,
            id_bahan_baku: selected !== null ? selected.id_bahan_baku : dataBahanBaku[0].id,
            quantity: selected !== null ? selected.quantity.toString() : 0,
        });
        const [loading, setLoading] = useState(false)
        const toggleLoading = () => {
            setLoading((prev) => !prev)
        }
        const Title = !selected ? `Tambah Stok` : `Ubah Stok'`;

        const handleSave = () => {
            toggleLoading()
            if ((!selected && isExists())) {//jika sudah ada data(ketika input atau update)
                showMessage('Ingridient already exists', 'danger');
            } else if (form.quantity < 1) {//jika sudah ada data(ketika input atau update)
                showMessage('Please innsert a quantity', 'danger');
            }
            else {
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                const param = { dataInput, setRefreshData, axiosBe };
                if (selected !== null) {//update
                    const updatedParam = { ...param, id: selected.id };
                    dispatch(updateStok(updatedParam))
                        .then(() => {
                            onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
                            toggleLoading()

                        })
                        .catch((error) => {
                            showMessage('Update failed!', 'danger');
                        });
                } else {//add
                    dispatch(addStok(param))
                        .then(() => {
                            onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
                            toggleLoading()
                        })
                        .catch((error) => {
                            showMessage('Add failed!', 'danger');
                        });
                }
            }
        };

        return (
            <View style={{
                paddingHorizontal: 20,
                gap: 10
            }}>
                <Text style={{
                    marginTop: 20,
                    color: COLORS.primaryOrangeHex,
                    fontFamily: FONTFAMILY.poppins_bold,
                    fontSize: FONTSIZE.size_20
                }}>{Title}</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexShrink: 1, flexGrow: 1, marginRight: SPACING.space_10 }}>
                        <TextInput
                            keyboardType="numeric"
                            label="Quantity"
                            placeholder="Masukkan quantity"
                            value={form.quantity}
                            onChangeText={(value) => setForm('quantity', value ? parseInt(value) : 0)}
                        />
                    </View>
                    <View style={{ flexShrink: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.labelUnit}>Unit Bahan Baku</Text>
                        <Text style={styles.valUnit}>{unit}</Text>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    gap: 10,
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center', // centers vertically
                            alignItems: 'center',
                            padding: SPACING.space_10,
                            backgroundColor: COLORS.primaryLightGreyHex,
                            height: 40,
                            borderRadius: BORDERRADIUS.radius_10
                        }}
                        onPress={onCloseModal}>
                        <Text style={{ color: COLORS.primaryWhiteHex }}>Tutup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={loading}
                        style={{
                            justifyContent: 'center', // centers vertically
                            alignItems: 'center',
                            padding: SPACING.space_10,
                            backgroundColor: COLORS.primaryOrangeHex,
                            height: 40,
                            borderRadius: BORDERRADIUS.radius_10,
                            marginBottom: 20
                        }}
                        onPress={handleSave}>
                        <Text>Simpan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title={`Detail Transaksi Stok`} onBack={() => navigation.goBack()} />
            <View style={{ paddingHorizontal: SPACING.space_15, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, }}>
                <View>
                    <Text style={{ fontSize: FONTSIZE.size_14, color: COLORS.primaryLightGreyHex }}>Kode: <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, color: COLORS.primaryWhiteHex }}>{kode}</Text></Text>
                    <Text style={{ fontSize: FONTSIZE.size_14, color: COLORS.primaryLightGreyHex }}>Tipe: <Text style={[{ fontFamily: FONTFAMILY.poppins_semibold }, tipe == 'Keluar' ? { color: COLORS.primaryRedHex } : { color: COLORS.primaryOrangeHex }]}>{tipe}</Text></Text>
                </View>
                <View>
                    <Text style={{ fontSize: FONTSIZE.size_14, color: COLORS.primaryLightGreyHex }}>Tgl. <Text style={{ fontFamily: FONTFAMILY.poppins_semibold, color: COLORS.primaryWhiteHex }}>{tanggal}</Text></Text>
                </View>
            </View>
            {!details ? (
                <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                </View>
            ) : (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={[styles.containerItem]}>
                        <View style={{
                            alignItems: 'center',
                            flexDirection: 'row',

                        }}>
                            <Text style={styles.tableHeader}>Bahan Baku</Text>
                            <Text style={styles.tableHeader}>Stok / Unit</Text>
                            <Text style={styles.tableHeader}>Aksi</Text>
                        </View>
                        {details.map((item, idx) => {
                            return (
                                <View key={idx} style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }}>
                                    <Text style={styles.tableBody}>{item?.list_bahan_baku.nama}</Text>
                                    <Text style={styles.tableBody}>{`${item?.quantity} ${item?.list_bahan_baku.unit}`}</Text>
                                    <View style={[
                                        styles.tableBody,
                                        { flexDirection: 'row', gap: SPACING.space_4, justifyContent: 'center', flex: 1, alignItems: 'center' },
                                    ]}>
                                        <TouchableOpacity
                                            activeOpacity={0.4}
                                            style={styles.btnAction}
                                            onPress={() => {
                                                openModal()
                                                setSelectedDetailStock(item)
                                            }}
                                        >
                                            <CustomIcon
                                                name="edit-square"
                                                color={COLORS.primaryOrangeHex}
                                                size={FONTSIZE.size_18}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.4}
                                            style={styles.btnAction}
                                            onPress={() => handleDelete(item.id)}
                                        >
                                            <CustomIcon
                                                name="delete-forever"
                                                color={COLORS.primaryRedHex}
                                                size={FONTSIZE.size_18}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                        )}
                    </View>
                </ScrollView>
            )}

            <BottomSheetCustom
                ref={bottomSheetModalRef}
                onClose={closeModal}
            >
                <FormComponent dataBahanBaku={ingridients} selected={selectedStock} onCloseModal={closeModal} />
            </BottomSheetCustom>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.buttonTambah}
                    onPress={() => {
                        openModal()
                        setSelectedDetailStock(null)
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
    )
}

export default AdminDetailStock

const styles = StyleSheet.create({
    btnAction: {
        backgroundColor: COLORS.secondaryDarkGreyHex,
        borderRadius: BORDERRADIUS.radius_10,
        padding: SPACING.space_12,
    },
    tableHeader: {
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_semibold,
        fontSize: FONTSIZE.size_14,
        width: windowWidth / 3,
        color: COLORS.primaryWhiteHex,
        borderWidth: 1,
        borderColor: COLORS.secondaryLightGreyHex,
        padding: SPACING.space_4
    },
    tableBody: {
        textAlign: 'center',
        fontFamily: FONTFAMILY.poppins_light,
        fontSize: FONTSIZE.size_12,
        width: windowWidth / 3,
        color: COLORS.primaryWhiteHex,
        borderWidth: 1,
        borderColor: COLORS.secondaryLightGreyHex,
        padding: SPACING.space_4,
        height: windowHeight / 12
    },
    label: { fontSize: FONTSIZE.size_16, fontFamily: FONTFAMILY.poppins_regular, color: COLORS.secondaryLightGreyHex },
    input: { borderWidth: 1, borderColor: COLORS.secondaryLightGreyHex, borderRadius: BORDERRADIUS.radius_15, padding: SPACING.space_10, color: COLORS.secondaryLightGreyHex },
    ItemContainer: {
        flex: 1,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    containerItem: {
        marginTop: SPACING.space_10
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