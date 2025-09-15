export type PersonBox = {
  id: number;
  bbox: { x: number; y: number; w: number; h: number };
  leftRaised: boolean;
  rightRaised: boolean;
  raised: boolean;
};

export type Landmarks = { x: number; y: number }[];
