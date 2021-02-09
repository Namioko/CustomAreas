import * as paper from "paper";
import CustomArea from "../CustomArea";

window.paper = paper;

export default class CustomAreasToolViaPaperJS {
    constructor({wrapperId, imageOptions}) {
        this.wrapperId = wrapperId;
        this.imageOptions = imageOptions;

        this.customAreas = [];
        this.pointArray = [];

        this.initialize();
    }

    initialize = () => {
        paper.install(window);

        // window.addEventListener("contextmenu", (event) => {
        //     event.stopPropagation();
        //     event.preventDefault();
        //     return false;
        // });

        this.initializeCanvas();
        this.initializeTool();

        this.resetHelpObjects();

        const areas = JSON.parse(sessionStorage.getItem("areas"));
        // this.drawCustomAreas({areasCoordinates: JSON.parse("[[{\"x\":303,\"y\":130},{\"x\":411,\"y\":152},{\"x\":424,\"y\":240},{\"x\":326,\"y\":250},{\"x\":303,\"y\":130}],[{\"x\":529,\"y\":125},{\"x\":611,\"y\":125},{\"x\":641,\"y\":198},{\"x\":551,\"y\":210},{\"x\":529,\"y\":125}],[{\"x\":455,\"y\":290},{\"x\":529,\"y\":280},{\"x\":595,\"y\":336},{\"x\":455,\"y\":396},{\"x\":377,\"y\":348},{\"x\":451,\"y\":293},{\"x\":455,\"y\":290}]]")});
        this.drawCustomAreas({areas});
    };

    initializeCanvas = () => {
        const {wrapperId, imageOptions} = this;
        const wrapper = document.querySelector(`#${wrapperId}`);
        wrapper.width = imageOptions.width;
        wrapper.height = imageOptions.height;

        const canvas = document.createElement("canvas");
        canvas.width = imageOptions.width;
        canvas.height = imageOptions.height;
        wrapper.appendChild(canvas);

        paper.setup(canvas);

        const image = new Raster({
            source: imageOptions.src,
            position: view.center
        });
        Raster.prototype.rescale = function (width, height) {
            this.scale(width / this.width, height / this.height);
        };
        image.onLoad = () => {
            image.rescale(imageOptions.width, imageOptions.height);
        };

        // const overlayRect = new Rectangle(0, 0, imageOptions.width, imageOptions.height);
        // const overlay = new Path.Rectangle(overlayRect);
        // overlay.fillColor = new Color(0, 0, 0, 0.5);
    };

    initializeTool = () => {
        const tool = new Tool();
        tool.onMouseDown = this.handleMouseDown;
    };

    handleMouseDown = (options) => {
        if (options.event && options.event.button !== 0) return;
        if (options.item && (options.item.class === "point" || options.item.class === "polygon" || options.item.class === "deleteIcon")) return;

        this.addPoint(options);
    };

    addPoint = (options) => {
        let x, y;
        if (options.event) {
            x = options.event.offsetX;
            y = options.event.offsetY;
        } else {
            x = options.point.x;
            y = options.point.y;
        }

        const circle = new Shape.Circle({
            radius: 5,
            fillColor: "#ffffff",
            strokeColor: "#333333",
            strokeWidth: 0.5,
            center: [x, y],
            id: this.pointArray.length + 1,
            class: "point"
        });

        if (this.pointArray.length === 0) {
            circle.fillColor = "red";
            circle.onMouseDown = this.generatePolygonForDesigner;
        }

        this.activeLine.add(new Point(x, y));
        this.pointArray.push(circle);
    };

    generatePolygonForDesigner = () => {
        this.generatePolygon({
            area: {
                canBeDeleted: true,
                canBeMoved: true,
                renderColors: {
                    fill: "#ff000080",
                    stroke: "#ff0000"
                }
            }
        });
    };

    generatePolygon = ({area}) => {
        this.customAreas.push(new CustomArea({
            polygon: this.activeLine,
            handleDelete: this.handleAreaDelete,
            areaSettings: area
        }));

        this.saveAreas();

        this.resetHelpObjects();
    };

    saveAreas = () => {
        sessionStorage.setItem("areas", JSON.stringify(this.customAreas.map((area) => ({
            ...area.areaSettings,
            coordinates: (area.polygon.segments.map((segment) => ({
                x: segment.point.x,
                y: segment.point.y
            }))),
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
        const polygonIndex = this.customAreas.findIndex((area) => area.polygon.id === polygon.id);
        this.customAreas.splice(polygonIndex, 1);

        this.saveAreas();
    };

    resetHelpObjects = () => {
        this.pointArray.forEach((point) => {
            point.remove();
        });
        this.pointArray = [];
        this.activeLine = new Path({
            strokeWidth: 2,
            fillColor: "#99999980",
            strokeColor: "#999999",
            class: "line",
            dashArray: [10, 4]
        });
    };

    // example of coordinates:
    // [{x: 1, y: 1}, {x: 5, y: 5}, {x: 3, y: 7}]
    drawCustomAreas = ({areas}) => {
        areas && areas.forEach((area) => {
            area.coordinates.forEach((pointCoordinates) => this.addPoint(new Segment(new Point(pointCoordinates))));
            this.generatePolygon({area});
        });
    };
}