// EventStatusChecker.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { BE_API_HOST } from '@env';
import { COLORS } from '../../config';

const EventStatusChecker = ({ apiUrl, handleSuccess }) => {
    const [status, setStatus] = useState(null);
    const intervalIdRef = useRef(null);

    const checkStatus = async () => {
        try {
            const response = await axios.post(apiUrl)
            setStatus(response.data.message);
            console.log(response.data.message, 'responsexxx')
            // If the status is 'PAID', clear the interval
            if (response.data.message === 'PAID') {
                handleSuccess();
                clearInterval(intervalIdRef.current);
            }
        } catch (error) {
            console.error('Error fetching the status:', error);
            setStatus('Error fetching status');
        }
    };

    useEffect(() => {
        // Initial check
        checkStatus();
        // Set up interval to check status every 5 seconds
        intervalIdRef.current = setInterval(() => {
            checkStatus();
        }, 2000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalIdRef.current);
    }, [apiUrl]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Status: {status}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    text: {
        fontSize: 18,
        color: COLORS.secondaryLightGreyHex
    },
});

export default EventStatusChecker;
