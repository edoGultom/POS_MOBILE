// import AntDesign from '@expo/vector-icons/AntDesign';
// import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react'

const CustomIcon = ({ name, size, color, style }) => {
    return (
        <MaterialIcons name={name} size={size} color={color} {...style} />
    )
}

export default CustomIcon