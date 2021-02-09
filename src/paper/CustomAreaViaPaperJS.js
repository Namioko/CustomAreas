import {Tooltip} from "../Tooltip";

export default class CustomAreaViaPaperJS {
    constructor({polygon, handleDelete, areaSettings}) {
        this.polygon = polygon;
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

        this.initialize({handleDelete});
    }

    initialize = ({handleDelete}) => {
        this.customizeLineToPolygon();
        if (this.areaSettings.canBeDeleted) {
            this.addDeleteIcon({handleDelete});
        }

        new Tooltip({
            id: `tooltip-${this.polygon.id}`,
            target: this.polygon,
            content: "test"
        });

        this.polygon.onMouseDrag = this.handleAreaDrag;
        this.polygon.onMouseEnter = this.handleMouseEnter;
        this.polygon.onMouseLeave = this.handleMouseLeave;
        this.polygon.onMouseMove = this.handleMouseMove;
        this.polygon.onClick = this.handleMouseClick;
    };

    customizeLineToPolygon = () => {
        const startPoint = this.polygon.segments[0].point;
        this.polygon.add(new Point(startPoint.x, startPoint.y));
        this.polygon.class = "polygon";
        this.polygon.fillColor = this.areaSettings.renderColors.fill;
        this.polygon.strokeColor = this.areaSettings.renderColors.stroke;
        this.polygon.dashArray = [];
    };

    addDeleteIcon = ({handleDelete}) => {
        const startPointPosition = this.polygon.segments[0].point;
        this.deleteIcon = new Raster({
            source: "./dist/bt-delete.png",
            position: startPointPosition,
            class: "deleteIcon"
        });

        this.deleteIcon.onClick = () => {
            handleDelete(this.polygon);

            this.polygon.remove();
            this.deleteIcon.remove();
        };
    };

    handleAreaDrag = (options) => {
        // event.button doesn't work correctly in drag event, event.buttons seems to have the value that should be in event.button
        if (options.event && options.event.buttons !== 1) return;

        const elementsToChangePosition = [this.polygon, this.deleteIcon];
        elementsToChangePosition.forEach((element) => {
            if (!element) return;
            element.setPosition(element.position.add(options.delta));
        });
    };

    handleMouseMove = () => {
        const {handleMouseMove} = this.areaSettings;
        handleMouseMove && handleMouseMove();
    };

    handleMouseEnter = () => {
        const {hoverColors} = this.areaSettings;

        if (hoverColors) {
            this.polygon.fillColor = hoverColors.fill;
            this.polygon.strokeColor = hoverColors.stroke;
        }
    };

    handleMouseLeave = () => {
        const {renderColors} = this.areaSettings;

        if (!this.state.isSelected) {
            this.polygon.fillColor = renderColors.fill;
            this.polygon.strokeColor = renderColors.stroke;
        }
    };

    handleMouseClick = () => {
        const {clickColors, renderColors, handleMouseClick} = this.areaSettings;

        if (clickColors && !this.state.isSelected) {
            this.polygon.fillColor = clickColors.fill;
            this.polygon.strokeColor = clickColors.stroke;
            this.state.isSelected = true;
        } else {
            this.polygon.fillColor = renderColors.fill;
            this.polygon.strokeColor = renderColors.stroke;
            this.state.isSelected = false;
        }

        handleMouseClick && handleMouseClick();
    }
}