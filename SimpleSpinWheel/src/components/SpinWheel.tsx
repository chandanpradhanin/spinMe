import { memo, useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { layoutSegments } from '../domain';
import type { WheelSegment } from '../types';
import { describeArc, getWheelLabelMaxLength, truncateLabel } from '../utils';
import { useTheme } from '../theme';

const DEFAULT_WHEEL_SIZE = 370;
const POINTER_HEIGHT = 34;
const POINTER_WIDTH = 30;
const AnimatedG = Animated.createAnimatedComponent(G);

export const SPIN_WHEEL_POINTER_INSET = POINTER_HEIGHT - 10;

export function getSpinWheelOuterHeight(wheelDiameter: number) {
  return SPIN_WHEEL_POINTER_INSET + wheelDiameter;
}

type WheelGraphicProps = {
  segments: WheelSegment[];
  size: number;
  isDark: boolean;
  surfaceAlt: string;
};

const WheelGraphic = memo(function WheelGraphic({
  segments,
  size,
  isDark,
  surfaceAlt,
}: WheelGraphicProps) {
  const center = size / 2;
  const radiusPx = center - 14;
  const layouts = useMemo(() => layoutSegments(segments), [segments]);
  const segmentStroke = isDark
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(255,255,255,0.85)';
  const labelRadius = radiusPx * 0.76;
  const labelMaxLength = getWheelLabelMaxLength(segments.length);
  const labelFontSize = 15;

  const segmentPaths = useMemo(
    () =>
      layouts.map(layout => {
        const endAngle = layout.startAngle + layout.sweepAngle;

        return (
          <Path
            key={layout.segment.id}
            d={describeArc(
              center,
              center,
              radiusPx,
              layout.startAngle,
              endAngle,
            )}
            fill={layout.segment.color}
            stroke={segmentStroke}
            strokeWidth={2}
          />
        );
      }),
    [center, layouts, radiusPx, segmentStroke],
  );

  const segmentLabels = useMemo(
    () =>
      layouts.map(layout => {
        if (layout.sweepAngle < 18) {
          return null;
        }

        const labelPoint = polarLabelPoint(center, labelRadius, layout.midAngle);
        const labelText = truncateLabel(layout.segment.label, labelMaxLength);
        const labelRotation = getLabelRotation(layout.midAngle);
        const labelOrigin = `${labelPoint.x}, ${labelPoint.y}`;

        return (
          <G key={`${layout.segment.id}-label`}>
            <SvgText
              fill="rgba(0,0,0,0.18)"
              fontSize={labelFontSize}
              fontWeight="700"
              origin={labelOrigin}
              rotation={labelRotation}
              textAnchor="middle"
              x={labelPoint.x}
              y={labelPoint.y + 1}>
              {labelText}
            </SvgText>
            <SvgText
              fill="#FFFFFF"
              fontSize={labelFontSize}
              fontWeight="700"
              origin={labelOrigin}
              rotation={labelRotation}
              textAnchor="middle"
              x={labelPoint.x}
              y={labelPoint.y}>
              {labelText}
            </SvgText>
          </G>
        );
      }),
    [center, labelMaxLength, labelRadius, layouts],
  );

  return (
    <>
      <Circle cx={center} cy={center} fill={surfaceAlt} r={radiusPx + 2} />
      {segmentPaths}
      {segmentLabels}
    </>
  );
});

type SpinWheelProps = {
  segments: WheelSegment[];
  size?: number;
  rotation: SharedValue<number>;
};

function spinWheelPropsAreEqual(prev: SpinWheelProps, next: SpinWheelProps) {
  return (
    prev.rotation === next.rotation &&
    prev.segments === next.segments &&
    prev.size === next.size
  );
}

const isAndroid = Platform.OS === 'android';

export const SpinWheel = memo(SpinWheelComponent, spinWheelPropsAreEqual);

function SpinWheelComponent({
  segments,
  size = DEFAULT_WHEEL_SIZE,
  rotation,
}: SpinWheelProps) {
  const { colors, isDark } = useTheme();
  const center = size / 2;
  const hubRadius = size * 0.045;
  const wheelTop = SPIN_WHEEL_POINTER_INSET;
  const totalHeight = getSpinWheelOuterHeight(size);

  // Rotate inside SVG via AnimatedG. Android needs "deg" strings; iOS uses rotateZ radians.
  const animatedWheelStyle = useAnimatedStyle(() => {
    if (isAndroid) {
      return {
        transform: [
          { translateX: center },
          { translateY: center },
          { rotate: `${rotation.value}deg` },
          { translateX: -center },
          { translateY: -center },
        ],
      };
    }

    return {
      transform: [
        { translateX: center },
        { translateY: center },
        { rotateZ: (rotation.value * Math.PI) / 180 },
        { translateX: -center },
        { translateY: -center },
      ],
    };
  }, [center, rotation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        shell: {
          height: totalHeight,
          width: size,
        },
      }),
    [size, totalHeight],
  );

  const pointerTipY = wheelTop + 2;

  return (
    <View collapsable={false} style={styles.shell}>
      <Svg height={totalHeight} width={size}>
        <G>
          <Polygon
            fill="rgba(15, 23, 42, 0.18)"
            points={getTopPointerPoints(
              center,
              pointerTipY,
              POINTER_WIDTH,
              POINTER_HEIGHT,
              2,
            )}
          />
          <Polygon
            fill={colors.primary}
            points={getTopPointerPoints(
              center,
              pointerTipY,
              POINTER_WIDTH,
              POINTER_HEIGHT,
            )}
          />
          <Circle
            cx={center}
            cy={pointerTipY - POINTER_HEIGHT + 10}
            fill={colors.primaryDark}
            r={7}
          />
          <Circle
            cx={center}
            cy={pointerTipY - POINTER_HEIGHT + 10}
            fill={colors.surface}
            r={4}
          />
        </G>

        <G transform={`translate(0, ${wheelTop})`}>
          <AnimatedG style={animatedWheelStyle}>
            <WheelGraphic
              isDark={isDark}
              segments={segments}
              size={size}
              surfaceAlt={colors.surfaceAlt}
            />
          </AnimatedG>

          <Circle
            cx={center}
            cy={center + 2}
            fill="rgba(15, 23, 42, 0.1)"
            pointerEvents="none"
            r={hubRadius + 3}
          />
          <Circle
            cx={center}
            cy={center}
            fill={colors.surface}
            pointerEvents="none"
            r={hubRadius}
            stroke={colors.border}
            strokeWidth={1.5}
          />
          <Circle
            cx={center}
            cy={center}
            fill={colors.primary}
            pointerEvents="none"
            r={hubRadius * 0.28}
          />
        </G>
      </Svg>
    </View>
  );
}

function getLabelRotation(midAngle: number) {
  const normalized = ((midAngle % 360) + 360) % 360;
  const base = midAngle + 90;

  if (normalized > 90 && normalized < 270) {
    return base + 180;
  }

  return base;
}

function polarLabelPoint(centerPoint: number, radiusValue: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: centerPoint + radiusValue * Math.cos(radians),
    y: centerPoint + radiusValue * Math.sin(radians),
  };
}

function getTopPointerPoints(
  centerX: number,
  tipY: number,
  width: number,
  height: number,
  offsetY = 0,
) {
  const tip = tipY + offsetY;
  const baseY = tip - height + offsetY;
  const halfWidth = width / 2;

  return [
    `${centerX},${tip}`,
    `${centerX - halfWidth},${baseY}`,
    `${centerX + halfWidth},${baseY}`,
  ].join(' ');
}
