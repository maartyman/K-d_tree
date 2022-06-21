"use strict";
const { performance } = require('perf_hooks');
class KdTree {
    constructor(array) {
        let dimensionOrder = new Array(array[0].length);
        for (let i = 0; i < array[0].length; i++) {
            dimensionOrder[i] = i;
        }
        this.firstNode = this.makeNextNode(array, dimensionOrder, 0);
        //this.printNode(this.firstNode, 0);
    }
    printNode(node, index) {
        console.log(index);
        console.log(node.point);
        console.log("dimension: " + node.dimension);
        if (node.smallerNode != null) {
            this.printNode(node.smallerNode, index + 1);
        }
        if (node.biggerNode != null) {
            this.printNode(node.biggerNode, index + 1);
        }
    }
    makeNextNode(array, dimensionOrder, dimensionOrderIndex) {
        if (dimensionOrderIndex == dimensionOrder.length) {
            dimensionOrderIndex = 0;
        }
        if (array.length == 1) {
            return {
                smallerNode: null,
                point: array[0],
                biggerNode: null,
                dimension: dimensionOrder[dimensionOrderIndex]
            };
        }
        let info = this.findMedian(array, dimensionOrder[dimensionOrderIndex]);
        if (info.smallerArray.length === 0) {
            return {
                smallerNode: null,
                point: info.median,
                biggerNode: this.makeNextNode(info.biggerArray, dimensionOrder, dimensionOrderIndex + 1),
                dimension: dimensionOrder[dimensionOrderIndex]
            };
        }
        if (info.biggerArray.length === 0) {
            return {
                smallerNode: this.makeNextNode(info.smallerArray, dimensionOrder, dimensionOrderIndex + 1),
                point: info.median,
                biggerNode: null,
                dimension: dimensionOrder[dimensionOrderIndex]
            };
        }
        return {
            smallerNode: this.makeNextNode(info.smallerArray, dimensionOrder, dimensionOrderIndex + 1),
            point: info.median,
            biggerNode: this.makeNextNode(info.biggerArray, dimensionOrder, dimensionOrderIndex + 1),
            dimension: dimensionOrder[dimensionOrderIndex]
        };
    }
    findMedian(array, dimension) {
        array.sort((a, b) => {
            if (a[dimension] < b[dimension]) {
                return -1;
            }
            if (a[dimension] > b[dimension]) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });
        //console.log(array);
        return {
            smallerArray: array.slice(0, Math.floor(array.length / 2)),
            median: array[Math.floor(array.length / 2)],
            biggerArray: array.slice(Math.floor(array.length / 2) + 1, array.length),
        };
    }
    getClosestNode(point, node = this.firstNode) {
        let pointInfo = { point: null, distance: null };
        if (point[node.dimension] < node.point[node.dimension]) {
            pointInfo = this.checkChildNodes(point, node, node.smallerNode, node.biggerNode);
        }
        else if (point[node.dimension] > node.point[node.dimension]) {
            pointInfo = this.checkChildNodes(point, node, node.biggerNode, node.smallerNode);
        }
        else {
            pointInfo = this.checkChildNodes(point, node, node.smallerNode, node.biggerNode);
        }
        let tempDistance = KdTree.distance(point, node.point);
        if (pointInfo.distance != null && pointInfo.distance > tempDistance) {
            pointInfo = { point: node.point, distance: tempDistance };
        }
        return pointInfo;
    }
    checkChildNodes(point, node, childNodePoint, otherChildNodePoint) {
        let pointInfo;
        //check child node
        if (childNodePoint != null) {
            pointInfo = this.getClosestNode(point, childNodePoint);
        }
        else {
            pointInfo = {
                point: node.point,
                distance: KdTree.distance(point, node.point)
            };
        }
        //check child node if possibly on other side
        if (pointInfo.distance != null && pointInfo.distance >= Math.abs(node.point[node.dimension] - point[node.dimension])) {
            if (otherChildNodePoint != null) {
                let tempPointInfo = this.getClosestNode(point, otherChildNodePoint);
                if (tempPointInfo.distance != null && tempPointInfo.distance < pointInfo.distance) {
                    pointInfo = tempPointInfo;
                }
            }
        }
        return pointInfo;
    }
    static distance(a, b) {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]) ** 2;
        }
        return Math.sqrt(sum);
    }
}
let numberOfPoints = 100000;
let numberOfDimentions = 3;
let arrayOfPoints = new Array(numberOfPoints);
//[ [ 4, 34 ], [ 10, 35 ], [ 14, 29 ], [ 15, 39 ], [ 22, 8 ] ]
let timeKDTreeBuild = 0;
let timeKDTreeSearch = 0;
let timeOtherSearch = 0;
let counter = 0;
let startTime;
let endTime;
for (let i = 0; i < 10; i++) {
    for (let index = 0; index < numberOfPoints; index++) {
        let tempPoint = [];
        for (let i = 0; i < numberOfDimentions; i++) {
            tempPoint[i] = Math.round(Math.random() * 100);
        }
        arrayOfPoints[index] = tempPoint;
    }
    //console.log(arrayOfPoints);
    startTime = performance.now();
    let kdTree = new KdTree(arrayOfPoints);
    endTime = performance.now();
    timeKDTreeBuild += endTime - startTime;
    let evaluationPoint = [];
    for (let i = 0; i < numberOfDimentions; i++) {
        evaluationPoint[i] = Math.round(Math.random() * 40);
    }
    startTime = performance.now();
    let closestNode = kdTree.getClosestNode(evaluationPoint);
    endTime = performance.now();
    timeKDTreeSearch += endTime - startTime;
    console.log(closestNode);
    let info = { point: [99, 99], distance: 99999999999999999999999999999999999999999999999999999999999999999 };
    let tempDistance;
    startTime = performance.now();
    for (const arrayOfPoint of arrayOfPoints) {
        tempDistance = KdTree.distance(arrayOfPoint, evaluationPoint);
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
timeKDTreeBuild /= counter;
timeKDTreeSearch /= counter;
timeOtherSearch /= counter;
console.log(timeKDTreeBuild);
console.log(timeKDTreeSearch);
console.log(timeOtherSearch);
//# sourceMappingURL=index.js.map