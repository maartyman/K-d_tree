type Nullable<T> = T | null;

interface Kd_Node {
    smallerNode: Nullable<Kd_Node>;
    point: number[];
    biggerNode: Nullable<Kd_Node>;
    dimension: number;
}

export enum DimensionOrder {
    normal,
    highestDeviation,
    lowestDeviation
}

export interface PointInfo {
    point: Nullable<number[]>;
    distance: Nullable<number>;
}

export class KdTree {
    firstNode: Kd_Node;
    dimensionOrder: DimensionOrder;

    constructor (array: number[][], dimensionOrder: DimensionOrder = DimensionOrder.normal ) {
        this.dimensionOrder = dimensionOrder;

        this.firstNode = this.makeNextNode(array, 0);

        //this.printNode(this.firstNode, 0);
    }

    private printNode(node: Kd_Node, index: number) {
        console.log(index);
        console.log(node.point);
        console.log("dimension: " + node.dimension)
        if (node.smallerNode != null) {
            this.printNode(node.smallerNode, index + 1);
        }
        if (node.biggerNode != null) {
            this.printNode(node.biggerNode, index + 1);
        }
    }

    private makeNextNode(array : number[][], dimensionOrderIndex: number) : Kd_Node {
        let dimension = this.getDimension(array, dimensionOrderIndex);

        if (array.length == 1) {
            return {
                smallerNode: null,
                point: array[0],
                biggerNode: null,
                dimension:dimension
            };
        }

        let info = this.findMedian(array, dimension);

        if (info.smallerArray.length === 0) {
            return {
                smallerNode: null,
                point: info.median,
                biggerNode: this.makeNextNode(info.biggerArray, dimensionOrderIndex + 1),
                dimension: dimension
            };
        }
        if (info.biggerArray.length === 0) {
            return {
                smallerNode: this.makeNextNode(info.smallerArray, dimensionOrderIndex + 1),
                point: info.median,
                biggerNode: null,
                dimension: dimension
            };
        }

        return {
            smallerNode: this.makeNextNode(info.smallerArray, dimensionOrderIndex + 1),
            point: info.median,
            biggerNode: this.makeNextNode(info.biggerArray, dimensionOrderIndex + 1),
            dimension: dimension
        };
    }

    private getDimension(array: number[][], dimensionOrderIndex: number): number {
        switch (this.dimensionOrder) {
            case DimensionOrder.normal:
                if (dimensionOrderIndex == array[0].length) {
                    dimensionOrderIndex = 0;
                }
                return dimensionOrderIndex;
            case DimensionOrder.highestDeviation:
                //get std of all dimensions, return highest std dimension
                let stdsMax = this.getSTDs(array);
                let maxStd2Index = 0;
                for (const index in stdsMax) {
                    if (stdsMax[maxStd2Index] < stdsMax[index]) {
                        maxStd2Index = parseInt(index);
                    }
                }
                return maxStd2Index;
            case DimensionOrder.lowestDeviation:
                //get std of all dimensions, return lowest std dimension
                let stdsMin = this.getSTDs(array);
                let minStd2Index = 0;
                for (const index in stdsMin) {
                    if (stdsMin[minStd2Index] < stdsMin[index]) {
                        maxStd2Index = parseInt(index);
                    }
                }
                return minStd2Index;
            default:
                if (dimensionOrderIndex == array[0].length) {
                    dimensionOrderIndex = 0;
                }
                return dimensionOrderIndex;
        }
    }

    private getSTDs(array:number[][]):number[] {
        const n = array.length;
        let means = new Array<number>(array[0].length).fill(0);
        for (const point of array) {
            for (const index in point) {
                means[index] += point[index]/n;
            }
        }
        let stds2 = new Array<number>(array[0].length).fill(0);
        for (const point of array){
            for (const index in point) {
                stds2[index] += (point[index] - means[index])**2;
            }
        }
        return stds2;
    }

    private findMedian(array: number[][], dimension: number) : { smallerArray: number[][] , median:number[], biggerArray:number[][] } {
        array.sort((a: number[], b: number[]) => {
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
            smallerArray: array.slice(0, Math.floor(array.length/2)),
            median: array[Math.floor(array.length/2)],
            biggerArray: array.slice(Math.floor(array.length/2)+1, array.length),
        };
    }

    public getClosestNode(point: number[], node: Kd_Node = this.firstNode) : PointInfo {
        let pointInfo : PointInfo = {point: null, distance: null};

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
        if (pointInfo.distance!= null && pointInfo.distance > tempDistance) {
            pointInfo = {point: node.point, distance: tempDistance};
        }

        return pointInfo;
    }

    private checkChildNodes(point:number[], node: Kd_Node, childNodePoint: Nullable<Kd_Node>, otherChildNodePoint: Nullable<Kd_Node>) : PointInfo {
        let pointInfo : PointInfo;

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
        if (pointInfo.distance != null && pointInfo.distance >= Math.abs(node.point[node.dimension]-point[node.dimension])) {
            if (otherChildNodePoint != null) {
                let tempPointInfo = this.getClosestNode(point, otherChildNodePoint);
                if (tempPointInfo.distance != null && tempPointInfo.distance < pointInfo.distance) {
                    pointInfo = tempPointInfo;
                }
            }
        }
        return pointInfo;
    }

    static distance(a:number[], b:number[]) : number {
        let sum = 0;
        for (let i = 0; i < a.length; i++) {
            sum += (a[i]-b[i])**2;
        }
        return Math.sqrt(sum);
    }
}