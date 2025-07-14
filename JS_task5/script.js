let row = window.localStorage.getItem("row") || 3,
	col = window.localStorage.getItem("col") || 3,
	tableData = JSON.parse(window.localStorage.getItem("data") || "{}");

function idk() {
	alert("you press the button");
	return true;
}

function checkBeforeDelete(isRow) {
	let dataChek = true;
	const dataClass = isRow ? `.myCell.r${row}` : `.myCell.c${col}`;
	dataChek = $(dataClass)
		.find("input")
		.map(function () {
			return this.value;
		})
		.get()
		.every((e) => e === null || e === "");

	return dataChek;
}

function removeTableElements(isRow) {
	const dataClass = isRow ? `.myRow.r${row}` : `.myCell.c${col}`;
	$(dataClass).remove();
	if (isRow){
		for (let i = 0; i < col; ++i){
			let key = "r" + (row) + "c" + (i + 1);
			if (tableData[key]) delete tableData[key];
		}
		--row;
	} else {
		for (let i = 0; i < row; ++i){
			let key = "r" + (i + 1) + "c" + (col);
			if (tableData[key]) delete tableData[key];
		}
		--col;
	}
	window.localStorage.setItem("data", JSON.stringify(tableData));
	window.localStorage.setItem("row", row);
	window.localStorage.setItem("col", col);
}

function addTableElements(isRow) {
	if (isRow) {
		let rowHTML = ``;

		rowHTML += `<tr class="myRow r${++row}">`;
		for (let j = 0; j < col; ++j) {
			rowHTML +=
				`<td class="myCell r${row} c${j + 1}">` + 
				`<input type="text" id="r${row}c${j + 1}" readonly="true">` + 
				`</td>`;
		}
		rowHTML += `</tr>`;

		$("#myTable").append(rowHTML);
	} else {
		let colHTML = ``,
			rowToAppendClass = ``;
		++col;
		for (let i = 0; i < row; ++i) {
			rowToAppendClass = `.myRow.r${i + 1}`;
			colHTML =
				`<td class="myCell r${i + 1} c${col}">` + 
				`<input type="text" id="r${i + 1}c${col}" readonly="true">` + 
				`</td>`;
			$(rowToAppendClass).append(colHTML);
		}
	}
	window.localStorage.setItem("row", row);
	window.localStorage.setItem("col", col);
}

function changeTableSize(rowChange, colChange) {
	if ((row == 1 && rowChange < 0) || (col == 1 && colChange < 0)) {
		alert("you can't delete whole table");
		return;
	}

	if (rowChange < 0) {
		if (checkBeforeDelete(1)) {
			removeTableElements(1); 
		} else {
			if (confirm("Вы собираетейсь удалить ячейки с данными")) {
				removeTableElements(1);
			} else idk();
		}
	} else if (rowChange > 0) {
		addTableElements(1);
	}

	if (colChange < 0) {
		if (checkBeforeDelete(0)) {
			removeTableElements(0);
		} else {
			if (confirm("Вы собираетейсь удалить ячейки с данными")) {
				removeTableElements(0);
			} else idk();
		}
	} else if (colChange > 0) {
		addTableElements(0);
	}
}

function addEvents() {
	$("#colPlus").on("click", () => changeTableSize(0, 1));
	$("#colDel").on("click", () => changeTableSize(0, -1));
	$("#rowPlus").on("click", () => changeTableSize(1, 0));
	$("#rowDel").on("click", () => changeTableSize(-1, 0));
	$("#myTable").on("click", "input", () => {
		console.log("event click");
	});
	$("#myTable").on("dblclick", "input", function () {
		console.log("event dblclick");
		this.readOnly = false; 
	});
	$("#myTable").on("blur", "input", function () {
		this.readOnly = true;
		console.log(tableData);
		console.log(tableData[this.id]);
		tableData[this.id] = this.value;
		console.log(tableData[this.id]);
		window.localStorage.setItem("data", JSON.stringify(tableData));
	});
}

function createTable() {
	let tableHTML = ``;

	for (let i = 0; i < row; ++i) {
		tableHTML += `<tr class="myRow r${i + 1}">`;
		for (let j = 0; j < col; ++j) {
			inputValue = tableData?.[`r${i + 1}c${j + 1}`] || '';
			tableHTML += `<td class="myCell r${i + 1} c${j + 1}">` + 
				`<input type="text" id="r${i + 1}c${j + 1}" value="${inputValue}" readonly="true"></td>`;
		}
		tableHTML += `</tr>`;
	}

	$("#myTable").html(tableHTML);
}

$(document).ready(() => {
	addEvents();
	createTable();
}); 