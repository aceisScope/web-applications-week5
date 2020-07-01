let table = document.getElementById("game");
table.onclick = function(event) {
  let td = event.target;
  let row = td.parentNode.rowIndex;
  let col = td.cellIndex;

  document.getElementById("row").value = row;
  document.getElementById("col").value = col;
  document.getElementById("form").submit();
};
