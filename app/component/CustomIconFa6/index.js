import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react'

const CustomIconFa6 = ({ name, size, color, style }) => {
    return (
        <FontAwesome6 name={name} size={size} color={color} {...style} />
    )
}

export default CustomIconFa6