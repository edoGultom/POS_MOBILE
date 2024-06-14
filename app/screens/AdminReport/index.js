import { BE_API_HOST } from '@env'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import { format, addMonths, addYears } from 'date-fns'
import { id } from 'date-fns/locale'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import CustomIcon from '../../component/CustomIcon'
import HeaderBar from '../../component/HeaderBar'
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config'
import { addLoading } from '../../redux/globalSlice'
import { getData } from '../../utils'
import { Ionicons } from '@expo/vector-icons';
const windowWidth = Dimensions.get('window').width;

const AdminReport = ({ navigation }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [dateStart, setDateStart] = useState(null);
    const [showStart, setShowStart] = useState(false);
    const [dateEnd, setDateEnd] = useState(null);
    const [showEnd, setShowEnd] = useState(false);
    const [checked, setChecked] = useState({
        label: '',
        value: '',
    });
    const Checkboxs = [
        {
            label: '1 Day',
            value: format(new Date(), "yyyy-MM-dd", { locale: id })
        },
        {
            label: '1 Month',
            value: format(addMonths(new Date(), 1), "yyyy-MM-dd", { locale: id })
        },
        {
            label: '1 Year',
            value: format(addYears(new Date(), 1), "yyyy-MM-dd", { locale: id })
        }
    ]

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

    const getFilter = async (token, data) => {
        dispatch(addLoading(true));
        try {
            const response = await axios.post(`${BE_API_HOST}/report/by-date`, data, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            dispatch(addLoading(false));
            if (response.status === 200) {
                const { data } = response.data
                setData(data)
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
        const data = {
            start,
            end
        }
        getData('token').then((res) => {
            getFilter(res.value, data)
        });
    }
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    let total = 0;

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
                        <Text style={{ color: COLORS.primaryWhiteHex }}>Report 1 Day</Text>
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
                            name={'calendar-days'}
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
                            name={'calendar-days'}
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
                            name={'searchengin'}
                            color={COLORS.primaryOrangeHex}
                            size={FONTSIZE.size_20}
                        />
                        <Text style={{ color: COLORS.primaryWhiteHex, fontFamily: FONTFAMILY.poppins_semibold }}>Cari Data</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView vertical={true}>
                <View style={styles.container}>
                    {data && data.map((item, idx) => {
                        total += total + item.total_sales_amount;
                        return (
                            <View key={idx} style={{
                                alignItems: 'center',
                                marginHorizontal: 15,
                                // backgroundColor: 'red',
                                flexDirection: 'row',
                                marginVertical: 5
                            }}>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{format(item.date, "d MMMM yyyy", { locale: id })}</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.nama_barang}</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{item.total_quantity_sold}</Text>
                                <Text style={{ fontFamily: FONTFAMILY.poppins_light, fontSize: FONTSIZE.size_12, width: windowWidth / 4, color: COLORS.primaryWhiteHex }}>{formatCurrency(item.total_sales_amount, 'IDR')}</Text>
                            </View>
                        )
                    }
                    )}
                </View>
                {data && (
                    <View style={{
                        marginVertical: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>

                        <View style={{
                            alignItems: 'flex-start',
                            // backgroundColor: 'blue',
                            paddingLeft: 15,
                            width: windowWidth / 2
                        }}>
                            <Text style={{
                                color: COLORS.primaryWhiteHex,
                                fontFamily: FONTFAMILY.poppins_semibold,
                                fontSize: FONTSIZE.size_14
                            }}>Total</Text>
                        </View>
                        <View style={{
                            width: windowWidth / 2,
                            alignItems: 'flex-end',
                            // backgroundColor: 'orange',
                            paddingRight: 15
                        }}>
                            <Text style={{
                                fontFamily: FONTFAMILY.poppins_semibold,
                                fontSize: FONTSIZE.size_14,
                                color: COLORS.primaryWhiteHex
                            }}>{formatCurrency(total, 'IDR')}</Text>
                        </View>
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
        marginTop: 15,
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