import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
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
import useAxios from '../../api/useAxios'

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
    useEffect(() => {
        if (selectedIngridients) {
            bottomSheetModalRef.current.present();
        }
    }, [selectedIngridients])

    const openModal = () => {
        bottomSheetModalRef.current.present();
    };

    const closeModal = () => {
        bottomSheetModalRef.current.dismiss();
    };

    const FormComponent = ({ dataUnit, selected }) => {
        const [form, setForm] = useForm({
            nama: selected !== null ? selected.nama : null,
            id_unit_bahan_baku: selected !== null ? selected.id_unit_bahan_baku : '1',
        });
        const Title = selected !== null ? 'Ubah Bahan Baku' : 'Tambah Bahan Baku';

        const onSubmit = () => {
            if (form.nama === null) {
                showMessage('Please input a ingridient!', 'danger');
            } else {
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                closeModal();
                const param = { dataInput, setRefreshData, axiosBe };
                if (selected !== null) {//update
                    const updatedParam = { ...param, id: selected.id };
                    dispatch(updateIngridients(updatedParam));
                } else {//add
                    dispatch(addIngridients(param));
                }
            }
        };

        return (
            <View style={{ marginBottom: 5, gap: 20 }}>
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
                <Button title="Tutup" onPress={() => { closeModal() }} color={COLORS.primaryLightGreyHex} />
                <Button title="Simpan" onPress={() => { onSubmit() }} color={COLORS.primaryOrangeHex} />
            </View>
        );
    }

    return (
        <BottomSheetModalProvider>
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
                                onPressUpdate={() => setSelectedIngridients(item)}
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
                    <FormComponent dataUnit={dataUnit} selected={selectedIngridients} />
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
        </BottomSheetModalProvider >
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