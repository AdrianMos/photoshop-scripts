/*
Javascript for resizing batch of images using Adobe Photoshop.

How to use:
  Copy all input files in /inputs.
  Open Adobe Photoshop -> File -> Scripts -> Browse -> select resizeImages.jsx
  All images found in /inputs (including images from subfolders) are processed and copied to /outputs.
  If errors occur, the broken images are copied to the /errors folder.
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
main();

function main() {
  
    var params = { 
        inputFolder: '/inputs',
        outputFolder: '/outputs',
        brokenImagesFolder: '/errors',
        imageQuality: 80,
        callback_generateFilename: generateImageName,
        callback_processImage: processsImageAlgorithm
        };

    processImages(params);

    alert("Operation completed!");
}


function processsImageAlgorithm() {
// Update the image processing algorithm here 
    doc = app.activeDocument; 
     
    setBackgroundColor(255,255,255);
    
    isLandscape = doc.width>doc.height
    if (isLandscape && (doc.width>UnitValue(800,"px")))
        doc.resizeImage(UnitValue(800,"px"),null,null,ResampleMethod.BICUBIC);
    else if (!isLandscape && (doc.height>UnitValue(800,"px")))
        doc.resizeImage(null,UnitValue(600,"px"),null,ResampleMethod.BICUBIC);     
}

function generateImageName(file) {
 // Update the image file naming here
    var fileNameNoExtension = file.name.substring(0, file.name.lastIndexOf("."));
    
    return fileNameNoExtension + ".jpeg";
};
//-------------------------------------------------------------------------------------


function processImages(config) {
    
    var inFolder = Folder(getCurrentPath() + config.inputFolder)
    if(inFolder == null) {
        alert("Input folder nok!");
        return;
    }
        
    var outFolder = Folder(getCurrentPath() + config.outputFolder);
    if(outFolder == null) {
        alert("Output folder nok!");
        return;
    }
    
    var folders = [];
    folders = getSubfolders(inFolder, folders);
    folders.unshift(inFolder); // add top folder to array
    
    for(var f in folders) {
       var files = folders[f].getFiles(/.+\.(?:jpg|jpe?g|[ew]mf|eps|tiff?|bmp|png)$/i)
       
       for(var j in files) {
            try {
                open(files[j]);
                doc = app.activeDocument; 
                doc.changeMode(ChangeMode.RGB); 
                
                
                config.callback_processImage();
                
                var outFilename = outFolder + "/" + config.callback_generateFilename(files[j]);
                
                var resizedFile = new File(outFilename);
                saveForWeb(resizedFile, config.imageQuality);
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);             
            }
            catch(err) {
                copyFileToErrorFolder(files[j],  config.brokenImagesFolder); 
                showBrokenImageMessage(files[j], config.brokenImagesFolder);                
            }
      }
    }  
}


function setBackgroundColor(r,g,b) {
    var color = app.backgroundColor;
    color.rgb.red = r;
    color.rgb.green = g;
    color.rgb.blue = b;
    app.backgroundColor = color;
}
  
  
function showBrokenImageMessage(file, folder) {
    alert("Error while processing imagine: " + file.displayName + 
          ". The image is copied to folder " + folder);
}          


function copyFileToErrorFolder(file, folder) {
    var errorFolder = Folder(getCurrentPath() + folder);
    file.copy(decodeURI(errorFolder) + "/" + file.displayName)       
}


function getCurrentPath() {
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


function saveForWeb(resizedFile, imageQuality) {
    var options = new ExportOptionsSaveForWeb(); 
    options.format = SaveDocumentType.JPEG; 
    options.quality = imageQuality; //0-100 
    options.includeProfile = false; 
    options.interlaced = 0; 
    options.optimized = true; 
    activeDocument.exportDocument(resizedFile, ExportType.SAVEFORWEB, options);
}