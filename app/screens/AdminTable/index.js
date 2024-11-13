import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaskedTextInput } from "react-native-mask-text"
import { useDispatch, useSelector } from 'react-redux'
import useAxios from '../../api/useAxios'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItemTable from '../../component/ListItemTable'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addTable, deleteTable, getTables, updateTable } from '../../redux/tableSice'
import { showMessage, useForm } from '../../utils'
// const windowWidth = Dimensions.get('window').width;

const AdminTable = ({ navigation }) => {
    const { tables } = useSelector(state => state.tablesReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const { fetchData: axiosBe } = useAxios();
    const bottomSheetModalRef = useRef(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataTable);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getDataTable = async () => {
        try {
            await dispatch(getTables(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
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

    const setRefreshData = (val) => {
        setRefreshing(val);
    }

    const handleDelete = useCallback(async (id) => {
        const param = { id, setRefreshData, axiosBe };
        dispatch(deleteTable(param))
    }, []);


    // Fungsi untuk membuka BottomSheetModal
    const openModal = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    // Fungsi untuk menutup BottomSheetModal
    const closeModal = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

    const FormComponent = ({ selected, onCloseModal }) => {
        const [form, setForm] = useForm({
            nomor_meja: selected !== null ? selected.nomor_meja : '',
            status: selected !== null ? selected.status : 'Available',
        });
        const [loading, setLoading] = useState(false)
        const Title = selected !== null ? 'Ubah Meja' : 'Tambah Meja';
        const toggleLoading = () => {
            setLoading((prev) => !prev)
        }
        const handleSave = () => {
            if (form.nomor_meja === null) {
                showMessage('Please input table number to continue!', 'danger');
            } else {
                toggleLoading()
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                const param = { dataInput, setRefreshData, axiosBe };
                if (selected !== null) {//update
                    const updatedParam = { ...param, id: selected.id };
                    // dispatch(updateTable(updatedParam));
                    dispatch(updateTable(updatedParam))
                        .then(() => {
                            onCloseModal(); // Tutup Bottom Sheet setelah penyimpanan berhasil
                            toggleLoading()

                        })
                        .catch((error) => {
                            showMessage('Update failed!', 'danger');
                        });
                } else {//add
                    dispatch(addTable(param))
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
                paddingBottom: 15,
                paddingTop: 20,
                gap: 10
            }}>
                <Text style={{ color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>{Title}</Text>

                <View style={{
                    flexDirection: 'row', // Mengatur layout menjadi horizontal
                    justifyContent: 'space-between', // Memberikan jarak antar elemen
                    alignItems: 'center', // Menjaga elemen tetap sejajar di tengah vertikal
                    gap: 10,
                }}>
                    <View style={styles.containerInput}>
                        <MaskedTextInput
                            mask="A-99"
                            placeholder="Masukkan nomor meja"
                            keyboardType='numeric'
                            onChangeText={(text, rawText) => {
                                setForm('nomor_meja', text)
                            }}
                            style={[styles.input, { color: 'white' }]}
                            value={form.nomor_meja ? form.nomor_meja : 'T-'}
                            placeholderTextColor={COLORS.secondaryLightGreyHex}
                        />
                    </View>
                    <View style={styles.containerSatus}>
                        <Text style={styles.label}>Status: </Text>
                        <Text style={[
                            styles.label,
                            form.status == 'Available'
                                ? { color: COLORS.primaryOrangeHex }
                                : { color: COLORS.primaryRedHex },
                        ]}>{form.status}</Text>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    gap: 10,
                }}>
                    <TouchableOpacity
                        disabled={loading}
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
            </View >
        );
    }
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Meja" onBack={() => navigation.goBack()} />
            {tables.length < 1 ? (
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
                            onPressUpdate={() => {
                                openModal()
                                setSelectedMenu(item)
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
                <FormComponent selected={selectedMenu} onCloseModal={closeModal} />
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
    )
}

export default AdminTable

const styles = StyleSheet.create({
    containerSatus: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 100,
        flexDirection: 'column',
    },
    label: {
        fontSize: FONTSIZE.size_16,
        fontFamily: FONTFAMILY.poppins_regular,
        color: COLORS.secondaryLightGreyHex,

    },
    containerInput: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 300,
        height: 'auto'
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.secondaryLightGreyHex,
        borderRadius: BORDERRADIUS.radius_15,
        padding: SPACING.space_10,
    },
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
        // position: 'absolute',
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    input: {
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'rgba(151, 151, 151, 0.25)',
    },
})