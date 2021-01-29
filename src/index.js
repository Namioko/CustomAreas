import CustomAreasTool from "./CustomAreasTool";
import setupPolyfills from "./polyfills";

setupPolyfills();

window.addEventListener("load", () => {
    new CustomAreasTool({wrapperId: "heatmapWrapper", imageOptions: {src: "./image.jpg", width: 1000, height: 703}});
});