import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { IEmptyFile, ImChocolate } from '../../assets'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItem from '../../component/ListItem'
import Select from '../../component/Select'
import TextInput from '../../component/TextInput'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getKategori } from '../../redux/kategoriSlice'
import { addMenuState, deleteMenu, getMenu } from '../../redux/menuSlice'
import { getData, useForm } from '../../utils'
import { showMessage } from 'react-native-flash-message'
import axios from 'axios'
import { BE_API_HOST } from '@env';
import { addLoading } from '../../redux/globalSlice'
const windowWidth = Dimensions.get('window').width;

const AdminMenu = ({ navigation }) => {
    const { kategori } = useSelector(state => state.kategoriReducer);
    const bottomSheetModalRef = useRef(null);
    const { menus } = useSelector(state => state.menuReducer);
    const [dataKategori, setDataKategori] = useState([]);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (dataKategori.length < 1 && kategori.length > 0) {
            const data = kategori.map((item) => ({
                id: item.id,
                nama: item.nama_kategori
            }));
            setDataKategori(data)
        }
    }, [kategori])

    useEffect(() => {
        navigation.addListener('focus', () => {
            getDataMenu();
        });
    }, [navigation]);

    const getDataMenu = () => {
        getData('token').then((res) => {
            dispatch(getKategori(res.value))
            dispatch(getMenu(res.value))
        });
    };
    const openModal = () => {
        bottomSheetModalRef.current.present();
    };

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                // disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const FormComponnt = ({ data }) => {
        const [photo, setPhoto] = useState(null);
        const [form, setForm] = useForm({
            nama_barang: '',
            id_satuan: '1',
            id_kategori: '1',
            harga: '',
            stok: '',
            type: 'addition'
        });
        const closeModal = () => {
            bottomSheetModalRef.current.dismiss();
        };
        const onSubmit = () => {
            if (photo === null) {
                showMessage('Please select a file to continue!');
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
                getData('token').then((resToken) => {
                    dispatch(addLoading(true));
                    axios.post(`${BE_API_HOST}/barang/add`, dataInput, {
                        headers: {
                            Authorization: resToken.value,
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                        .then((res) => {
                            closeModal()
                            dispatch(addLoading(false));
                            dispatch(addMenuState(res.data.data))
                        })
                        .catch((err) => {
                            console.log(err, 'error')

                            showMessage(
                                `${err?.response?.data?.message} on Update Profile API` ||
                                'Terjadi kesalahan di API Update Menu',
                            );
                        });
                });
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
        return (
            <View style={{ marginBottom: 5, gap: 20 }}>
                <Text style={{ color: COLORS.primaryOrangeHex, fontFamily: FONTFAMILY.poppins_bold, fontSize: FONTSIZE.size_20 }}>Tambah Menu</Text>
                <TextInput
                    label="Menu"
                    placeholder="Type your menu"
                    value={form.nama_barang}
                    onChangeText={value => setForm('nama_barang', value)}
                />
                <Select
                    label="Kategori"
                    data={data}
                    value={form.id_kategori}
                    onSelectChange={(value) => setForm('id_kategori', value)}
                />
                <TextInput
                    label="Harga"
                    keyboardType='numeric'
                    placeholder='Masukkan Harga'
                    value={form.harga}
                    onChangeText={(value) => setForm('harga', value)}
                />
                <TextInput
                    label="Stok"
                    keyboardType='numeric'
                    placeholder='Masukkan Stok'
                    onChangeText={(value) => setForm('stok', value)}
                />
                <Text style={{ color: COLORS.secondaryLightGreyHex }}>Pilih Gambar</Text>
                <Pressable
                    android_ripple={{
                        color: 'rgb(224, 224, 224)',
                        foreground: true,
                        radius: 50
                    }}
                    onPress={choosePhoto}
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
                <Button title="Tutup" onPress={closeModal} color={COLORS.primaryLightGreyHex} />
                <Button title="Simpan" onPress={onSubmit} color={COLORS.primaryOrangeHex} />
            </View>
        );
    }

    const fetchData = useCallback(async () => {
        setRefreshing(true);
        try {
            getDataMenu();
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setRefreshData = (val) => {
        setRefreshing(val);
    }
    const handleDelete = useCallback(async (id) => {
        // setRefreshing(true);
        getData('token').then(async (res) => {
            const token = res.value;
            const param = { token, id, setRefreshData };
            dispatch(deleteMenu(param))
            // const response = await axios.delete(`${BE_API_HOST}/barang/delete?id=${id}}`, {
            //     headers: {
            //         Authorization: `${res.value}`,
            //     },
            // });
            // if (response.status === 200) {
            //     return response.data;
            // } else {
            //     dispatch(addLoading(false));
            //     console.error('Response not okay');
            // }
        });
    }, []);

    return (
        <BottomSheetModalProvider>
            <View style={styles.ScreenContainer}>
                <StatusBar style='light' />
                <HeaderBar title="Menu" onBack={() => navigation.goBack()} />
                {!menus ? (
                    <View style={{ flexGrow: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: FONTSIZE.size_18, color: COLORS.primaryLightGreyHex }}>Tidak ada item yang tersedia</Text>
                    </View>
                ) : (
                    <FlatList
                        data={menus}
                        onRefresh={fetchData}
                        refreshing={refreshing}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ListItem
                                key={item.id}
                                id={item.id}
                                name={item.nama_barang}
                                uri={item.path}
                                kind='Non Coffee'
                                price={item.harga}
                                onPress={() => handleDelete(item.id)}
                            />
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ flexGrow: 1, columnGap: SPACING.space_10 }}
                        vertical
                    />
                )}

                <BottomSheetCustom
                    ref={bottomSheetModalRef}
                    backdropComponent={renderBackdrop}
                >
                    <FormComponnt data={dataKategori} />
                </BottomSheetCustom>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonTambah}
                        onPress={openModal}
                    >
                        <CustomIcon
                            name={'plus'}
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