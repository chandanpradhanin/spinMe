import { memo, type ReactElement } from 'react';
import Svg, { Circle, Defs, G, Line, Path, Rect } from 'react-native-svg';

import { ONBOARDING_COLORS } from './constants';
import type { OnboardingIllustrationVariant } from './types';

type OnboardingIllustrationProps = {
  variant: OnboardingIllustrationVariant;
  size?: number;
};

const ONBOARDING_RADIUS = 24;
const WHEEL_SEGMENTS = ['#22C55E', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6'];

function WheelSegments({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <G>
      {WHEEL_SEGMENTS.map((color, index) => {
        const startAngle = (index * 360) / WHEEL_SEGMENTS.length - 90;
        const endAngle = ((index + 1) * 360) / WHEEL_SEGMENTS.length - 90;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return (
          <Path
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={color}
            key={color}
          />
        );
      })}
      <Circle cx={cx} cy={cy} fill="#FFFFFF" r={r * 0.22} />
      <Circle cx={cx} cy={cy} fill={ONBOARDING_COLORS.primary} r={r * 0.08} />
    </G>
  );
}

function DecideIllustration() {
  return (
    <G>
      <Rect
        fill={ONBOARDING_COLORS.illustrationSurface}
        height={280}
        rx={ONBOARDING_RADIUS}
        width={280}
        x={10}
        y={10}
      />
      <WheelSegments cx={150} cy={150} r={78} />
      <Circle
        cx={150}
        cy={72}
        fill="#FFFFFF"
        r={18}
        stroke="#E2E8F0"
        strokeWidth={2}
      />
      <Path
        d="M150 62 L150 78 M142 70 L150 62 L158 70"
        stroke={ONBOARDING_COLORS.primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
      <Circle cx={214} cy={214} fill={ONBOARDING_COLORS.primary} r={28} />
      <Path d="M204 214 L212 206 L220 214 L212 222 Z" fill="#FFFFFF" />
      <Line
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth={3}
        x1={198}
        x2={230}
        y1={214}
        y2={214}
      />
    </G>
  );
}

function TogetherIllustration() {
  return (
    <G>
      <Rect
        fill={ONBOARDING_COLORS.illustrationSurface}
        height={280}
        rx={ONBOARDING_RADIUS}
        width={280}
        x={10}
        y={10}
      />
      <WheelSegments cx={150} cy={152} r={62} />
      {[
        { cx: 62, cy: 88, fill: '#FDE68A' },
        { cx: 238, cy: 88, fill: '#BFDBFE' },
        { cx: 150, cy: 248, fill: '#FBCFE8' },
      ].map(avatar => (
        <G key={`${avatar.cx}-${avatar.cy}`}>
          <Circle cx={avatar.cx} cy={avatar.cy} fill={avatar.fill} r={22} />
          <Circle
            cx={avatar.cx}
            cy={avatar.cy - 4}
            fill="#FFFFFF"
            opacity={0.85}
            r={8}
          />
          <Path
            d={`M ${avatar.cx - 12} ${avatar.cy + 10} Q ${avatar.cx} ${avatar.cy + 22} ${avatar.cx + 12} ${avatar.cy + 10}`}
            fill="#FFFFFF"
            opacity={0.85}
          />
          <Line
            stroke={ONBOARDING_COLORS.primary}
            strokeDasharray="4 4"
            strokeWidth={2}
            x1={avatar.cx}
            x2={150}
            y1={avatar.cy}
            y2={152}
          />
        </G>
      ))}
      <Rect
        fill="#FFFFFF"
        height={34}
        rx={17}
        stroke="#E2E8F0"
        strokeWidth={1.5}
        width={88}
        x={106}
        y={36}
      />
      <Path
        d="M128 53 L142 53 L135 60 L142 67 L128 67"
        fill="none"
        stroke={ONBOARDING_COLORS.primary}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <Line
        stroke={ONBOARDING_COLORS.primary}
        strokeLinecap="round"
        strokeWidth={2.5}
        x1={148}
        x2={172}
        y1={60}
        y2={60}
      />
    </G>
  );
}

function CreateIllustration() {
  return (
    <G>
      <Rect
        fill={ONBOARDING_COLORS.illustrationSurface}
        height={280}
        rx={ONBOARDING_RADIUS}
        width={280}
        x={10}
        y={10}
      />
      <WheelSegments cx={150} cy={132} r={72} />
      <Path
        d="M150 42 C158 42 164 48 164 56 C164 64 158 70 150 70 C142 70 136 64 136 56 C136 48 142 42 150 42 Z M150 74 L150 88"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth={8}
      />
      <Circle cx={150} cy={56} fill={ONBOARDING_COLORS.primary} r={6} />
      {[
        { x: 54, y: 226, color: '#F59E0B' },
        { x: 118, y: 248, color: '#EC4899' },
        { x: 196, y: 248, color: '#22C55E' },
      ].map(chip => (
        <G key={chip.x}>
          <Rect
            fill="#FFFFFF"
            height={34}
            rx={17}
            stroke="#E2E8F0"
            strokeWidth={1.5}
            width={72}
            x={chip.x}
            y={chip.y}
          />
          <Circle cx={chip.x + 16} cy={chip.y + 17} fill={chip.color} r={5} />
        </G>
      ))}
      <Rect
        fill={ONBOARDING_COLORS.primary}
        height={52}
        rx={26}
        width={132}
        x={84}
        y={228}
      />
      <Path
        d="M132 252 L148 252 L140 260 L148 268 L132 268"
        fill="none"
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <Line
        stroke="#FFFFFF"
        strokeLinecap="round"
        strokeWidth={2.5}
        x1={152}
        x2={168}
        y1={260}
        y2={260}
      />
    </G>
  );
}

const ILLUSTRATIONS: Record<
  OnboardingIllustrationVariant,
  () => ReactElement
> = {
  decide: DecideIllustration,
  together: TogetherIllustration,
  create: CreateIllustration,
};

export const OnboardingIllustration = memo(function OnboardingIllustration({
  variant,
  size = 300,
}: OnboardingIllustrationProps) {
  const Illustration = ILLUSTRATIONS[variant];

  return (
    <Svg height={size} viewBox="0 0 300 300" width={size}>
      <Defs />
      <Illustration />
    </Svg>
  );
});
