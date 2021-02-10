import CustomAreasTool from "./CustomAreasTool";
import setupPolyfills from "./polyfills";

setupPolyfills();

window.standardAreaSettings = {
    canBeDeleted: true,
    canBeMoved: true,
    canBeResized: false,
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
};

window.addEventListener("load", () => {
    new CustomAreasTool({wrapperId: "heatmapWrapper", imageOptions: {src: "./dist/image.jpg", width: 1000, height: 703}});
});