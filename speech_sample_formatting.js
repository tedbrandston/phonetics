"use strict";

function processInput(data) {
  var rows = data.split('\n');
  var output = '';

  var num_rows = rows.length, i;
  for(i = 0; i < num_rows; i++) {
    var row = rows[i].split(',');
    output = output.concat(
      i.toString(), '. ', row[0], '<br/>',
      '[', row[1], ']<br/><br/>');
  }

  document.getElementById('output').innerHTML = output;
}

document.getElementById('input').addEventListener('change', loadFileAndCall(processInput));
