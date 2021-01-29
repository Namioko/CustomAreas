prototypefabric.polygon = {
    drawPolygon : function() {
        polygonMode = true;
        pointArray = new Array();
        activeLine = new Path({
            strokeWidth: 2,
            fillColor: new Color(153, 153, 153, 0.5),
            strokeColor: '#999999',
            class:'line'
        });
        return activeLine;
    },
    addPoint : function(options) {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var id = new Date().getTime() + random;
        var circle = new Shape.Circle({
            radius: 5,
           fillColor: '#ffffff',
            strokeColor: '#333333',
            strokeWidth: 0.5,
            center: [(options.event.layerX), (options.event.layerY)],
            id: id,
            class: "point"
        });
        if (pointArray.length == 0) {
            circle.fillColor = "red";
            circle.onMouseDown = function (){
                prototypefabric.polygon.generatePolygon(pointArray);
            };
        }
        activeLine.add(new Point((options.event.layerX), (options.event.layerY)));
        pointArray.push(circle);
    },
    generatePolygon : function(pointArray){
        activeLine.add(new Point(pointArray[0].position.x, pointArray[0].position.y));
        var points = new Array();
        pointArray.forEach(function(point){
            points.push(new Point({
                x:point.position.x,
                y:point.position.y
            }));
            point.remove();
        });
        activeLine.class = "polygon";
        activeLine.fillColor = new Color(255, 0, 0, 0.5);
        activeLine.strokeColor = "red";
        polygonMode = false;
    }
};