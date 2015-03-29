"use strict";

function processInput(data) {
  var rows = data.split('\n');

  // Accumulate all of the pairs and the errors
  var pairs = [];
  var errors = [];
  var num_rows = rows.length, i;
  for(i = 0; i < num_rows; i++) {
    var row = rows[i].split(',');
    if(row.length > 2) {
      errors.push([i+1, "Comma present in target or rendition, please remove"]);
      continue;
    }
    // Kat's data frequently has leading and trailing whitespaces
    row[0] = row[0].trim();
    row[1] = row[1].trim();

    var targets = row[0].split(' ');
    var renditions = row[1].split(' ');

    if(targets.length != renditions.length) {
      errors.push([
          i+1,
          "".concat(
            "Target and rendition have ",
            targets.length, " and ", renditions.length,
            " words, respectively, please make them match.")])
      continue;
    }

    var num_pairs = targets.length, j;
    for(j = 0; j < num_pairs; j++) {
      pairs.push({
        num: i+1,
        target: targets[j],
        rendition: renditions[j]
      });
    }
  }

  // If there are errors, format and print those
  // otherwise, format and print the output
  var output = '';
  var num_errors = errors.length;
  if(num_errors > 0) {
    for(i = 0; i < num_errors; i++) {
      output = output.concat("Line ", errors[i][0], ": ", errors[i][1], "<br/>");
    }
  } else {
    pairs.sort(function(a, b){
      var at = a.target.toLowerCase();
      var bt = b.target.toLowerCase();
      if(at < bt)
        return -1;
      else if(bt < at)
        return 1;
      return 0;
    });
    num_pairs = pairs.length;
    for(i = 0; i < num_pairs; i++) {
      output = output.concat(
        i+1, ". ",
        pairs[i].target, ", ",
        pairs[i].num, ", ",
        pairs[i].rendition, "<br/>");
    }
  }

  document.getElementById('output').innerHTML = output;
}

document.getElementById('input').addEventListener('change', loadFileAndCall(processInput));
