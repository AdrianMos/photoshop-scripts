var folders = [];
getSubfolders(currentPath(), folders)
showFolders(folders)

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

function showFolders(folders) {
    var message = "Folders:";
    for(var i in folders) {
        message = message + "  " + folders[i].displayName
    }
    alert(message);
}

function isFolder(item) {
    return !(item instanceof File)
}

function currentPath() {
    var currentScript = new File($.fileName);  
    return currentScript.path;
}  
    