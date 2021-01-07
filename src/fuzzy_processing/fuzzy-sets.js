// const {
//   DEVIATION_FAR_LEFT,
//   DEVIATION_LEFT,
//   DEVIATION_MIDDLE,
//   DEVIATION_RIGHT,
//   DEVIATION_FAR_RIGHT,
//   STEERING_HARD_LEFT,
//   STEERING_LEFT,
//   STEERING_STRAIGHT,
//   STEERING_RIGHT,
//   STEERING_HARD_RIGHT,
//   LIGHT_STATUS_GREEN,
//   LIGHT_STATUS_YELLOW,
//   LIGHT_STATUS_RED,
//   LIGHT_STATUS_LESS_RED,
//   DISTANCE_LIGHT_NEAR,
//   DISTANCE_LIGHT_MEDIUM,
//   DISTANCE_LIGHT_FAR,
//   DISTANCE_OBSTACLE_NEAR,
//   DISTANCE_OBSTACLE_MEDIUM,
//   DISTANCE_OBSTACLE_FAR,
//   SPEED_STOP,
//   SPEED_SLOWER,
//   SPEED_SLOW,
//   SPEED_MEDIUM,
// } = require("./constance");
// const { makeLeftTrapezoid, makeTriangle, makeRightTrapezoid, makeTrapezoid } = require("./utils");

const deviationFuzzySets = [
  { name: DEVIATION_FAR_LEFT, muy: makeLeftTrapezoid(0.25, 0.4) },
  { name: DEVIATION_LEFT, muy: makeTriangle(0.25, 0.4, 0.5) },
  { name: DEVIATION_MIDDLE, muy: makeTriangle(0.4, 0.5, 0.6) },
  { name: DEVIATION_RIGHT, muy: makeTriangle(0.5, 0.6, 0.75) },
  { name: DEVIATION_FAR_RIGHT, muy: makeRightTrapezoid(0.6, 0.75) },
];

const steeringFuzzySets = [
  { name: STEERING_HARD_LEFT, muy: makeLeftTrapezoid(0.25, 0.4) },
  { name: STEERING_LEFT, muy: makeTriangle(0.25, 0.4, 0.5) },
  { name: STEERING_STRAIGHT, muy: makeTriangle(0.4, 0.5, 0.6) },
  { name: STEERING_RIGHT, muy: makeTriangle(0.5, 0.6, 0.75) },
  { name: STEERING_HARD_RIGHT, muy: makeRightTrapezoid(0.6, 0.75) },
];

const lightStatusFuzzySets = [
  { name: LIGHT_STATUS_GREEN, muy: makeLeftTrapezoid(0.25, 0.4) },
  { name: LIGHT_STATUS_GREEN, muy: makeTriangle(0.32, 0.42, 0.54) },
  { name: LIGHT_STATUS_YELLOW, muy: makeTrapezoid(0.44, 0.54, 0.72) },
  { name: LIGHT_STATUS_RED, muy: makeTrapezoid(0.62, 0.66, 0.82, 0.9) },
  { name: LIGHT_STATUS_LESS_RED, muy: makeRightTrapezoid(0.83, 0.92) },
];

const distanceLightFuzzySets = [
  { name: DISTANCE_LIGHT_NEAR, muy: makeLeftTrapezoid(0.15, 0.2) },
  { name: DISTANCE_LIGHT_MEDIUM, muy: makeTrapezoid(0.15, 0.25, 0.35, 0.45) },
  { name: DISTANCE_LIGHT_FAR, muy: makeRightTrapezoid(0.3, 0.5) },
];

const distanceObstacleFuzzySets = [
  { name: DISTANCE_OBSTACLE_NEAR, muy: makeLeftTrapezoid(0.05, 0.2) },
  { name: DISTANCE_OBSTACLE_MEDIUM, muy: makeTrapezoid(0.05, 0.1, 0.25, 0.35) },
  { name: DISTANCE_OBSTACLE_FAR, muy: makeRightTrapezoid(0.2, 0.35) },
];

const speedFuzzySets = [
  { name: SPEED_STOP, muy: makeLeftTrapezoid(0, 0.05) },
  { name: SPEED_SLOWER, muy: makeTriangle(0.025, 0.25, 0.525) },
  { name: SPEED_SLOW, muy: makeTriangle(0.3, 0.6, 0.8) },
  { name: SPEED_MEDIUM, muy: makeRightTrapezoid(0.7, 0.9) },
];

// module.exports = { deviationFuzzySets, steeringFuzzySets, lightStatusFuzzySets, distanceLightFuzzySets, distanceObstacleFuzzySets, speedFuzzySets };
