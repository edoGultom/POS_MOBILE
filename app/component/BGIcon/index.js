import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomIcon from '../CustomIcon'
import { BORDERRADIUS, SPACING } from '../../config'

const BGIcon = ({ name, color, size, BGColor }) => {
    return (
        <View style={[styles.IconBG, { backgroundColor: BGColor }]}>
            <CustomIcon name={name} color={color} size={size} />
        </View>
    )
}

export default BGIcon

const styles = StyleSheet.create({
    IconBG: {
        height: SPACING.space_30,
        width: SPACING.space_30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BORDERRADIUS.radius_8,
    },
})