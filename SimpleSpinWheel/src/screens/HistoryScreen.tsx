import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { Button, Card, FadeInListItem, ScreenContainer, ScreenHeader } from '../components';
import { clearSpinHistory, getSpinHistory, getWheels } from '../storage';
import { radius, spacing, typography, useTheme } from '../theme';
import type { SpinResult } from '../types';

const FALLBACK_SEGMENT_COLOR = '#94A3B8';

function resolveSegmentColor(
  item: SpinResult,
  wheelsById: Map<string, { name: string; segmentColors: Map<string, string> }>,
) {
  if (item.segmentColor) {
    return item.segmentColor;
  }

  return (
    wheelsById.get(item.wheelId)?.segmentColors.get(item.segmentId) ??
    FALLBACK_SEGMENT_COLOR
  );
}

export function HistoryScreen() {
  const { colors } = useTheme();
  const [history, setHistory] = useState(getSpinHistory);

  useFocusEffect(
    useCallback(() => {
      setHistory(getSpinHistory());
    }, []),
  );

  const wheelsById = useMemo(
    () =>
      new Map(
        getWheels().map(wheel => [
          wheel.id,
          {
            name: wheel.name,
            segmentColors: new Map(
              wheel.segments.map(segment => [segment.id, segment.color]),
            ),
          },
        ]),
      ),
    [history.length],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
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
          marginTop: spacing.lg,
          textAlign: 'center',
        },
        card: {
          marginBottom: spacing.md,
        },
        resultRow: {
          alignItems: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        colorDot: {
          borderColor: 'rgba(15, 23, 42, 0.08)',
          borderRadius: radius.full,
          borderWidth: 1,
          height: 12,
          width: 12,
        },
        result: {
          ...typography.subtitle,
          color: colors.text,
          flex: 1,
        },
        meta: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '400',
          marginTop: spacing.xs,
          textTransform: 'none',
        },
      }),
    [colors],
  );

  return (
    <ScreenContainer style={styles.screen}>
      <ScreenHeader
        action={
          history.length > 0 ? (
            <Button
              compact
              label="Clear"
              onPress={() => {
                clearSpinHistory();
                setHistory([]);
              }}
              variant="ghost"
            />
          ) : undefined
        }
        subtitle={history.length > 0 ? `${history.length} results` : undefined}
        title="History"
      />

      <View style={styles.listContainer}>
        <FlashList
          contentContainerStyle={styles.listContent}
          data={history}
          estimatedItemSize={80}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Spin results will appear here after your first spin.
            </Text>
          }
          renderItem={({ item, index }) => {
            const segmentColor = resolveSegmentColor(item, wheelsById);

            return (
              <FadeInListItem index={index}>
                <Card style={styles.card} variant="flat">
                  <View style={styles.resultRow}>
                    <View
                      style={[styles.colorDot, { backgroundColor: segmentColor }]}
                    />
                    <Text numberOfLines={1} style={styles.result}>
                      {item.segmentLabel}
                    </Text>
                  </View>
                  <Text style={styles.meta}>
                    {wheelsById.get(item.wheelId)?.name ?? 'Unknown wheel'} ·{' '}
                    {new Date(item.spunAt).toLocaleString()}
                  </Text>
                </Card>
              </FadeInListItem>
            );
          }}
        />
      </View>
    </ScreenContainer>
  );
}
