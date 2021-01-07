// const {
//   deviationFuzzySets,
//   distanceLightFuzzySets,
//   distanceObstacleFuzzySets,
//   lightStatusFuzzySets,
//   speedFuzzySets,
//   steeringFuzzySets,
// } = require("./fuzzy-sets");
// const { readSpeedRules, readSteeringRules } = require("./rule-readers");

const caculateSteering = function caculateSteering(deviation) {
    const firedFuzzySetsAndFiredValues = findFiredFuzzySetAndValue(deviationFuzzySets, deviation);
    const firedFuzzySets = Object.keys(firedFuzzySetsAndFiredValues);
    const steeringRules = readSteeringRules();
    const subResults = [];
    firedFuzzySets.forEach((firedFuzzySet) => {
        const firedRule = steeringRules.find((rule) => rule.deviation === firedFuzzySet);
    const concludeFuzzySet = steeringFuzzySets.find((fz) => fz.name === firedRule.steering);
    const firedValue = firedFuzzySetsAndFiredValues[firedFuzzySet];

    const subResultFuzzySetMuy = function (x) {
        return Math.min(firedValue, concludeFuzzySet.muy(x));
    };
    const deFuzzyValue = deFuzzy(subResultFuzzySetMuy);
    subResults.push({ weight: firedValue, deFuzzyValue });
});
return integrateSubResult(subResults);
}

const caculateSpeed = function caculateSpeed(distanceObstacle, lightStatus, distanceLight, deviation) {
    const firedFuzzySetAndFiredValue = getAllFiredFuzzySetAndFiredValue(distanceObstacle, lightStatus, distanceLight, deviation); // {light_status_green: 0.667, distance_light_medium: 0.499}
    const firedFuzzySets = Object.keys(firedFuzzySetAndFiredValue);

    const speedRules = readSpeedRules();
    const subResults = []; // {deFuzzyValue: 0.3, weight: 0.2 }
    speedRules.forEach((rule) => {
        const ruleConditions = getRuleCondition(rule);
    if (checkRuleIsFired(firedFuzzySets, ruleConditions)) {
        const subResultFuzzySet = getSubResultFuzzySet(firedFuzzySetAndFiredValue, rule);
        const deFuzzyValue = deFuzzy(subResultFuzzySet);
        const weight = caculateWeight(firedFuzzySetAndFiredValue, ruleConditions);
        subResults.push({ deFuzzyValue, weight });
    }
});
const output = integrateSubResult(subResults);
return output;
}

function getAllFiredFuzzySetAndFiredValue(distanceObstacle, lightStatus, distanceLight, deviation) {
    const firedDistanceObstacleFzs = findFiredFuzzySetAndValue(distanceObstacleFuzzySets, distanceObstacle);
    const firedLightStatusFzs = findFiredFuzzySetAndValue(lightStatusFuzzySets, lightStatus);
    const firedDistanceLightFzs = findFiredFuzzySetAndValue(distanceLightFuzzySets, distanceLight);
    const firedDeviationFzs = findFiredFuzzySetAndValue(deviationFuzzySets, deviation);
    var a = {a: 1, b: 2}
    //const allFiredFzs = Object.assign({}, firedDistanceObstacleFzs, firedLightStatusFzs, firedDistanceLightFzs, firedDeviationFzs);
    var allFiredFzs = {}
    gv.addAttr(allFiredFzs, firedDistanceObstacleFzs)
    gv.addAttr(allFiredFzs, firedLightStatusFzs)
    gv.addAttr(allFiredFzs, firedDistanceLightFzs)
    gv.addAttr(allFiredFzs, firedDeviationFzs)
    return allFiredFzs;
}

function findFiredFuzzySetAndValue(fuzzySets, x) {
    const result = {};
    fuzzySets.forEach((fz) => {
        const firedValue = fz.muy(x);
    if (firedValue > 0) {
        result[fz.name] = firedValue;
    }
});
return result;
}

function getRuleCondition(rule) {
    //const values = Object.values(rule);
    const values = gv.objectValues(rule)
    values.pop();
    return values;
}

function checkRuleIsFired(firedFuzzySets, ruleConditions) {
    //return ruleConditions.every((fuzzySetCondition) => firedFuzzySets.includes(fuzzySetCondition));
    return ruleConditions.every(function(fuzzySetCondition){
        return firedFuzzySets.indexOf(fuzzySetCondition) != -1
    })
}

function caculateWeight(firedFuzzySetAndValue, ruleConditions) {
    let weight = 1;
    ruleConditions.forEach((fuzzySetCondition) => {
        weight *= firedFuzzySetAndValue[fuzzySetCondition];
});
return weight;
}

function getSubResultFuzzySet(firedFuzzySetAndValue, rule) {
    const conditions = getRuleCondition(rule);
    const firedValues = conditions.map((condition) => firedFuzzySetAndValue[condition]);
    const minFiredValue = Math.min(...firedValues);
    //const concludeFuzzySetName = Object.values(rule).pop();
    const concludeFuzzySetName = gv.objectValues(rule).pop();
    const concludeFuzzySet = speedFuzzySets.find((fz) => fz.name === concludeFuzzySetName);
    return function (x) {
        return Math.min(minFiredValue, concludeFuzzySet.muy(x));
    };
}

function deFuzzy(muy, step = 1 / 10000) {
    let ts = 0;
    let ms = 0;
    for (let u = 0; u <= 1; u += step) {
        let mu = muy(u);
        ts += mu * u;
        ms += mu;
    }
    return ts / ms;
}

function integrateSubResult(subResults) {
    let ts = 0;
    let ms = 0;
    subResults.forEach((subResult) => {
        ts += subResult.deFuzzyValue * subResult.weight;
    ms += subResult.weight;
});
return ts / ms;
}


// console.log(caculateSpeed(0.025, 0.8, 0.2, 0.34));
// console.log(caculateSteering(0.8));

// module.exports = { caculateSteering, caculateSpeed };
