import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Card,
  Fab,
  FadeInListItem,
  ScreenContainer,
  ScreenHeader,
  WheelPreview,
} from '../components';
import { useWheels } from '../hooks';
import type { Wheel } from '../types';
import { radius, spacing, typography, useTheme } from '../theme';
import { withHapticPress } from '../utils';

import { WheelEditorScreen } from './WheelEditorScreen';

function filterWheels(wheels: Wheel[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return wheels;
  }

  return wheels.filter(
    wheel =>
      wheel.name.toLowerCase().includes(normalized) ||
      wheel.segments.some(segment =>
        segment.label.toLowerCase().includes(normalized),
      ),
  );
}

export function WheelsScreen() {
  const { colors } = useTheme();
  const { wheels, activeWheelId, selectWheel, addWheel, removeWheel, refresh } =
    useWheels();
  const [editingWheelId, setEditingWheelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWheels = useMemo(
    () => filterWheels(wheels, searchQuery),
    [searchQuery, wheels],
  );

  const isSearching = searchQuery.trim().length > 0;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
        },
        searchBar: {
          alignItems: 'center',
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.input,
          flexDirection: 'row',
          gap: spacing.sm,
          marginBottom: spacing.md,
          paddingHorizontal: spacing.md,
        },
        searchInput: {
          ...typography.body,
          color: colors.text,
          flex: 1,
          paddingVertical: spacing.sm + 2,
        },
        clearButton: {
          alignItems: 'center',
          height: 28,
          justifyContent: 'center',
          width: 28,
        },
        listContainer: {
          flex: 1,
        },
        listContent: {
          paddingBottom: 96,
        },
        emptyText: {
          ...typography.body,
          color: colors.textSecondary,
          marginTop: spacing.xl,
          textAlign: 'center',
        },
        card: {
          marginBottom: spacing.md,
        },
        cardInner: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.md,
        },
        cardContent: {
          alignItems: 'center',
          flex: 1,
          flexDirection: 'row',
          gap: spacing.md,
        },
        cardText: {
          flex: 1,
        },
        cardTitleRow: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        cardTitle: {
          ...typography.subtitle,
          color: colors.text,
          flexShrink: 1,
        },
        activeBadge: {
          backgroundColor: '#EEF2FF',
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
        },
        activeBadgeText: {
          color: colors.primary,
          fontSize: 11,
          fontWeight: '600',
        },
        cardMeta: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '400',
          marginTop: spacing.xs,
          textTransform: 'none',
        },
        cardActions: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.xs,
        },
        actionHit: {
          alignItems: 'center',
          borderRadius: radius.full,
          height: 36,
          justifyContent: 'center',
          width: 36,
        },
        actionHitPressed: {
          backgroundColor: colors.surfaceAlt,
        },
      }),
    [colors],
  );

  if (editingWheelId) {
    return (
      <WheelEditorScreen
        wheelId={editingWheelId}
        onClose={() => setEditingWheelId(null)}
      />
    );
  }

  const confirmDelete = (wheel: Wheel) => {
    Alert.alert(
      'Delete wheel',
      `Delete "${wheel.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeWheel(wheel.id),
        },
      ],
    );
  };

  const handleCreateWheel = () => {
    setEditingWheelId(addWheel().id);
  };

  const headerSubtitle = isSearching
    ? `${filteredWheels.length} of ${wheels.length} wheels`
    : `${wheels.length} saved`;

  const emptyMessage = isSearching
    ? `No wheels match "${searchQuery.trim()}".`
    : 'No wheels yet. Tap + to create your first one.';

  return (
    <ScreenContainer style={styles.screen}>
      <ScreenHeader subtitle={headerSubtitle} title="Wheels" />

      <View style={styles.searchBar}>
        <Ionicons color={colors.textSecondary} name="search-outline" size={20} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
          onChangeText={setSearchQuery}
          placeholder="Search wheels or segments"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
        />
        {isSearching ? (
          <Pressable
            accessibilityLabel="Clear search"
            hitSlop={8}
            onPress={withHapticPress(() => setSearchQuery(''))}
            style={styles.clearButton}>
            <Ionicons
              color={colors.textSecondary}
              name="close-circle"
              size={20}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.listContainer}>
        <FlashList
          contentContainerStyle={styles.listContent}
          data={filteredWheels}
          estimatedItemSize={88}
          extraData={activeWheelId}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          }
          renderItem={({ item, index }) => {
            const isActive = item.id === activeWheelId;

            return (
              <FadeInListItem index={index}>
                <Card style={styles.card}>
                  <View style={styles.cardInner}>
                    <Pressable
                      onPress={withHapticPress(() => selectWheel(item.id))}
                      style={styles.cardContent}>
                      <WheelPreview active={isActive} segments={item.segments} />

                      <View style={styles.cardText}>
                        <View style={styles.cardTitleRow}>
                          <Text numberOfLines={1} style={styles.cardTitle}>
                            {item.name}
                          </Text>
                          {isActive ? (
                            <View style={styles.activeBadge}>
                              <Text style={styles.activeBadgeText}>Active</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.cardMeta}>
                          {item.segments.length} segments
                        </Text>
                      </View>
                    </Pressable>

                    <View style={styles.cardActions}>
                      <Pressable
                        accessibilityLabel={`Edit ${item.name}`}
                        hitSlop={8}
                        onPress={withHapticPress(() => setEditingWheelId(item.id))}
                        style={({ pressed }) => [
                          styles.actionHit,
                          pressed && styles.actionHitPressed,
                        ]}>
                        <Ionicons
                          color={colors.textSecondary}
                          name="create-outline"
                          size={20}
                        />
                      </Pressable>
                      <Pressable
                        accessibilityLabel={`Delete ${item.name}`}
                        hitSlop={8}
                        onPress={withHapticPress(() => confirmDelete(item))}
                        style={({ pressed }) => [
                          styles.actionHit,
                          pressed && styles.actionHitPressed,
                        ]}>
                        <Ionicons
                          color={colors.danger}
                          name="trash-outline"
                          size={20}
                        />
                      </Pressable>
                    </View>
                  </View>
                </Card>
              </FadeInListItem>
            );
          }}
        />
      </View>

      <Fab onPress={handleCreateWheel} />
    </ScreenContainer>
  );
}
