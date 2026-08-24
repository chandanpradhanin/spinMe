import { useFocusEffect } from '@react-navigation/native';
import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

import {
  Button,
  IconActionButton,
  ScreenContainer,
  ScreenHeader,
  SpinWheel,
  WinnerCelebration,
} from '../components';
import { useSpinAnimation, useWheels } from '../hooks';
import { TAB_BAR_OVERLAY_HEIGHT } from '../navigation/FloatingTabBar';
import { addSpinResult } from '../storage';
import { radius, shadows, spacing, typography, useTheme } from '../theme';
import type { WheelSegment } from '../types';
import { shareWheelCapture } from '../utils';
import type { SpinOutcome } from '../domain';

const WHEEL_CARD_PADDING = 32;
const MIN_WHEEL_SIZE = 200;
const MAX_WHEEL_SIZE = 360;

function computeWheelSize(width: number) {
  const maxByWidth = width - spacing.lg * 2 - WHEEL_CARD_PADDING;

  return Math.max(
    MIN_WHEEL_SIZE,
    Math.min(MAX_WHEEL_SIZE, maxByWidth),
  );
}

type SpinWheelPanelProps = {
  rotation: SharedValue<number>;
  segments: WheelSegment[];
  size: number;
};

const SpinWheelPanel = memo(function StableSpinWheelPanel({
  rotation,
  segments,
  size,
}: SpinWheelPanelProps) {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        shadow: {
          alignSelf: 'center',
          borderRadius: radius.wheel,
          ...shadows.medium,
        },
        card: {
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: radius.wheel,
          overflow: 'visible',
          padding: WHEEL_CARD_PADDING / 2,
        },
      }),
    [],
  );

  return (
    <View collapsable={false} shouldRasterizeIOS style={styles.shadow}>
      <View collapsable={false} style={styles.card}>
        <SpinWheel rotation={rotation} segments={segments} size={size} />
      </View>
    </View>
  );
});

export function SpinScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { activeWheel, refresh } = useWheels();
  const handleSpinComplete = useCallback((outcome: SpinOutcome) => {
    addSpinResult(outcome.result);
  }, []);

  const { rotation, isSpinning, lastOutcome, spin } = useSpinAnimation({
    onSpinComplete: handleSpinComplete,
  });
  const captureRotation = useSharedValue(0);
  const captureRef = useRef<ComponentRef<typeof ViewShot>>(null);
  const [isSharing, setIsSharing] = useState(false);

  const wheelSize = useMemo(() => computeWheelSize(width), [width]);

  const tabBarClearance =
    TAB_BAR_OVERLAY_HEIGHT + Math.max(insets.bottom, spacing.sm);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          flex: 1,
        },
        body: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          gap: spacing.md,
          paddingBottom: tabBarClearance + spacing.md,
        },
        wheelArea: {
          alignItems: 'center',
          overflow: 'visible',
          paddingBottom: spacing.sm,
        },
        hiddenCapture: {
          left: -9999,
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
        },
        captureCard: {
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: radius.wheel,
          overflow: 'visible',
          padding: WHEEL_CARD_PADDING / 2,
        },
        resultWrap: {
          minHeight: 112,
          overflow: 'visible',
        },
        resultCard: {
          alignItems: 'center',
          alignSelf: 'stretch',
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.input,
          borderWidth: 1,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
          ...shadows.soft,
        },
        winnerBadge: {
          backgroundColor: '#DCFCE7',
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
        },
        winnerBadgeText: {
          color: '#166534',
          fontSize: 11,
          fontWeight: '600',
        },
        resultValue: {
          ...typography.title,
          color: colors.text,
          fontSize: 20,
          marginTop: spacing.xs,
          textAlign: 'center',
        },
        resultSubtext: {
          ...typography.caption,
          color: colors.textSecondary,
          fontWeight: '400',
          marginTop: 2,
          textAlign: 'center',
          textTransform: 'none',
        },
        shareRow: {
          flexDirection: 'row',
          gap: spacing.sm,
        },
        emptyTitle: {
          ...typography.largeTitle,
          color: colors.text,
          textAlign: 'center',
        },
        emptyBody: {
          ...typography.body,
          color: colors.textSecondary,
          marginTop: spacing.sm,
          textAlign: 'center',
        },
      }),
    [colors, tabBarClearance],
  );

  const handleSpin = () => {
    if (!activeWheel) {
      return;
    }

    spin(activeWheel.id, activeWheel.segments);
  };

  const handleShare = async (message: string) => {
    if (!activeWheel || isSharing) {
      return;
    }

    try {
      setIsSharing(true);
      captureRotation.value = rotation.value;
      await new Promise<void>(resolve => {
        requestAnimationFrame(() => resolve());
      });
      await shareWheelCapture({
        captureRef,
        title: activeWheel.name,
        message,
      });
    } catch {
      Alert.alert('Share failed', 'Unable to share the wheel image.');
    } finally {
      setIsSharing(false);
    }
  };

  if (!activeWheel) {
    return (
      <ScreenContainer edgeToEdge gradient>
        <Text style={styles.emptyTitle}>No wheel selected</Text>
        <Text style={styles.emptyBody}>
          Create or select a wheel from the Wheels tab.
        </Text>
      </ScreenContainer>
    );
  }

  const shareMessage = `Spin wheel: ${activeWheel.name}`;

  return (
    <ScreenContainer contentStyle={styles.content} edgeToEdge gradient>
      <View style={styles.body}>
        <ScreenHeader
          compact
          subtitle={`${activeWheel.segments.length} segments`}
          title={activeWheel.name}
        />

        <View style={styles.wheelArea}>
          <SpinWheelPanel
            rotation={rotation}
            segments={activeWheel.segments}
            size={wheelSize}
          />
        </View>

        <View pointerEvents="none" style={styles.hiddenCapture}>
          <ViewShot ref={captureRef} options={{ format: 'png', quality: 1 }}>
            <View style={styles.captureCard}>
              <SpinWheel
                rotation={captureRotation}
                segments={activeWheel.segments}
                size={wheelSize}
              />
            </View>
          </ViewShot>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Button
            disabled={isSpinning}
            label={isSpinning ? 'Spinning…' : 'Spin'}
            onPress={handleSpin}
          />

          <View style={styles.shareRow}>
            <IconActionButton
              compact
              disabled={isSharing || isSpinning}
              hapticType="impact"
              icon="share-outline"
              label="Share Wheel"
              onPress={() => handleShare(shareMessage)}
            />
          </View>

          <View style={styles.resultWrap}>
            {lastOutcome ? (
              <WinnerCelebration
                celebrationKey={lastOutcome.result.id}
                style={styles.resultCard}>
                <View style={styles.winnerBadge}>
                  <Text style={styles.winnerBadgeText}>Winner</Text>
                </View>
                <Text numberOfLines={1} style={styles.resultValue}>
                  {lastOutcome.winner.label}
                </Text>
                <Text style={styles.resultSubtext}>Last spin result</Text>
              </WinnerCelebration>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
