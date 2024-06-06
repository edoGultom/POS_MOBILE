import { BE_API_HOST } from '@env'
import { BottomSheetBackdrop, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import axios from 'axios'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ImChocolate, ImEmpty } from '../../assets'
import BottomSheetCustom from '../../component/BottomSheet'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import ListItem from '../../component/ListItem'
import Select from '../../component/Select'
import TextInput from '../../component/TextInput'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { getKategori } from '../../redux/kategoriSlice'
import { getMenu } from '../../redux/menuSlice'
import { getData, useForm } from '../../utils'

const AdminMenu = ({ navigation }) => {
    const { kategori } = useSelector(state => state.kategoriReducer);
    const bottomSheetModalRef = useRef(null);
    const { menus } = useSelector(state => state.menuReducer);
    const [dataKategori, setDataKategori] = useState([]);
    const [photo, setPhoto] = useState(null);
    const dispatch = useDispatch();

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
            getToken();
        });
    }, [navigation]);

    const getToken = () => {
        getData('token').then((res) => {
            dispatch(getKategori(res.value))
            dispatch(getMenu(res.value))
        });
    };

    const openModal = () => {
        bottomSheetModalRef.current.present();
    };

    const closeModal = () => {
        bottomSheetModalRef.current.dismiss();
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

    const Form = ({ data }) => {
        const [form, setForm] = useForm({
            nama_barang: '',
            id_satuan: 1,
            id_kategori: 1,
            harga: 0,
            stok: 0,
            type: 'addition'
        });

        const onSubmit = () => {
            let resultObj = {};
            Object.keys(form).map((obj) => {
                if (form[obj]) {
                    resultObj[obj] = form[obj];
                }
            });
            const dataInput = new FormData();
            // Append each form field to FormData
            for (const key in form) {
                dataInput.append(key, form[key]);
            }
            console.log(dataInput, 'resultObj')
            // getData('token').then((resToken) => {
            //     axios.post(`${BE_API_HOST}/barang/add`, resultObj, {
            //         headers: {
            //             Authorization: resToken.value,
            //             'Content-Type': 'multipart/form-data',
            //         },
            //     })
            //         .then((res) => {
            //             closeModal
            //             dispatch(getMenu(res.value))
            //             console.log(res.data, 'res')
            //         })
            //         .catch((err) => {
            //             showMessage(
            //                 `${err?.response?.data?.message} on Update Profile API` ||
            //                 'Terjadi kesalahan di API Update Profile',
            //             );
            //         });
            // });
        };

        const choosePhoto = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.5,
            });
            console.log(result)
            if (!result.canceled) {
                // setPhoto(result.assets[0].uri);
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
                    // value={format(form.harga)}
                    value={form.harga}
                    onChangeText={(value) => setForm('harga', value)}
                />
                <TextInput
                    label="Stok"
                    keyboardType='numeric'
                    placeholder='Masukkan Stok'
                    onChangeText={(value) => setForm('stok', value)}
                />
                <Pressable
                    android_ripple={{
                        color: 'rgb(224, 224, 224)',
                        foreground: true,
                    }}
                    onPress={choosePhoto}
                    style={{
                        width: 80,
                        height: 80,
                        justifyContent: 'space-around',
                        alignItems: 'start',
                        elevation: 4,
                    }}>
                    <Text style={{ color: COLORS.secondaryLightGreyHex }}>Pilih Foto</Text>
                    <View style={styles.photoContainer}>
                        <Image source={ImEmpty} style={styles.photoMenu} />
                        {/* <Text
                            style={{
                                color: '#808B97',
                                fontFamily: 'Poppins-Medium',
                                fontWeight: 500,
                                marginTop: 10,
                            }}>
                            Select Files
                        </Text> */}
                    </View>
                </Pressable>
                {/* {photo && (
                    <Image source={{ uri: photo.assets[0].uri }} style={styles.photoMenu} />
                )} */}
                <Button title="Tutup" onPress={closeModal} color={COLORS.primaryLightGreyHex} />
                <Button title="Simpan" onPress={onSubmit} color={COLORS.primaryOrangeHex} />
            </View>
        );
    }

    return (
        <BottomSheetModalProvider>
            <View style={styles.ScreenContainer}>
                <StatusBar style='light' />
                <HeaderBar title="Menu" onBack={() => navigation.goBack()} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.ScrollViewFlex}>
                    <View style={[styles.ScrollViewInnerView, { marginBottom: 10 }]}>
                        <View style={styles.ItemContainer}>
                            {menus > 0 && menus.map((item) => (
                                <ListItem
                                    id={item.id}
                                    name={item.nama_baran}
                                    imagelink_square={ImChocolate}
                                    kind='Non Coffee'
                                    price={120000}
                                />
                            ))}

                        </View>
                    </View>
                </ScrollView>
                <BottomSheetCustom
                    ref={bottomSheetModalRef}
                    backdropComponent={renderBackdrop}
                >
                    <Form data={dataKategori} />
                </BottomSheetCustom>

                <View style={{ backgroundColor: COLORS.primaryBlackHex, flex: 1 }}>
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
        </BottomSheetModalProvider>
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
        backgroundColor: 'grey'
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
    buttonTambah: {
        borderWidth: 1,
        borderColor: COLORS.primaryOrangeHex,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'absolute',
        bottom: SPACING.space_20,
        // left: SPACING.space_10,
        // right: SPACING.space_10,
        height: 60,
        backgroundColor: COLORS.primaryBlackRGBA,
        borderRadius: BORDERRADIUS.radius_25 * 4
    },
    ScreenContainer: {
        backgroundColor: COLORS.primaryBlackHex,
        flex: 1,
    },
})