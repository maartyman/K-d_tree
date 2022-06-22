"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { performance } = require('perf_hooks');
const KdTree_1 = require("./KdTree");
let numberOfPoints = 100000;
let numberOfDimentions = 50;
let arrayOfPoints = new Array(numberOfPoints);
//[ [ 4, 34 ], [ 10, 35 ], [ 14, 29 ], [ 15, 39 ], [ 22, 8 ] ]
let timeKDNormalTreeBuild = 0;
let timeKDHighestTreeBuild = 0;
let timeKDLowestTreeBuild = 0;
let timeKDNormalTreeSearch = 0;
let timeKDHighestTreeSearch = 0;
let timeKDLowestTreeSearch = 0;
let timeOtherSearch = 0;
let counter = 0;
let startTime;
let endTime;
for (let i = 0; i < 20; i++) {
    for (let index = 0; index < numberOfPoints; index++) {
        let tempPoint = [];
        for (let i = 0; i < numberOfDimentions; i++) {
            tempPoint[i] = Math.round(Math.random() * 100);
        }
        arrayOfPoints[index] = tempPoint;
    }
    //console.log(arrayOfPoints);
    startTime = performance.now();
    let kdTreeNormal = new KdTree_1.KdTree(arrayOfPoints, KdTree_1.DimensionOrder.normal);
    endTime = performance.now();
    timeKDNormalTreeBuild += endTime - startTime;
    startTime = performance.now();
    let kdTreeHighestStd = new KdTree_1.KdTree(arrayOfPoints, KdTree_1.DimensionOrder.highestDeviation);
    endTime = performance.now();
    timeKDHighestTreeBuild += endTime - startTime;
    startTime = performance.now();
    let kdTreeLowestStd = new KdTree_1.KdTree(arrayOfPoints, KdTree_1.DimensionOrder.lowestDeviation);
    endTime = performance.now();
    timeKDLowestTreeBuild += endTime - startTime;
    let evaluationPoint = [];
    for (let i = 0; i < numberOfDimentions; i++) {
        evaluationPoint[i] = Math.round(Math.random() * 40);
    }
    startTime = performance.now();
    let closestNode = kdTreeNormal.getClosestNode(evaluationPoint);
    endTime = performance.now();
    timeKDNormalTreeSearch += endTime - startTime;
    console.log(closestNode);
    startTime = performance.now();
    closestNode = kdTreeLowestStd.getClosestNode(evaluationPoint);
    endTime = performance.now();
    timeKDLowestTreeSearch += endTime - startTime;
    console.log(closestNode);
    startTime = performance.now();
    closestNode = kdTreeHighestStd.getClosestNode(evaluationPoint);
    endTime = performance.now();
    timeKDHighestTreeSearch += endTime - startTime;
    console.log(closestNode);
    let info = { point: [99, 99], distance: 99999999999999999999999999999999999999999999999999999999999999999 };
    let tempDistance;
    startTime = performance.now();
    for (const arrayOfPoint of arrayOfPoints) {
        tempDistance = KdTree_1.KdTree.distance(arrayOfPoint, evaluationPoint);
        if (info.distance > tempDistance) {
            info = { point: arrayOfPoint, distance: tempDistance };
        }
    }
    endTime = performance.now();
    timeOtherSearch += endTime - startTime;
    console.log(info);
    console.log(closestNode.distance == info.distance);
    counter++;
    if (closestNode.distance != info.distance) {
        break;
    }
}
timeKDNormalTreeBuild /= counter;
timeKDHighestTreeBuild /= counter;
timeKDLowestTreeBuild /= counter;
timeKDNormalTreeSearch /= counter;
timeKDHighestTreeSearch /= counter;
timeKDLowestTreeSearch /= counter;
timeOtherSearch /= counter;
console.log("kdTree's:");
console.log("Normal:");
console.log(timeKDNormalTreeBuild);
console.log(timeKDNormalTreeSearch);
console.log("lowest:");
console.log(timeKDLowestTreeBuild);
console.log(timeKDLowestTreeSearch);
console.log("highest:");
console.log(timeKDHighestTreeBuild);
console.log(timeKDHighestTreeSearch);
console.log("Other:");
console.log(timeOtherSearch);
//# sourceMappingURL=index.js.map