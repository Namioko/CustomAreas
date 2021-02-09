import * as d3 from "d3";
import CustomArea from "./CustomArea";
import CommonFunctionsUtil from "./CommonFunctionsUtil";

export default class CustomAreasTool {
    constructor({wrapperId, imageOptions}) {
        this.wrapperId = wrapperId;
        this.imageOptions = imageOptions;

        this.customAreas = [];
        this.circles = [];

        this.state = {
            dragging: false,
            drawing: false,
            lastPolygonIndex: 0
        }

        this.initialize();
    }

    initialize = () => {
        // window.addEventListener("contextmenu", (event) => {
        //     event.stopPropagation();
        //     event.preventDefault();
        //     return false;
        // });
        this.initializeImage();

        const areas = JSON.parse(sessionStorage.getItem("areas"));
        this.drawCustomAreas({areas});
    };

    initializeImage = () => {
        const {wrapperId, imageOptions} = this;

        this.svg = d3.select(`#${wrapperId}`).append("svg")
            .attr("height", imageOptions.height)
            .attr("width", imageOptions.width);

        this.svg.append("image")
            .attr("height", imageOptions.height)
            .attr("width", imageOptions.width)
            .attr("href", imageOptions.src);

        this.svg.on("mousedown", this.handleMouseDown);
    };

    handleMouseDown = (event) => {
        if (event && event.button !== 0) return;
        if (event.target && (event.target.tagName !== "image" || event.target.classList.contains("deleteIcon"))) return;

        this.startDrawing();
        this.addPoint(event);
    };

    startDrawing = () => {
        if (!this.state.drawing) {
            this.state.drawing = true;
            this.resetHelpObjects();
        }
    };

    addPoint = (event) => {
        let x, y;
        if (event.offsetX) {
            x = event.offsetX;
            y = event.offsetY;
        } else {
            x = event.point.x;
            y = event.point.y;
        }

        const circle = this.activePolygonWrapper.append("circle");
        circle.attr("cx", x)
            .attr("cy", y)
            .attr("id", `custom-area__circle-${this.circles.length}`)
            .attr("r", 4)
            .attr("fill", this.circles.length === 0 ? "red" : "yellow")
            .attr("stroke", "#000");

        if (this.circles.length === 0) {
            circle.on("click", this.generatePolygonForDesigner);
        }

        if (this.circles.length === 2) {
            this.circles[0].style("cursor", "pointer");
        }


        this.circles.push(circle);
        this.activeLine.attr("points", CommonFunctionsUtil.getCoordinatesFromCircles({circles: this.circles}));
    };

    handleDrag = ({isDragStarted}) => {
        this.state.dragging = isDragStarted;
    }

    checkIfDrawing = () => {
        return this.state.drawing;
    }

    generatePolygonForDesigner = () => {
        this.generatePolygon({
            area: {
                canBeDeleted: true,
                canBeMoved: true,
                canBeResized: true,
                renderColors: {
                    fill: "#ff000080",
                    stroke: "#ff0000"
                },
                hoverColors: {
                    fill: "#00ff0080",
                    stroke: "#00ff00"
                },
                clickColors: {
                    fill: "#0000ff80",
                    stroke: "#0000ff"
                }
            }
        });
    };

    generatePolygon = ({area}) => {
        if (this.circles.length < 3) return;

        this.activeLine.remove();
        this.state.drawing = false;

        this.customAreas.push(new CustomArea({
            index: this.state.lastPolygonIndex,
            polygonWrapper: this.activePolygonWrapper,
            circles: this.circles,
            handleDrag: this.handleDrag,
            checkIfDrawing: this.checkIfDrawing,
            handleDelete: this.handleAreaDelete,
            areaSettings: area
        }));

        this.state.lastPolygonIndex++;

        this.saveAreas();
    };

    saveAreas = () => {
        sessionStorage.setItem("areas", JSON.stringify(this.customAreas.map((area) => ({
            ...area.areaSettings,
            points: area.polygon.attr("points"),
            hoverColors: {
                fill: "#00ff0080",
                stroke: "#00ff00"
            },
            clickColors: {
                fill: "#0000ff80",
                stroke: "#0000ff"
            }
        }))));
    };

    handleAreaDelete = (polygon) => {
        const polygonIndex = this.customAreas.findIndex((area) => area.polygon.attr("id") === polygon.attr("id"));
        this.customAreas.splice(polygonIndex, 1);

        this.saveAreas();
    };

    resetHelpObjects = () => {
        this.circles = [];
        this.activePolygonWrapper = this.svg.append("g");
        this.activeLine = this.activePolygonWrapper.append("polyline")
            .style("fill", "none")
            .attr("stroke", "#000");
    };

    drawCustomAreas = ({areas}) => {
        areas && areas.length > 0 && areas.forEach((area) => {
            this.startDrawing();
            const points = area.points.split(",");
            for (let i = 0; i < points.length; i+=2) {
                this.addPoint({
                    point: {
                        x: parseInt(points[i]),
                        y: parseInt(points[i+1])
                    }
                })
            }
            this.generatePolygon({area});
        });
    };
}