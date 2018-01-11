setBackgroundColor(255, 0, 0);

function setBackgroundColor(r,g,b) {
    var color = app.backgroundColor;
    color.rgb.red = r;
    color.rgb.green = g;
    color.rgb.blue = b;
    app.backgroundColor = color;
 }