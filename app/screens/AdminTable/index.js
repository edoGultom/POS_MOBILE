import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaskedTextInput } from "react-native-mask-text"
import { useDispatch, useSelector } from 'react-redux'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItemTable from '../../component/ListItemTable'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addTable, deleteTable, getTables, updateTable } from '../../redux/tableSice'
import { getData, showMessage, useForm } from '../../utils'

const windowWidth = Dimensions.get('window').width;

const AdminTable = ({ navigation }) => {
    const bottomSheetModalRef = useRef(null);
    const { tables } = useSelector(state => state.tablesReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        navigation.addListener('focus', () => {
            getDataTable();
        });
    }, [navigation]);

    const getDataTable = () => {
        getData('token').then((res) => {
            dispatch(getTables(res.value))
        });
    };

    const fetchData = useCallback(async () => {
        setRefreshData(true);
        try {
            getDataTable();
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
        getData('token').then(async (res) => {
            const token = res.value;
            const param = { token, id, setRefreshData };
            dispatch(deleteTable(param))
        });
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
        if (selectedMenu) {
            bottomSheetModalRef.current.present();
        }
    }, [selectedMenu])

    const openModal = () => {
        bottomSheetModalRef.current.present();
    };

    const closeModal = () => {
        bottomSheetModalRef.current.dismiss();
    };

    const FormComponent = ({ selected }) => {
        const [form, setForm] = useForm({
            nomor_meja: selected !== null ? selected.nomor_meja : '',
            status: selected !== null ? selected.status : 'Available',
        });
        const Title = selected !== null ? 'Ubah Meja' : 'Tambah Meja';

        const onSubmit = () => {
            if (form.nomor_meja === null) {
                showMessage('Please input table number to continue!', 'danger');
            } else {
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                closeModal();
                getData('token').then((resToken) => {
                    const token = resToken.value;
                    const param = { token, dataInput, setRefreshData };
                    if (selected !== null) {//update
                        const updatedParam = { ...param, id: selected.id };
                        dispatch(updateTable(updatedParam));
                    } else {//add
                        console.log('first')
                        dispatch(addTable(param));
                    }
                });
            }
        };
        // console.log(form, 'formx')
        return (
            <View style={{ marginBottom: 5, gap: 20 }}>
                <Text style={{ color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>{Title}</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexShrink: 1, flexGrow: 1, marginRight: SPACING.space_10 }}>
                        <MaskedTextInput
                            mask="A-99"
                            placeholder="Masukkan nomor meja"
                            keyboardType='numeric'
                            onChangeText={(text, rawText) => {
                                // console.log(text, 'text');
                                // console.log(rawText, 'rawText');//nno dashed
                                setForm('nomor_meja', text)
                            }}
                            style={styles.input}
                            value={form.nomor_meja ? form.nomor_meja : 'T-'}
                            placeholderTextColor={COLORS.secondaryLightGreyHex}
                        />
                    </View>
                    <View style={{ flexShrink: 1, flexDirection: 'row' }}>
                        <Text style={styles.label}>Status: </Text>
                        <Text style={[
                            styles.label,
                            form.status == 'Available'
                                ? { color: COLORS.primaryOrangeHex }
                                : { color: COLORS.primaryRedHex },
                        ]}>{form.status}</Text>
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
                <HeaderBar title="Meja" onBack={() => navigation.goBack()} />
                {!tables ? (
                    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                    </View>
                ) : (
                    <FlatList
                        data={tables}
                        onRefresh={fetchData}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ListItemTable
                                key={item.id}
                                id={item.id}
                                name={item.nomor_meja}
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
                    <FormComponent selected={selectedMenu} />
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

export default AdminTable

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
})