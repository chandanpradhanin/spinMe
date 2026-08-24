import { useMemo, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ScreenContainer, SegmentRow, SpinWheel } from '../components';
import {
  canSpin,
  createSegment,
  DEFAULT_SEGMENT_COLORS,
  MIN_SEGMENTS,
  touchWheel,
  validateWheel,
} from '../domain';
import { useWheels } from '../hooks';
import { TAB_BAR_OVERLAY_HEIGHT } from '../navigation/FloatingTabBar';
import { getWheelById } from '../storage';
import type { WheelSegment } from '../types';
import { radius, shadows, spacing, typography, useTheme } from '../theme';

type WheelEditorScreenProps = {
  wheelId: string;
  onClose: () => void;
};

const PREVIEW_CARD_PADDING = 16;

export function WheelEditorScreen({ wheelId, onClose }: WheelEditorScreenProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { upsertWheel } = useWheels();
  const previewRotation = useSharedValue(0);
  const initialWheel = useMemo(() => getWheelById(wheelId), [wheelId]);
  const [name, setName] = useState(initialWheel?.name ?? 'My Wheel');
  const [segments, setSegments] = useState<WheelSegment[]>(
    initialWheel?.segments ?? [],
  );

  const previewSize = useMemo(
    () =>
      Math.max(
        160,
        Math.min(220, width - spacing.lg * 2 - PREVIEW_CARD_PADDING * 2),
      ),
    [width],
  );

  const tabBarClearance =
    TAB_BAR_OVERLAY_HEIGHT + Math.max(insets.bottom, spacing.sm);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
        },
        header: {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: spacing.xl,
        },
        title: {
          ...typography.subtitle,
          color: colors.text,
        },
        label: {
          ...typography.label,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        nameInput: {
          ...typography.body,
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.input,
          color: colors.text,
          marginBottom: spacing.lg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
        },
        segmentHeader: {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        },
        listContainer: {
          flex: 1,
          minHeight: 0,
        },
        previewSection: {
          alignItems: 'center',
          paddingBottom: tabBarClearance,
          paddingTop: spacing.md,
        },
        previewLabel: {
          ...typography.label,
          color: colors.textSecondary,
          marginBottom: spacing.sm,
        },
        previewCard: {
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: radius.wheel,
          padding: PREVIEW_CARD_PADDING,
          ...shadows.soft,
        },
        previewPlaceholder: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '400',
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.xl,
          textAlign: 'center',
          textTransform: 'none',
        },
        errorText: {
          ...typography.body,
          color: colors.textSecondary,
          marginBottom: spacing.md,
          textAlign: 'center',
        },
      }),
    [colors, tabBarClearance],
  );

  if (!initialWheel) {
    return (
      <ScreenContainer>
        <Text style={styles.errorText}>Wheel not found.</Text>
        <Button label="Back" onPress={onClose} variant="ghost" />
      </ScreenContainer>
    );
  }

  const handleSave = () => {
    const wheel = touchWheel(initialWheel, { name: name.trim(), segments });
    const errors = validateWheel(wheel);

    if (errors.length > 0) {
      Alert.alert('Invalid wheel', errors[0]?.message ?? 'Please fix the form.');
      return;
    }

    upsertWheel(wheel);
    onClose();
  };

  const updateSegment = (segmentId: string, changes: Partial<WheelSegment>) => {
    setSegments(current =>
      current.map(segment =>
        segment.id === segmentId ? { ...segment, ...changes } : segment,
      ),
    );
  };

  const addSegment = () => {
    const color =
      DEFAULT_SEGMENT_COLORS[segments.length % DEFAULT_SEGMENT_COLORS.length];

    setSegments(current => [
      ...current,
      createSegment(`Option ${current.length + 1}`, color),
    ]);
  };

  const deleteSegment = (segmentId: string) => {
    if (segments.length <= MIN_SEGMENTS) {
      Alert.alert(
        'Minimum segments',
        `A wheel needs at least ${MIN_SEGMENTS} segments.`,
      );
      return;
    }

    setSegments(current => current.filter(segment => segment.id !== segmentId));
  };

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<WheelSegment>) => (
    <SegmentRow
      canDelete={segments.length > MIN_SEGMENTS}
      drag={drag}
      isActive={isActive}
      onChangeColor={color => updateSegment(item.id, { color })}
      onChangeLabel={label => updateSegment(item.id, { label })}
      onDelete={() => deleteSegment(item.id)}
      segment={item}
    />
  );

  return (
    <ScreenContainer style={styles.screen}>
      <View style={styles.header}>
        <Button compact label="Back" onPress={onClose} variant="ghost" />
        <Text style={styles.title}>Edit Wheel</Text>
        <Button compact label="Save" onPress={handleSave} />
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        onChangeText={setName}
        placeholder="Wheel name"
        placeholderTextColor={colors.textSecondary}
        style={styles.nameInput}
        value={name}
      />

      <View style={styles.segmentHeader}>
        <Text style={styles.label}>Segments</Text>
        <Button compact label="Add" onPress={addSegment} variant="ghost" />
      </View>

      <View style={styles.listContainer}>
        <DraggableFlatList
          containerStyle={styles.listContainer}
          data={segments}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          onDragEnd={({ data }) => setSegments(data)}
          renderItem={renderItem}
        />
      </View>

      <View style={styles.previewSection}>
        <Text style={styles.previewLabel}>Preview</Text>
        <View style={styles.previewCard}>
          {canSpin(segments) ? (
            <SpinWheel
              rotation={previewRotation}
              segments={segments}
              size={previewSize}
            />
          ) : (
            <Text style={styles.previewPlaceholder}>
              Add at least {MIN_SEGMENTS} segments to preview the wheel.
            </Text>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
