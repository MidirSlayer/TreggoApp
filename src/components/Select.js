import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import { colors, spacing, borderRadius, fonts } from '../theme';
import Texto from './Text';

export default function Select({ selectedValue, onValueChange, options = [], placeholder = null, style,
  labelKey = 'label', valueKey = 'value'
}) {
  const [visible, setVisible] = useState(false);

  // Get the label for the currently selected value
  const getSelectedLabel = () => {
    if (!selectedValue) return placeholder || 'Seleccionar...';
    const found = options.find((opt) => {
      const val = opt[valueKey] !== undefined ? opt[valueKey] : (opt.value !== undefined ? opt.value : opt);
      if (val && typeof val === 'object' && selectedValue && typeof selectedValue === 'object') {
        return val.id === selectedValue.id;
      }
      return val === selectedValue;
    });
    if (found) {
      return found[labelKey] !== undefined ? found[labelKey] : (found.label !== undefined ? found.label : String(found));
    }
    return placeholder || 'Seleccionar...';
  };

  const handleSelect = (opt) => {
    const val = opt[valueKey] !== undefined ? opt[valueKey] : (opt.value !== undefined ? opt.value : opt);
    setVisible(false);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  const isPlaceholder = !selectedValue;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)} activeOpacity={0.7}>
        <Texto style={[styles.selectorText, isPlaceholder && styles.placeholderText]} numberOfLines={1}>
          {getSelectedLabel()}
        </Texto>
        <Texto style={styles.arrow}>▼</Texto>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                {placeholder && (
                  <View style={styles.dropdownHeader}>
                    <Texto style={styles.dropdownTitle}>{placeholder}</Texto>
                  </View>
                )}
                <FlatList
                  data={options}
                  keyExtractor={(item, index) => {
                    const val = item[valueKey] !== undefined ? item[valueKey] : (item.value !== undefined ? item.value : item);
                    return val?.id !== undefined ? String(val.id) : String(index);
                  }}
                  renderItem={({ item }) => {
                    const val = item[valueKey] !== undefined ? item[valueKey] : (item.value !== undefined ? item.value : item);
                    const lbl = item[labelKey] !== undefined ? item[labelKey] : (item.label !== undefined ? item.label : String(item));
                    const isSelected = selectedValue && typeof selectedValue === 'object' && val && typeof val === 'object'
                      ? val.id === selectedValue.id
                      : val === selectedValue;

                    return (
                      <TouchableOpacity
                        style={[styles.option, isSelected && styles.optionSelected]}
                        onPress={() => handleSelect(item)}
                        activeOpacity={0.6}
                      >
                        <Texto style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                          {String(lbl)}
                        </Texto>
                      </TouchableOpacity>
                    );
                  }}
                  style={styles.list}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    marginLeft: 5,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 55,
  },
  selectorText: {
    flex: 1,
    fontSize: fonts.body.fontSize,
    color: colors.text,
  },
  placeholderText: {
    color: '#999',
  },
  arrow: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    width: '100%',
    maxHeight: 350,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTitle: {
    fontSize: fonts.body.fontSize,
    fontWeight: 'bold',
    color: colors.text,
  },
  list: {
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  optionSelected: {
    backgroundColor: '#e8f4fd',
  },
  optionText: {
    fontSize: fonts.body.fontSize,
    color: colors.text,
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: colors.primary || '#007AFF',
  },
});
