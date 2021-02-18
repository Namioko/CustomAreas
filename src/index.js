import 'babel-polyfill';
import CustomAreasTool from "./CustomAreasTool";

window.standardAreaSettings = {
    canBeDeleted: true,
    canBeMoved: true,
    canBeResized: true,
    renderColors: {
        fill: "rgba(255, 0, 0, 0.5)",
        stroke: "#ff0000"
    },
    hoverColors: {
        fill: "rgba(0, 255, 0, 0.5)",
        stroke: "#00ff00"
    },
    clickColors: {
        fill: "rgba(0, 0, 255, 0.5)",
        stroke: "#0000ff"
    }
};

window.addEventListener("load", () => {
    new CustomAreasTool({wrapperId: "heatmapWrapper", imageOptions: {src: "./dist/image.jpg", width: 1000, height: 703}});
});