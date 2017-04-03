
resizeImages();

function resizeImages() {
     
    var inFolder = Folder(scriptPath() + '/inputs')
    if(inFolder == null) {
        alert("Input folder nok!")
        return;
    }
    
    var outFolder = Folder(scriptPath() + '/outputs');
    if(outFolder == null) {
        alert("Output folder nok!")
        return;
    }
  
    var folders = [];
    folders = getAllSubfolders(inFolder, folders);
    folders.unshift(inFolder); // add current folder to array
    
    if (folders.length == 0) {
        alert("no items found in input folder!")
        return;
    } 
   
    for(var f in folders) {
       var files = folders[f].getFiles(/.+\.(?:jpg|jpe?g|[ew]mf|eps|tiff?|bmp|png)$/i);
       for(var j in files) {
           open(files[j]);
           doc = app.activeDocument; 
           doc.changeMode(ChangeMode.RGB); 
   
           if ((doc.width > doc.height) && (doc.width > UnitValue(800,"px")))
               doc.resizeImage(UnitValue(800,"px"), null, null, ResampleMethod.BICUBIC);
           else if ((doc.width < doc.height) && (doc.height > UnitValue(800,"px")))
               doc.resizeImage(null, UnitValue(600,"px"), null, ResampleMethod.BICUBIC);
              
           var resizedFile = new File(outFolder + "/" + trimFileName(files[j].name) + ' mod ' + getExtension(files[j].name));

           saveForWeb(resizedFile, 60);
           app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
       }
    }
}

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf("."), filename.length)
}
  
function scriptPath() {
    var currentScript = new File($.fileName);  
    return currentScript.path;
}    

function isFolder(item) {
    return !(item instanceof File)
}

function getAllSubfolders(path, outArray) {
    var items = Folder(path).getFiles();
    
    for (var i = 0; i<items.length; i++) {
        if (isFolder(items[i])) {         
            outArray.push(Folder(items[i]));
            getAllSubfolders(items[i].toString(), outArray);
        }
   }
   return outArray;
}

function trimFileName(filename) { 
	   return filename.substring(0, filename.lastIndexOf(".")); 
};

function saveForWeb(resizedFile,jpegQuality) {
    var sfwOptions = new ExportOptionsSaveForWeb(); 
    sfwOptions.format = SaveDocumentType.JPEG; 
    sfwOptions.includeProfile = false; 
    sfwOptions.interlaced = 0; 
    sfwOptions.optimized = true; 
    sfwOptions.quality = jpegQuality; //0-100 
    activeDocument.exportDocument(resizedFile, ExportType.SAVEFORWEB, sfwOptions);
}