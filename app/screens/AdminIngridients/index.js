import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItemIngridients from '../../component/ListItemIngridients'
import Select from '../../component/Select'
import TextInput from '../../component/TextInput'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addIngridients, deleteIngridients, getIngridients, updateIngridients } from '../../redux/ingridientsSlice'
import { getUnits } from '../../redux/unitsSlice'
import { showMessage, useForm } from '../../utils'

const AdminIngridients = ({ navigation }) => {
    const { units } = useSelector(state => state.unitsReducer);
    const bottomSheetModalRef = useRef(null);
    const { ingridients } = useSelector(state => state.ingridientsReducer);
    const [dataUnit, setDataUnit] = useState([]);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIngridients, setSelectedIngridients] = useState(null);
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        if (dataUnit.length < 1 && units.length > 0) {
            const data = units.map((item) => ({
                id: item.id,
                nama: item.nama
            }));
            setDataUnit(data)
        }
    }, [units])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getData);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getData = async () => {
        try {
            await dispatch(getUnits(axiosBe)).unwrap();
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
        dispatch(deleteIngridients(param))
    }, []);

    const openModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const FormComponent = ({ dataUnit, selected, onCloseModal }) => {
        const [form, setForm] = useForm({
            nama: selected !== null ? selected.nama : null,
            id_unit_bahan_baku: selected !== null ? selected.id_unit_bahan_baku : '1',
        });
        const [loading, setLoading] = useState(false)
        const toggleLoading = () => {
            setLoading((prev) => !prev)
        }
        const Title = selected !== null ? 'Ubah Bahan Baku' : 'Tambah Bahan Baku';

        const handleSave = () => {
            // onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
            toggleLoading()
            if (form.nama === null) {
                showMessage('Please input a ingridient!', 'danger');
            } else {
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                const param = { dataInput, setRefreshData, axiosBe };
                if (selected !== null) {//update
                    const updatedParam = { ...param, id: selected.id };
                    dispatch(updateIngridients(updatedParam))
                        .then(() => {
                            onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
                            toggleLoading()

                        })
                        .catch((error) => {
                            showMessage('Update failed!', 'danger');
                        });
                } else {//add
                    dispatch(addIngridients(param))
                        .then(() => {
                            onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
                            toggleLoading()

                        })
                        .catch((error) => {
                            showMessage('Update failed!', 'danger');
                        });
                }
            }
        };

        return (
            <View style={{
                paddingHorizontal: 20,
                paddingBottom: 15,
                paddingTop: 20,
                gap: 10
            }}>
                <Text style={{ color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>{Title}</Text>
                <TextInput
                    label="Bahan Baku"
                    placeholder="Masukkan Nama Bahan Baku"
                    value={form.nama}
                    onChangeText={(value) => setForm('nama', value)}
                />
                <Select
                    label="Satuan"
                    data={dataUnit}
                    value={form.id_unit_bahan_baku}
                    onSelectChange={(value) => setForm('id_unit_bahan_baku', value)}
                />
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
                        borderRadius: BORDERRADIUS.radius_10
                    }}
                    onPress={handleSave}>
                    <Text>Simpan</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Daftar Bahan Baku" onBack={() => navigation.goBack()} />
            {ingridients.length < 1 ? (
                <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                </View>
            ) : (
                <FlatList
                    data={ingridients}
                    onRefresh={fetchData}
                    refreshing={refreshing}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ListItemIngridients
                            key={item.id}
                            id={item.id}
                            name={item.nama}
                            unit={item.unit}
                            onPressDelete={() => handleDelete(item.id)}
                            onPressUpdate={() => {
                                openModal()
                                setSelectedIngridients(item)
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
                <FormComponent dataUnit={dataUnit} selected={selectedIngridients} onCloseModal={closeModal} />
            </BottomSheetCustom>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.buttonTambah}
                    onPress={() => {
                        openModal()
                        setSelectedIngridients(null)
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

export default AdminIngridients

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
})