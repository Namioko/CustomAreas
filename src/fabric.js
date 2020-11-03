console.log("Fabric");

var min = 99;
var max = 999999;
var polygonMode = true;
var pointArray = new Array();
var lineArray = new Array();
var activeLine;
var activeShape = false;
var canvas
window.addEventListener("load", function(){
    prototypefabric.initCanvas();
});
var prototypefabric = new function () {
    this.initCanvas = function () {
        canvas = window._canvas = new fabric.Canvas('c');
        const image = document.querySelector("#image");
        const fImage = new fabric.Image(image, {
            angle: 0,
            width: image.width,
            height: image.height,
            left: 0,
            top: 0,
            scaleX: 1,
            scaleY: 1
        });
        canvas.setBackgroundImage(fImage);
        canvas.setWidth(image.width);
        canvas.setHeight(image.height);
        //canvas.selection = false;

        canvas.on('mouse:down', function (options) {
            if(options.target && options.target.id == pointArray[0].id){
                prototypefabric.polygon.generatePolygon(pointArray);
            }
            if(polygonMode){
                prototypefabric.polygon.addPoint(options);
            } else {
                polygonMode = true;
                prototypefabric.polygon.drawPolygon();
            }
        });
        canvas.on('mouse:up', function (options) {

        });
        canvas.on('mouse:move', function (options) {
            if(activeLine && activeLine.class == "line"){
                var pointer = canvas.getPointer(options.e);
                activeLine.set({ x2: pointer.x, y2: pointer.y });

                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x:pointer.x,
                    y:pointer.y
                }
                activeShape.set({
                    points: points
                });
                canvas.renderAll();
            }
            canvas.renderAll();
        });
    };
};