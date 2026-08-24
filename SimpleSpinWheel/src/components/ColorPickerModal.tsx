import { useMemo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  radius,
  SEGMENT_COLOR_PALETTE,
  shadows,
  spacing,
  typography,
  useTheme,
} from '../theme';
import { hapticSelection, withHapticPress } from '../utils';

type ColorPickerModalProps = {
  visible: boolean;
  selectedColor: string;
  onClose: () => void;
  onSelect: (color: string) => void;
};

export function ColorPickerModal({
  visible,
  selectedColor,
  onClose,
  onSelect,
}: ColorPickerModalProps) {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          backgroundColor: colors.overlay,
          flex: 1,
          justifyContent: 'flex-end',
        },
        sheet: {
          backgroundColor: colors.card,
          borderTopLeftRadius: radius.card,
          borderTopRightRadius: radius.card,
          paddingBottom: spacing.xl,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          ...shadows.medium,
        },
        title: {
          ...typography.subtitle,
          color: colors.text,
          marginBottom: spacing.lg,
          textAlign: 'center',
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: spacing.md,
          justifyContent: 'center',
        },
        swatch: {
          borderRadius: radius.full,
          height: 44,
          width: 44,
        },
        swatchSelected: {
          borderColor: colors.text,
          borderWidth: 3,
        },
        closeButton: {
          alignItems: 'center',
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.button,
          marginTop: spacing.lg,
          paddingVertical: spacing.md,
        },
        closeText: {
          ...typography.body,
          color: colors.text,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable onPress={withHapticPress(onClose)} style={styles.overlay}>
        <Pressable onPress={() => undefined} style={styles.sheet}>
          <Text style={styles.title}>Choose a color</Text>
          <View style={styles.grid}>
            {SEGMENT_COLOR_PALETTE.map(color => {
              const isSelected = color === selectedColor;

              return (
                <Pressable
                  key={color}
                  onPress={() => {
                    hapticSelection();
                    onSelect(color);
                    onClose();
                  }}
                  style={[
                    styles.swatch,
                    { backgroundColor: color },
                    isSelected && styles.swatchSelected,
                  ]}
                />
              );
            })}
          </View>
          <Pressable onPress={withHapticPress(onClose)} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
