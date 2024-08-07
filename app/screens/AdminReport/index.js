import { BE_API_HOST } from '@env'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import { format, addMonths, addYears } from 'date-fns'
import { id } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addLoading } from '../../redux/globalSlice'
import { getData } from '../../utils'
import { Ionicons } from '@expo/vector-icons';
import useAxios from '../../api/useAxios'
const windowWidth = Dimensions.get('window').width;

const AdminReport = ({ navigation }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [dateStart, setDateStart] = useState(null);
    const [showStart, setShowStart] = useState(false);
    const [dateEnd, setDateEnd] = useState(null);
    const [showEnd, setShowEnd] = useState(false);
    const { fetchData: axiosBe } = useAxios();

    const [checked, setChecked] = useState({
        label: '',
        value: '',
    });
    const Checkboxs = [
        {
            label: 'Report 1 Day',
            value: format(new Date(), "yyyy-MM-dd", { locale: id })
        },
        {
            label: 'Report 1 Month',
            value: format(addMonths(new Date(), 1), "yyyy-MM-dd", { locale: id })
        },
        {
            label: 'Report 1 Year',
            value: format(addYears(new Date(), 1), "yyyy-MM-dd", { locale: id })
        }
    ]
    useEffect(() => {
        if (checked.label !== '') {
            setDateStart(null)
            setDateEnd(null)
        }
    }, [checked.label])


    const onChangeStart = (event, selectedDate) => {
        const currentDateStart = selectedDate || dateStart;
        setShowStart(Platform.OS === 'ios');
        setDateStart(currentDateStart);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDateEnd = selectedDate || dateEnd;
        setShowEnd(Platform.OS === 'ios');
        setDateEnd(currentDateEnd);
    };

    const getFilter = async (url, data) => {
        dispatch(addLoading(true));
        try {
            const response = await axiosBe({
                url: `${url}`,
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json', // Adjust content type if necessary
                },
            })
            // console.log(response, 'rxx'); return;
            dispatch(addLoading(false));
            if (response.status) {
                const { data } = response
                setData(data)
                // total = data.reduce((sum, item) => sum + item.total_sales_amount, 0);
            } else {
                dispatch(addLoading(false));
                console.error('Response not okay');
            }
        } catch (error) {
            dispatch(addLoading(false));
            console.error('Error: ', error);
        }
    }

    const submitFilter = () => {
        const start = format(new Date(dateStart), 'yyyy-MM-dd', { locale: id });
        const end = format(new Date(dateEnd), 'yyyy-MM-dd', { locale: id });
        let data = null;
        let url = '';
        if (dateStart && dateEnd) {
            url = `/report/by-date-range`
            data = {
                start,
                end
            }
        } else if (checked.value !== '') {
            url = `/report/by-date`
            data = {
                date: checked.value
            }
        } else {
            ToastAndroid.showWithGravity(
                `Silahkan isi data yang akan dicari`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            )
            setData(null)
            return;
        }
        // console.log(data, 'dataxxx')
        getFilter(url, data)
    }

    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="Report" onBack={() => navigation.goBack()} />
            <View style={{
                marginTop: 20,
                paddingHorizontal: 15,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
            }}>
                {Checkboxs.map((item, idx) => (
                    <View style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center'
                    }}
                        key={idx}
                    >
                        <Pressable
                            style={[styles.checkboxBase, checked && styles.checkboxChecked]}
                            onPress={() => {
                                if (checked.label === item.label) {
                                    setChecked({ label: '', value: '' });
                                } else {
                                    setChecked({ label: item.label, value: item.value });
                                }
                            }}>
                            {checked.label == item.label && <Ionicons name="checkmark" size={24} color="white" />}
                        </Pressable>
                        <Text style={{ color: COLORS.primaryWhiteHex }}>{item.label}</Text>
                    </View>
                ))}
            </View>

            <Text style={{
                marginTop: 25,
                paddingHorizontal: 15,
                color: COLORS.primaryWhiteHex
            }}>Report date from to</Text>
            <View style={styles.containerFilter}>
                <View style={styles.containerCard}>
                    <TouchableOpacity
                        onPress={() => { setShowStart(true) }}
                        style={styles.btnCard}
                    >
                        <CustomIcon
                            name={'calendar-month'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={[
                            { fontFamily: FONTFAMILY.poppins_light },
                            { color: dateStart ? COLORS.primaryWhiteHex : COLORS.secondaryLightGreyHex }
                        ]}>
                            {dateStart ? format(new Date(dateStart), 'dd MMMM yyyy', { locale: id }) : 'Select a start date'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerCard}>
                    <TouchableOpacity
                        onPress={() => { setShowEnd(true) }}
                        style={styles.btnCard}
                    >
                        <CustomIcon
                            name={'calendar-month'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={[
                            { fontFamily: FONTFAMILY.poppins_light },
                            { color: dateEnd ? COLORS.primaryWhiteHex : COLORS.secondaryLightGreyHex }
                        ]}>
                            {dateEnd ? format(new Date(dateEnd), 'dd MMMM yyyy', { locale: id }) : 'Select a end date'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerCardSubmit}>
                    <TouchableOpacity
                        onPress={submitFilter}
                        style={styles.btnCard}
                    >
                        <CustomIcon
                            name={'search'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={{ color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_semibold }}>Cari Data</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView vertical={true}>
                {data ? (
                    <>
                        <View style={[styles.container, data ? { borderBottomWidth: 1, borderBottomColor: COLORS.secondaryLightGreyHex } : {}]}>
                            {data.map((item, idx) => {
                                return (
                                    <View key={idx} style={{
                                        alignItems: 'center',
                                        // backgroundColor: 'red',
                                        flexDirection: 'row',
                                        marginVertical: 5
                                    }}>
                                        <View style={{ width: (windowWidth / 4) - 10, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, color: COLORS.primaryWhiteHex }}>{item.nama_bahan_baku}</Text>
                                        </View>
                                        <View style={{ width: (windowWidth / 4) - 10, alignItems: 'flex-end' }}>
                                            <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, color: COLORS.primaryWhiteHex }}>{item.total_masuk} {item.satuan}</Text>
                                        </View>
                                        <View style={{ width: (windowWidth / 4) - 10, alignItems: 'flex-end' }}>
                                            <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, color: COLORS.primaryWhiteHex }}>{item.total_keluar} {item.satuan}</Text>
                                        </View>
                                        <View style={{ width: (windowWidth / 4), alignItems: 'flex-end' }}>
                                            <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, color: COLORS.primaryWhiteHex }}>{item.saldo_akhir} {item.satuan}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            )}
                        </View>
                        <View style={{
                            // backgroundColor: 'red',
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>

                            <View style={{
                                alignItems: 'center',
                                width: windowWidth / 4,
                                // backgroundColor: 'grey',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    color: COLORS.primaryWhiteHex,
                                    fontFamily: FONTFAMILY.poppins_semibold,
                                    fontSize: FONTSIZE.size_14
                                }}>Total</Text>
                            </View>
                            <View style={{
                                width: windowWidth / 4,
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                // backgroundColor: 'blue',
                                marginRight: 10
                            }}>
                                <Text style={{
                                    fontFamily: FONTFAMILY.poppins_semibold,
                                    fontSize: FONTSIZE.size_14,
                                    color: COLORS.primaryWhiteHex
                                }}>
                                    {data.reduce((sum, item) => sum + parseInt(item.saldo_akhir), 0)}
                                </Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={{ marginTop: SPACING.space_30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: COLORS.secondaryLightGreyHex, fontSize: FONTSIZE.size_14, fontFamily: FONTFAMILY.poppins_light }}>Data Tidak Ditemukan</Text>
                    </View>
                )}
            </ScrollView>
            {showStart && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeStart}
                />
            )}
            {showEnd && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onChangeEnd}
                />
            )}
        </View>
    )
}

export default AdminReport

const styles = StyleSheet.create({
    checkboxBase: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'coral',
        backgroundColor: 'transparent',
    },
    checkboxChecked: {
        backgroundColor: 'coral',
    },
    container: {
        marginTop: SPACING.space_30,
        paddingHorizontal: 10,
        // backgroundColor: 'gray'
    },
    box1: {
        flexGrow: 1,
        backgroundColor: 'red',
    },

    containerFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    containerCardSubmit: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        width: Dimensions.get('window').width
    },
    containerCard: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        gap: SPACING.space_15,
        width: (Dimensions.get('window').width / 2)
    },
    btnCard: {
        flexDirection: 'row',
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        alignItems: 'center',
        justifyContent: 'center',
        height: SPACING.space_24 * 2.5,
        borderRadius: BORDERRADIUS.radius_10,
        borderWidth: 2,
        elevation: 1,
        borderColor: COLORS.primaryOrangeHex,
        gap: SPACING.space_15,
    },
    box: {
        flexGrow: 1,
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primaryBlackRGBA,
        flexDirection: 'column',
        width: 100,
        height: 100,
        borderRadius: BORDERRADIUS.radius_20,
        borderWidth: 2,
        elevation: 1,
        borderColor: COLORS.primaryOrangeHex,
    },
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
        // backgroundColor: COLORS.primaryWhiteHex,
    },
})