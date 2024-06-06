// BottomSheetContent.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const BottomSheetContent = ({ onClose }) => {
    return (
        <View style={{ padding: 20, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Bottom Sheet Content</Text>
            <TouchableOpacity onPress={onClose}>
                <Text style={{ color: 'blue' }}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BottomSheetContent;
