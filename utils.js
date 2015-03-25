"use strict";

// from http://www.html5rocks.com/en/tutorials/file/dndfiles/
function supportsFileAPIs() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList) {
    // Great success! All the File APIs we use are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}
