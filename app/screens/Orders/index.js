import { BE_API_HOST } from '@env';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import HeaderBar from '../../component/HeaderBar';
import { COLORS } from '../../config';
import OrderTabSection from '../../component/OrderTabSection';

const Orders = ({ navigation }) => {
    const dispatch = useDispatch();
    return (
        <View style={styles.ScreenContainer}>
            <StatusBar style='light' />
            <HeaderBar title="List Orders" />
            <View style={styles.tabContent}>
                <OrderTabSection />
            </View>
        </View>
    );
}

export default Orders

const styles = StyleSheet.create({
    ScreenContainer: {
        flex: 1,
        backgroundColor: COLORS.primaryBlackHex,
    },
    ScrollViewFlex: {
        flexGrow: 1,
    },
    tabContent: {
        flex: 1,
        marginTop: 24
    }
})