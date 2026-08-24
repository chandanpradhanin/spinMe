export type WheelSegment = {
  id: string;
  label: string;
  color: string;
  weight?: number;
};

export type Wheel = {
  id: string;
  name: string;
  segments: WheelSegment[];
  createdAt: number;
  updatedAt: number;
};
