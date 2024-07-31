import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = ({ title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>xxxxxxx</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    }
});

export default CustomHeader;
