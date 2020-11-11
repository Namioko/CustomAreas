console.log("Paper");

paper.install(window);

var min = 99;
var max = 999999;
var polygonMode = true;
var pointArray = new Array();
var lineArray = new Array();
var activeLine;
var activeShape = false;
var canvas;
window.addEventListener("load", function(){
    prototypefabric.initCanvas();
});
var prototypefabric = new function () {
    this.initCanvas = function () {
        canvas = document.getElementById('c');
        const imageElement = document.getElementById("image")
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        paper.setup(canvas);
        var image = new Raster('image');
        image.position = view.center;
        var tool = new Tool();

        prototypefabric.polygon.drawPolygon();

        tool.onMouseDown = function (options) {
            if (options.item && (options.item.class === "line" || options.item.class === "point" || options.item.class === "polygon")) return;
            if (polygonMode){
                prototypefabric.polygon.addPoint(options);
            } else {
                prototypefabric.polygon.drawPolygon();
            }
        };

        tool.onMouseDrag = function(options) {
            if (options.item.class === "polygon") {
                const activeLine = options.item;
                activeLine.setPosition(activeLine.position.add(options.delta));
            }
        }
    };
};