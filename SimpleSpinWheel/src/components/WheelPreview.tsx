import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { layoutSegments } from '../domain';
import type { WheelSegment } from '../types';
import { useTheme } from '../theme';
import { describeArc } from '../utils';

type WheelPreviewProps = {
  segments: WheelSegment[];
  size?: number;
  active?: boolean;
};

export function WheelPreview({
  segments,
  size = 52,
  active = false,
}: WheelPreviewProps) {
  const { colors } = useTheme();
  const center = size / 2;
  const radiusPx = center - 3;
  const layouts = useMemo(() => layoutSegments(segments), [segments]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        ring: {
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: size / 2 + 4,
          height: size + 8,
          justifyContent: 'center',
          width: size + 8,
        },
        ringActive: {
          backgroundColor: colors.primary,
        },
      }),
    [colors.primary, colors.surface, size],
  );

  return (
    <View style={[styles.ring, active && styles.ringActive]}>
      <Svg height={size} width={size}>
        {layouts.map(layout => {
          const endAngle = layout.startAngle + layout.sweepAngle;

          return (
            <Path
              d={describeArc(
                center,
                center,
                radiusPx,
                layout.startAngle,
                endAngle,
              )}
              fill={layout.segment.color}
              key={layout.segment.id}
              stroke={colors.surface}
              strokeWidth={1}
            />
          );
        })}
      </Svg>
    </View>
  );
}
