import React from 'react';
import { StyleSheet, Text, View, TextInput as TextInputRN } from 'react-native';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';

const TextInput = ({ label, placeholder, ...restProps }) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInputRN
        style={styles.input}
        placeholder={placeholder}
        {...restProps}
        placeholderTextColor={COLORS.secondaryLightGreyHex}
      />
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  label: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.secondaryLightGreyHex
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.secondaryLightGreyHex,
    borderRadius: BORDERRADIUS.radius_15,
    padding: SPACING.space_10,
    color: COLORS.secondaryLightGreyHex
  },
});
