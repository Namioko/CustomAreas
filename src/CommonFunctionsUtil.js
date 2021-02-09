import * as d3 from "d3";

const CommonFunctionsUtil = {
    getCoordinatesFromCircle: (circle) => [circle.attr("cx"), circle.attr("cy")],
    getCoordinatesFromCircles: ({circles}) => {
        return circles.map(CommonFunctionsUtil.getCoordinatesFromCircle);
    }
}

export default CommonFunctionsUtil;