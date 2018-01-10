files = getFilesInFolder(currentPath(), "*.jsx");
showFilenames(files)

function getFilesInFolder(folderPath, filter) {

    var files = Folder(folderPath).getFiles(filter);
    // you can use a regex expression to define the filter: 
    //   folder.getFiles(/.+\.(?:jpg|jpe?g|[ew]mf|eps|tiff?|bmp|png)$/i)
       
    return files;
}

function showFilenames(files) {
    var message = "Files:";
    for(var i in files) {
        message = message + "  " + files[i].displayName
    }
    alert(message);
}

function currentPath() {
    var currentScript = new File($.fileName);  
    return currentScript.path;
}  
    