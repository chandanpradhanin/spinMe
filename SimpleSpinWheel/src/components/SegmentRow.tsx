import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';

import type { WheelSegment } from '../types';
import { radius, shadows, spacing, typography, useTheme } from '../theme';
import { triggerButtonHaptic } from '../utils';

import { ColorPickerModal } from './ColorPickerModal';

type SegmentRowProps = {
  segment: WheelSegment;
  drag: () => void;
  isActive: boolean;
  onChangeLabel: (label: string) => void;
  onChangeColor: (color: string) => void;
  onDelete: () => void;
  canDelete: boolean;
};

export function SegmentRow({
  segment,
  drag,
  isActive,
  onChangeLabel,
  onChangeColor,
  onDelete,
  canDelete,
}: SegmentRowProps) {
  const { colors } = useTheme();
  const [pickerVisible, setPickerVisible] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: radius.input,
          flexDirection: 'row',
          gap: spacing.sm,
          marginBottom: spacing.sm,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.sm,
        },
        rowActive: {
          ...shadows.soft,
        },
        dragHandle: {
          paddingHorizontal: spacing.xs,
        },
        dragText: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '400',
          textTransform: 'none',
        },
        colorSwatch: {
          borderRadius: radius.sm,
          height: 36,
          width: 36,
        },
        input: {
          ...typography.body,
          color: colors.text,
          flex: 1,
          paddingVertical: spacing.xs,
        },
        deleteButton: {
          alignItems: 'center',
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.full,
          height: 32,
          justifyContent: 'center',
          width: 32,
        },
        deleteDisabled: {
          opacity: 0.35,
        },
        deleteText: {
          color: colors.danger,
          fontSize: 14,
          fontWeight: '600',
        },
      }),
    [colors],
  );

  return (
    <>
      <ScaleDecorator>
        <View style={[styles.row, isActive && styles.rowActive]}>
          <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
            <Text style={styles.dragText}>⋮⋮</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              triggerButtonHaptic('selection');
              setPickerVisible(true);
            }}>
            <View
              style={[styles.colorSwatch, { backgroundColor: segment.color }]}
            />
          </TouchableOpacity>
          <TextInput
            onChangeText={onChangeLabel}
            placeholder="Segment label"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={segment.label}
          />
          <TouchableOpacity
            disabled={!canDelete}
            onPress={() => {
              if (!canDelete) {
                return;
              }

              triggerButtonHaptic('selection');
              onDelete();
            }}
            style={[styles.deleteButton, !canDelete && styles.deleteDisabled]}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </ScaleDecorator>

      <ColorPickerModal
        onClose={() => setPickerVisible(false)}
        onSelect={onChangeColor}
        selectedColor={segment.color}
        visible={pickerVisible}
      />
    </>
  );
}
