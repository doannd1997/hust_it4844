let speedRules, steeringRules

const readSpeedRules = function() {
    return speedRules;
}

const readSteeringRules = function() {
    return steeringRules;
}


cc.loader.loadJson("src/fuzzy_processing/speedRules.json",function(error, data){
    speedRules = data
})

cc.loader.loadJson("src/fuzzy_processing/steeringRules.json",function(error, data){
    steeringRules = data
});