import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import BottomSheetCustom from '../../component/BottomSheet'
import HeaderBar from '../../component/HeaderBar'
import ListItemMenuIngridients from '../../component/ListItemMenuIngridients'
import Select from '../../component/Select'
import TextInput from '../../component/TextInput'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getIngridients } from '../../redux/ingridientsSlice'
import { addMenuIngridients, deleteMenuIngridients, getMenuIngridients, updateMenuIngridients } from '../../redux/menuIngridientsSlice'
import { getMenu } from '../../redux/menuSlice'
import { showMessage, useForm } from '../../utils'

const AdminMenuIngridients = ({ navigation }) => {
    const { menu_ingridients } = useSelector(state => state.menuIngridientsReducer);
    const { menus } = useSelector(state => state.menuReducer);
    const { ingridients } = useSelector(state => state.ingridientsReducer);
    const bottomSheetModalRef = useRef(null);
    const dispatch = useDispatch();
    const [isUpdate, setIsUpdate] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMenuIngridients, setSelectedMenuIngridients] = useState(null);
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getData = async () => {
        try {
            await dispatch(getMenuIngridients(axiosBe)).unwrap();
            await dispatch(getMenu(axiosBe)).unwrap();
            await dispatch(getIngridients(axiosBe)).unwrap();
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
        dispatch(deleteMenuIngridients(param))
    }, []);


    const openModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // Fungsi untuk menutup BottomSheetModal
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
        if (selectedMenuIngridients) {
            setSelectedMenuIngridients(null)
        }
        if (isUpdate) {
            setIsUpdate(false)
        }
        // setSelectedMenuIngridients(null)
        // setIsUpdate(false);
    }, []);


    const FormComponent = ({ dataBahanBaku, dataSelectdIngridients, selected, isUpdate, onCloseModal }) => {
        const [unit, setUnit] = useState(!isUpdate ? dataBahanBaku[0]?.unit : selected.list_bahan_baku[0]?.unit);
        const existsDataSelected = () => {
            return selected.list_bahan_baku.find((item) => item.id_menu === form.id_menu && item.id_bahan_baku === form.id_bahan_baku)
        }
        const existsDataIngridient = () => dataSelectdIngridients.find((item) => item.id === form.id_menu)?.list_bahan_baku.filter((bahan) => bahan.id_bahan_baku === form.id_bahan_baku && bahan.quantity === parseInt(form.quantity));
        const [form, setForm] = useForm({
            id_menu: selected?.id,
            id_bahan_baku: !isUpdate ? dataBahanBaku[0].id : selected.list_bahan_baku[0].id_bahan_baku,
            quantity: !isUpdate ? 0 : selected.list_bahan_baku[0].quantity.toString(),
        });

        const Title = !isUpdate ? `Tambah Bahan Baku '${selected?.nama}'` : `Ubah Bahan Baku '${selected?.nama}'`;
        const [loading, setLoading] = useState(false)
        const toggleLoading = () => {
            setLoading((prev) => !prev)
        }
        const handleSave = () => {
            if ((!isUpdate && existsDataSelected()) || isUpdate && existsDataIngridient().length > 0) {//jika sudah ada data(ketika input atau update)
                showMessage('Ingridient already exists', 'danger');
            } else {
                toggleLoading()
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                const param = { dataInput, setRefreshData, axiosBe };
                if (isUpdate) {//update
                    const updatedParam = { ...param, id: selected.list_bahan_baku[0].id };
                    dispatch(updateMenuIngridients(updatedParam))
                        .then(() => {
                            onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
                            toggleLoading()

                        })
                        .catch((error) => {
                            showMessage('Update failed!', 'danger');
                        });
                } else {//add
                    dispatch(addMenuIngridients(param))
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
                <Text style={{ marginTop: 20, color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>{Title}</Text>
                <View>
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
                <View>
                    <TextInput
                        keyboardType="numeric"
                        label="Quantity"
                        placeholder="Masukkan quantity"
                        value={form.quantity}
                        onChangeText={(value) => setForm('quantity', value ? parseInt(value) : 0)}
                    />
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
            <HeaderBar title="Daftar Menu Bahan Baku" onBack={() => navigation.goBack()} />
            {menu_ingridients.length < 1 ? (
                <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                </View>
            ) : (
                <FlatList
                    data={menu_ingridients}
                    onRefresh={fetchData}
                    refreshing={refreshing}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ListItemMenuIngridients
                            key={item.id}
                            id={item.id}
                            menu={item.nama}
                            url={item.path}
                            list_bahan_baku={item.list_bahan_baku}
                            onPressDelete={(id) => handleDelete(id)}
                            onPressUpdate={(idBahanBaku) => {
                                openModal()
                                setIsUpdate(true)
                                const filter = item.list_bahan_baku.filter((item) => item.id === idBahanBaku)
                                const filteredItem = {
                                    ...item,
                                    list_bahan_baku: filter
                                };
                                setSelectedMenuIngridients(filteredItem)
                            }}
                            onPressAdd={() => {
                                setSelectedMenuIngridients(item)
                                openModal()
                            }}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ flexGrow: 1, columnGap: SPACING.space_10, paddingBottom: SPACING.space_10 * 9 }}
                    vertical
                />
            )}

            <BottomSheetCustom
                ref={bottomSheetModalRef}
                onClose={closeModal}
            >
                <FormComponent dataBahanBaku={ingridients} dataSelectdIngridients={menu_ingridients} selected={selectedMenuIngridients} onCloseModal={closeModal} />
            </BottomSheetCustom>
        </View>
    )
}

export default AdminMenuIngridients

const styles = StyleSheet.create({
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