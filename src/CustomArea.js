import * as d3 from "d3";
import {Tooltip} from "./Tooltip";
import CommonFunctionsUtil from "./CommonFunctionsUtil";

export default class CustomArea {
    constructor({index, polygonWrapper, circles, handleDrag, checkIfDrawing, handleDelete, areaSettings}) {
        this.index = index;
        this.polygonWrapper = polygonWrapper;
        this.circles = circles;
        this.areaSettings = areaSettings;

        if (!areaSettings.renderColors) {
            this.areaSettings.renderColors = {
                fill: "#ff000080",
                stroke: "#ff0000"
            };
        }

        this.state = {
            isSelected: false
        }

        this.handleDrag = handleDrag;
        this.checkIfDrawing = checkIfDrawing;
        this.handleDelete = handleDelete;

        this.initialize();
    }

    initialize = () => {
        const {index, areaSettings: {canBeMoved, canBeDeleted, canBeResized}} =  this;

        this.initializeDragHandlers();
        this.customizeToPolygon();

        if (canBeMoved) {
            this.polygonDragHandler(this.polygon);
        } else {
            if (!canBeResized) {
                this.tooltip = new Tooltip({
                    id: `tooltip-${index}`,
                    targetId: this.polygon.attr("id"),
                    content: `tooltip-${index}`,
                    title: "title"
                });
            }
        }

        if (canBeDeleted) {
            this.addDeleteIcon();
        }

        if (canBeResized) {
            this.addDragHandlerToCircles();
        } else {
            this.circles.forEach((circle) => circle.remove());
            this.circles = [];
        }

        this.polygon.on("mouseenter", this.handleMouseEnter);
        this.polygon.on("mouseleave", this.handleMouseLeave);
        this.polygon.on("mousemove", this.handleMouseMove);
        this.polygon.on("click", this.handleMouseClick);
    };

    customizeToPolygon = () => {
        const {index, circles} = this;
        circles[0].on("click", null);

        this.polygon = this.polygonWrapper.insert("polygon", `#${circles[0].attr("id")}`);
        this.polygon.attr("points", CommonFunctionsUtil.getCoordinatesFromCircles({circles}))
            .attr("id", `custom-area__polygon-${index}`)
            .style("fill", this.areaSettings.renderColors.fill)
            .style("stroke",  this.areaSettings.renderColors.stroke)
            .style("cursor", "pointer");
    };

    addDragHandlerToCircles = () => {
        this.circles.forEach((circle, index) => {
            circle.attr("id", undefined)
                .style("cursor", "pointer");
            if (index === 0) {
                this.circleDragHandlerWithDeleteIcon(circle);
            } else {
                this.circleDragHandler(circle);
            }
        });
    };

    addDeleteIcon = () => {
        const startPointPosition = CommonFunctionsUtil.getCoordinatesFromCircle(this.circles[0]);
        this.deleteIcon = this.polygonWrapper.append("image");
        this.deleteIcon.attr("href", "./dist/bt-delete.png")
            .attr("x", startPointPosition[0] - 15)
            .attr("y", startPointPosition[1] - 15)
            .attr("width", 15)
            .attr("height", 15)
            .attr("class", "deleteIcon")
            .style("cursor", "pointer");

        this.deleteIcon.on("click", () => {
            this.handleDelete(this.polygon);
            this.polygonWrapper.remove();
        });
    };


    initializeDragHandlers = () => {
        const {handleCircleDrag, handlePolygonDrag, updateDeleteIconOnDrag, handleDrag} = this;

        // "function" (but not "=>") is used here to get d3 circle object which fires these events
        // (otherwise, the "drag" event works incorrectly: too slow for user)

        this.circleDragHandler = d3.drag()
            .on("start", function() {
                this.style.cursor = "move";
                handleDrag({isDragStarted: true});
            })
            .on("drag", function(d) {
                handleCircleDrag({d, circle: this});
            })
            .on("end", function() {
                this.style.cursor = "pointer";
                handleDrag({isDragStarted: false});
            });

        this.circleDragHandlerWithDeleteIcon = d3.drag()
            .on("start", function() {
                this.style.cursor = "move";
                handleDrag({isDragStarted: true});
            })
            .on("drag", function (d) {
                handleCircleDrag({d, circle: this});
                updateDeleteIconOnDrag({target: this});
            })
            .on("end", function() {
                this.style.cursor = "pointer";
                handleDrag({isDragStarted: false});
            });

        this.polygonDragHandler = d3.drag()
            .on("start", function() {
                this.style.cursor = "move";
                handleDrag({isDragStarted: true});
            })
            .on("drag", function(d) {
                handlePolygonDrag({d, polygon: this});
                updateDeleteIconOnDrag({target: this});
            })
            .on("end", function() {
                this.style.cursor = "pointer";
                handleDrag({isDragStarted: false});
            });
    };

    handleCircleDrag = ({d, circle}) => {
        if (this.checkIfDrawing()) return;

        const dragCircle = d3.select(circle);
        dragCircle.attr("cx", d.x + d.dx)
            .attr("cy", d.y + d.dy);

        const newPoints = this.getUpdatedPointsForPolygonOnDrag();

        this.polygon.attr("points", newPoints);
    };

    handlePolygonDrag = ({d, polygon}) => {
        if (this.checkIfDrawing()) return;

        const dragPolygon = d3.select(polygon);

        const newPoints = this.getUpdatedPointsForPolygonOnDrag({coordinatesShift: {dx: d.dx, dy: d.dy}});

        dragPolygon.attr("points", newPoints);
    };

    getUpdatedPointsForPolygonOnDrag = ({coordinatesShift} = {}) => {
        const {polygon, circles} = this;
        const newPoints = [];

        if (circles && circles.length > 0) {
            circles.forEach((circle) => {
                let cx = parseInt(circle.attr("cx")), cy = parseInt(circle.attr("cy"));
                if (coordinatesShift) {
                    cx += coordinatesShift.dx;
                    cy += coordinatesShift.dy;
                }
                circle.attr("cx", cx);
                circle.attr("cy", cy);
                newPoints.push([cx, cy]);
            });
        } else {
            const points = polygon.attr("points").split(",");
            points.forEach((point, index) => {
                newPoints.push(parseInt(point) + (index % 2 === 0 ? coordinatesShift.dx : coordinatesShift.dy));
            })
        }

        return newPoints;
    };

    updateDeleteIconOnDrag = ({target}) => {
        const points = this.polygon.attr("points").split(",");
        this.deleteIcon.attr("x", points[0] - 15)
            .attr("y", points[1] - 15);
    };

    handleMouseMove = () => {
        const {handleMouseMove} = this.areaSettings;
        handleMouseMove && handleMouseMove();
    };

    handleMouseEnter = () => {
        const {hoverColors} = this.areaSettings;

        if (hoverColors) {
            this.polygon.style("fill", hoverColors.fill);
            this.polygon.style("stroke", hoverColors.stroke);
        }
    };

    handleMouseLeave = () => {
        const {renderColors} = this.areaSettings;

        if (!this.state.isSelected) {
            this.polygon.style("fill", renderColors.fill);
            this.polygon.style("stroke", renderColors.stroke);
        }
    };

    handleMouseClick = () => {
        const {clickColors, renderColors, handleMouseClick} = this.areaSettings;

        if (clickColors && !this.state.isSelected) {
            this.polygon.style("fill", clickColors.fill);
            this.polygon.style("stroke", clickColors.stroke);
            this.state.isSelected = true;
        } else {
            this.polygon.style("fill", renderColors.fill);
            this.polygon.style("stroke", renderColors.stroke);
            this.state.isSelected = false;
        }

        handleMouseClick && handleMouseClick();
    }
}