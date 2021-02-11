import * as d3 from "d3";

const CommonFunctionsUtil = {
    getCoordinatesFromCircle: (circle) => [circle.attr("cx"), circle.attr("cy")],
    getCoordinatesFromCircles: ({circles}) => {
        return circles.map(CommonFunctionsUtil.getCoordinatesFromCircle);
    },
    getMiddleXPointFromPolygon: ({polygonPoints}) => {
        const xPoints = polygonPoints.filter((point, index) => index % 2 === 0);
        const intXPoints = xPoints.map((point) => parseInt(point));
        let result = intXPoints.reduce((result, point) => result + point, 0);
        result /= intXPoints.length;
        result -= Math.min(...intXPoints);
        return result;
    }
}

export default CommonFunctionsUtil;