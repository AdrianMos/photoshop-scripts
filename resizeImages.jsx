/*
Javascript for resizing batch of images using Adobe Photoshop.

How to use:
  Copy all input filesArray in /inputs.
  Open Adobe Photoshop -> File -> Scripts -> Browse -> select resizeImages.jsx
  All images found in /inputs (including subfoldersArray) are processed and copied to /outputs.
  Warning: different file types are accepted but all images are saved as jpegs !

Copyright (C) 2014, Adrian Raul Mos

This program is free software : you can redistribute it and / or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.If not, see <http://www.gnu.org/licenses/>.*/


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
  
    var foldersArray = [];
    foldersArray = getSubfolders(inFolder, foldersArray);
    foldersArray.unshift(inFolder); // add top folder to array
    
    if (foldersArray.length == 0) {
        alert("no items found in input folder!")
        return;
    } 
   
    for(var i in foldersArray) {
       var filesArray = foldersArray[i].getFiles(/.+\.(?:jpg|jpe?g|[ew]mf|eps|tiff?|bmp|png)$/i);
       for(var j in filesArray) {
           open(filesArray[j]);
           doc = app.activeDocument; 
           doc.changeMode(ChangeMode.RGB); 
   
           // Update the resizing rule here //
           if ((doc.width > doc.height) && (doc.width > UnitValue(800,"px")))
               doc.resizeImage(UnitValue(800,"px"), null, null, ResampleMethod.BICUBIC);
           else if ((doc.width < doc.height) && (doc.height > UnitValue(800,"px")))
               doc.resizeImage(null, UnitValue(600,"px"), null, ResampleMethod.BICUBIC);
           
           // Update the output file naming rule here //
           var outFilename = outFolder + "/" + trimFileName(filesArray[j].name) 
                             + ' mod ' + '.jpeg';
                        
           // Update the image quality here //
           var imageQuality = 60;
           
           var resizedFile = new File(outFilename);
           saveForWeb(resizedFile, imageQuality);
           app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
       }
    }
}

function getExtension(filename) {
    return filename.substring(filename.lastIndexOf("."), filename.length)
}

function trimFileName(filename) { 
	   return filename.substring(0, filename.lastIndexOf(".")); 
};
  
function scriptPath() {
    var currentScript = new File($.fileName);  
    return currentScript.path;
}    

function isFolder(item) {
    return !(item instanceof File)
}

function getSubfolders(path, outArray) {
    var items = Folder(path).getFiles();
    
    for (var i = 0; i<items.length; i++) {
        if (isFolder(items[i])) {         
            outArray.push(Folder(items[i]));
            getSubfolders(items[i].toString(), outArray);
        }
   }
   return outArray;
}

function saveForWeb(resizedFile,imageQuality) {
    var options = new ExportOptionsSaveForWeb(); 
    options.format = SaveDocumentType.JPEG; 
    options.quality = imageQuality; //0-100 
    options.includeProfile = false; 
    options.interlaced = 0; 
    options.optimized = true; 
    activeDocument.exportDocument(resizedFile, ExportType.SAVEFORWEB, options);
}