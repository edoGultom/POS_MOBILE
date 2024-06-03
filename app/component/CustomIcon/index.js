import AntDesign from '@expo/vector-icons/AntDesign';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react'

const CustomIcon = ({ name, size, color, style }) => {
    return (
        <AntDesign name={name} size={size} color={color} {...style} />
    )
}

export default CustomIcon