import { BE_API_HOST } from '@env'
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import { useDispatch, useSelector } from 'react-redux'
import { IEmptyFile } from '../../assets'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItem from '../../component/ListItem'
import Select from '../../component/Select'
import TextInput from '../../component/TextInput'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getKategori, getSubKategori, getSubKategoriById } from '../../redux/kategoriSlice'
import { addMenu, deleteMenu, getMenu, updateMenu } from '../../redux/menuSlice'
import { showMessage, useForm } from '../../utils'
import useAxios from '../../api/useAxios'
import { Ionicons } from '@expo/vector-icons'

const windowWidth = Dimensions.get('window').width;

const AdminMenu = ({ navigation }) => {
    const bottomSheetModalRef = useRef(null);
    const { menus } = useSelector(state => state.menuReducer);
    const { kategori, subKategori } = useSelector(state => state.kategoriReducer);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const { fetchData: axiosBe } = useAxios();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getDataMenu);
        return unsubscribe;  // Cleanup the listener on unmount or when navigation changes
    }, [navigation, dispatch, axiosBe]);

    const getDataMenu = async () => {
        try {
            await dispatch(getMenu(axiosBe)).unwrap();
            await dispatch(getKategori(axiosBe)).unwrap();
            await dispatch(getSubKategori(axiosBe)).unwrap();
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const fetchDatas = useCallback(async () => {
        setRefreshData(true);
        try {
            getDataMenu();
        } catch (error) {
            console.error(error, 'error get data');
        } finally {
            setRefreshData(false);
        }
    }, []);

    const setRefreshData = (val) => {
        setRefreshing(val);
    }

    const handleDelete = useCallback(async (id) => {
        const param = { id, setRefreshData, axiosBe };
        dispatch(deleteMenu(param))
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
        const [dataSubKategori, setDataSubKategori] = useState(subKategori.filter((item) => item.id_kategori == 1));
        const [photo, setPhoto] = useState(null);
        const [form, setForm] = useForm({
            nama: selected !== null ? selected.nama : '',
            id_kategori: selected !== null ? selected.id_kategori : '1',//1 id katgori (Minuman)
            id_sub_kategori: selected !== null ? selected.id_sub_kategori : dataSubKategori[0]?.id,
            harga: selected !== null ? selected.harga.toString() : 0,
            harga_ekstra: selected !== null ? selected.harga_ekstra.toString() : 0,
        });
        const fetchImage = useCallback(async () => {
            const fileUrl = `${BE_API_HOST}/lihat-file/profile?path=${selected.path}`
            fetch(fileUrl)
                .then((response) => {
                    const contentType = response.headers.get('Content-Type');
                    setPhoto({
                        assets: [
                            {
                                uri: `${BE_API_HOST}/lihat-file/profile?path=${selected.path}`,
                                mimeType: contentType,
                            }
                        ]
                    })
                })
                .catch((error) => {
                    console.error('Error fetching the content:', error);
                });
        }, []);

        useEffect(() => {
            setForm('id_sub_kategori', dataSubKategori[0]?.id)
        }, [dataSubKategori])

        useEffect(() => {
            if (selected !== null) fetchImage();
        }, [selected, fetchImage]);

        const [checked, setChecked] = useState({
            label: (selected !== null) ? 'COLD' : '',
            value: (selected !== null) ? form.harga_ekstra : '',
        });
        const Checkboxs = [
            {
                label: 'COLD',
                value: form.id_sub_kategori == '1' ? 3000 : 2000
            },
        ]
        const Title = selected !== null ? 'Ubah Menu' : 'Tambah Menu';

        const onSubmit = () => {
            if (photo === null) {
                showMessage('Please select a file to continue!', 'danger');
            } else {
                const dataInput = new FormData();
                for (const key in form) {
                    dataInput.append(key, form[key]);
                }
                let uri = photo.assets[0].uri;
                let fileExtension = uri.substr(uri.lastIndexOf('.') + 1);
                const dataPhoto = {
                    uri: photo.assets[0].uri,
                    type: photo.assets[0].mimeType,
                    name: `menu.${fileExtension}`
                }

                dataInput.append('file', dataPhoto)
                closeModal();
                const param = { dataInput, setRefreshData, axiosBe };
                if (selected !== null) {//update
                    const updatedParam = { ...param, id: selected.id };
                    dispatch(updateMenu(updatedParam));
                } else {//add
                    dispatch(addMenu(param));
                }
            }
        };

        const choosePhoto = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.5,
            });
            if (!result.canceled) {
                setPhoto(result);
            }
        };
        const changeForm = useCallback(async value => {
            const filter = subKategori.filter((item) => item.id_kategori == value);
            await setForm('id_sub_kategori', filter.id)
            setDataSubKategori(filter)
        }, []);


        return (
            <View style={{ marginBottom: 5, gap: 20 }}>
                <Text style={{ color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>{Title}</Text>
                <TextInput
                    label="Menu"
                    placeholder="Masukkan menu"
                    value={form.nama}
                    onChangeText={(value) => setForm('nama', value)}
                />
                <Select
                    label="Kategori"
                    data={kategori.map((item) => ({ id: item.id, nama: item.nama_kategori }))}
                    value={form.id_kategori}
                    onSelectChange={(value) => {
                        changeForm(value)
                        // console.log(filter, 'hhhh')
                        setForm('id_kategori', value)
                    }}
                />
                <Select
                    label="Sub Kategori"
                    data={dataSubKategori.map((item) => ({ id: item.id, nama: item.nama_sub_kategori }))}
                    value={form.id_sub_kategori}
                    onSelectChange={(value) => setForm('id_sub_kategori', value)}
                />

                <CurrencyInput
                    value={form.harga}
                    onChangeValue={(value) => setForm('harga', value)}
                    renderTextInput={textInputProps => <TextInput {...textInputProps} variant='filled' />}
                    prefix="Rp "
                    delimiter="."
                    precision={0}
                    minValue={0}
                    label="Harga"
                    placeholder='Masukkan Harga'
                // onChangeText={(formattedValue) => {
                //     console.log(formattedValue); // R$ +2.310,46
                // }}
                />

                {
                    form.id_kategori == 2 && (
                        <Text style={{ color: COLORS.secondaryLightGreyHex }}>Harga Ekstra</Text>
                    )
                }

                {form.id_kategori == 1 && Checkboxs.map((item, idx) => (
                    <View style={{
                        marginTop: 5,
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                    }}
                        key={idx}
                    >
                        <Pressable
                            style={[styles.checkboxBase, checked && styles.checkboxChecked]}
                            onPress={() => {
                                if (checked.label === item.label) {
                                    setChecked({ label: '', value: '' });
                                } else {
                                    setForm('harga_ekstra', item.value)
                                    setChecked({ label: item.label, value: item.value });
                                }
                            }}>
                            {checked.label == item.label && <Ionicons name="checkmark" size={24} color={COLORS.primaryOrangeHex} />}
                        </Pressable>
                        <Text style={{ color: COLORS.primaryWhiteHex }}>{item.label} (+{item.value})</Text>
                    </View>
                ))}
                <Text style={{ color: COLORS.secondaryLightGreyHex }}>Pilih Gambar</Text>
                <Pressable
                    android_ripple={{
                        color: 'rgb(224, 224, 224)',
                        foreground: true,
                        radius: 50
                    }}
                    onPress={() => choosePhoto()}
                    style={{
                        width: 80,
                        height: 80,
                        justifyContent: 'space-around',
                        alignItems: 'start',
                        elevation: 4,
                    }}>
                    <View style={styles.photoContainer}>
                        {photo ? (
                            <Image source={{ uri: photo.assets[0].uri }} style={styles.photoContainer} />
                        ) : (
                            <Image source={IEmptyFile} style={styles.photoMenu} />
                        )}
                    </View>
                </Pressable>
                <Button title="Tutup" onPress={() => { closeModal() }} color={COLORS.primaryLightGreyHex} />
                <Button title="Simpan" onPress={() => { onSubmit() }} color={COLORS.primaryOrangeHex} />
            </View>
        );
    }
    return (
        <BottomSheetModalProvider>
            <View style={styles.ScreenContainer}>
                <StatusBar style='light' />
                <HeaderBar title="Menu" onBack={() => navigation.goBack()} />
                {menus.length < 1 ? (
                    <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                    </View>
                ) : (
                    <FlatList
                        data={menus}
                        onRefresh={fetchDatas}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ListItem
                                key={item.id}
                                id={item.id}
                                name={item.nama}
                                url={item.path}
                                kind={item.nama_kategori}
                                sub_kind={item.nama_sub_kategori}
                                price={item.harga}
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

export default AdminMenu

const styles = StyleSheet.create({
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: COLORS.primaryOrangeHex,
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: COLORS.secondaryDarkGreyHex,
    },
    photoMenu: {
        width: 50,
        height: 50,
        alignSelf: 'center',
        borderRadius: 5
    },
    photoContainer: {
        width: 80,
        height: 80,
        borderRadius: 15,
        backgroundColor: COLORS.primaryWhiteHex,
        alignItems: 'center',
        justifyContent: 'center',
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