"use strict";

var dataset = [];

function isEmptyRow(row) {
  return row.every(function(val, idx, arr) {return val === "";});
}

// loads, validates, and stores data in a global variable :(
function loadData(data) {
  Papa.parse(data, {
    complete: function(results) {
      dataset = [];
      var errorMessage = "";
      if(results.errors.length > 0) {
        errorMessage = "Ran into trouble parsing csv<br/>";
        var e;
        for(e = 0; e < results.errors.length; e++) {
          errorMessage = errorMessage.concat(
            "Row ", results.errors[e].row, ": ",
            results.errors[e].message, "<br/>");
        }
      }

      var r;
      for(r = 0; r < results.data.length; r++) {
        var row = results.data[r];
        if(row.length !== 5) {
          errorMessage = errorMessage.concat(
            "Row ", r, ": Wrong number of fields.<br/>");
        }
        var f;
        for(f = 0; f < row.length; f++) {
          row[f] = row[f].trim();
          // Catch partially empty rows, but skip totally empty ones
          if(isEmptyRow(row)) {
            continue;
          }
          if(row[f] === "") {
            errorMessage = errorMessage.concat(
              "Row ", r, ": Field ", f, " empty.<br/>");
          }
        }
      }

      if(errorMessage === "") {
        for(r = 0; r < results.data.length; r++) {
          var row = results.data[r];
          if(isEmptyRow(row)) {
            continue;
          }
          dataset.push({
            target: row[0],
            renditionIPA: row[1],
            renditionShape: row[2],
            targetIPA: row[3],
            targetShape: row[4],
          });
        }
        displayData();
      } else {
        document.getElementById('output').innerHTML = errorMessage;
        return;
      }
    }
  });
}

function sortByWordShape(a, b) {
  var al = a.toLowerCase();
  var bl = b.toLowerCase();
  if(al < bl)
    return -1;
  else if(bl < al)
    return 1;
  return 0;
}

// Sorts and renders the loaded data
function displayData() {
  if(document.getElementById('sort_t').checked) {
    dataset.sort(function(a, b) {
      return sortByWordShape(a.targetShape, b.targetShape);
    });
  }
  else if(document.getElementById('sort_r').checked) {
    dataset.sort(function(a, b) {
      return sortByWordShape(a.renditionShape, b.renditionShape);
    });
  }

  // create new table to contain the output data
  var outputElement = document.getElementById('output');
  while(outputElement.hasChildNodes()) {
    outputElement.removeChild(outputElement.firstChild);
  }
  var table = document.createElement('table');
  var header = table.insertRow(0);
  var columns = [
    "target",
    "rendition in IPA",
    "rendition shape",
    "target in IPA",
    "target shape"
  ];
  columns.forEach(function(c) {
    header.appendChild(document.createElement('th'));
    header.lastChild.innerHTML = c;
  });
  outputElement.appendChild(table);

  var d;
  var groupTotal = 0, groupCorrect = 0;
  for(d = 0; d < dataset.length; d++) {
    var data = dataset[d];

    var row = table.insertRow(-1);
    var target = row.insertCell(0);
    var renditionIPA = row.insertCell(1);
    var renditionShape = row.insertCell(2);
    var targetIPA = row.insertCell(3);
    var targetShape = row.insertCell(4);

    target.innerHTML = data.target;
    renditionIPA.innerHTML = data.renditionIPA;
    renditionShape.innerHTML = data.renditionShape;
    targetIPA.innerHTML = data.targetIPA;
    targetShape.innerHTML = data.targetShape;

    // highlight rows with mismatched shapes
    if(data.targetShape !== data.renditionShape) {
      row.style.background = "yellow";
    } else {
      groupCorrect++;
    }

    groupTotal++;

    // the last row for a given group of shapes lists the correct/total
    var hasNext = d + 1 < dataset.length;
    if(!hasNext || (dataset[d+1].targetShape !== data.targetShape)) {
      var totals = row.insertCell(5);
      totals.innerHTML = "".concat(groupCorrect, '/', groupTotal);
      totals.style.background = "lime";
      groupTotal = 0;
      groupCorrect = 0;
    }
  }
}

document.getElementById('input').addEventListener('change', loadFileAndCall(loadData));
document.getElementById('sort_t').addEventListener('change', displayData);
document.getElementById('sort_r').addEventListener('change', displayData);
