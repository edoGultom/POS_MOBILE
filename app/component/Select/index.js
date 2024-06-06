import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../../config';

const Select = ({ label, data, value, onSelectChange }) => {
  return (
    <View >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Picker
          selectedValue={value}
          style={{ color: COLORS.secondaryLightGreyHex }}
          onValueChange={(itemValue) => onSelectChange(itemValue)}
          dropdownIconColor={COLORS.secondaryLightGreyHex}
        >
          {data.map((item) => (
            <Picker.Item label={item.nama} value={item.id} key={item.id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  label: {
    fontSize: FONTSIZE.size_16, fontFamily: FONTFAMILY.poppins_regular, color: COLORS.secondaryLightGreyHex
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondaryLightGreyHex,
    borderRadius: BORDERRADIUS.radius_15,
    paddingHorizontal: SPACING.space_2,
    paddingVertical: 0,
    fontFamily: FONTFAMILY.poppins_extralight
  },
});
