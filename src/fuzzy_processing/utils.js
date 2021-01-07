function makeTrapezoid(a, b, c, d) {
  return function (x) {
    if (x >= a && x <= b) return (x - a) / (b - a);
    else if (x >= b && x <= c) return 1;
    else if (x >= c && x <= d) return (d - x) / (d - c);
    else return 0;
  };
}

function makeRightTrapezoid(a, b) {
  return function (x) {
    if (x >= a && x <= b) return (x - a) / (b - a);
    else if (x >= b) return 1;
    else return 0;
  };
}

function makeLeftTrapezoid(a, b) {
  return function (x) {
    if (x <= a) return 1;
    else if (x >= a && x <= b) return (b - x) / (b - a);
    else return 0;
  };
}

function makeTriangle(a, b, c) {
  return function (x) {
    if (x >= a && x <= b) return (x - a) / (b - a);
    else if (x >= b && x <= c) return (c - x) / (c - b);
    else return 0;
  };
}

// module.exports = { makeTriangle, makeLeftTrapezoid, makeTrapezoid, makeRightTrapezoid };
