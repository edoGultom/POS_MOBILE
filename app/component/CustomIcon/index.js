import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react'

const CustomIcon = ({ name, size, color }) => {
    return (
        <Ionicons name={name} size={size} color={color} />
    )
}

export default CustomIcon