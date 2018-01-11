alert("The current script is located here: " + getCurrentPath())

function getCurrentPath() {
    var currentScript = new File($.fileName);  
    return currentScript.path;
}  