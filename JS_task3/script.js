let data = null;
const button = document.getElementById("update");

async function getData() {
  const url = "http://exercise.develop.maximaster.ru/service/products/";
  const response = await fetch(url);
  if (!response.ok) {
    alert("Ошибка HTTP: " + response.status);
  } else {
    const data = await response.json();
    return data;
  }
}

button.addEventListener("click", async () => {
  data = await getData();
  fillTable();
})

const lowerBound = document.getElementById("priceFrom")
const upperBound = document.getElementById("priceTo")

function fillTable() {

  if (data) {

    const tableBody = document.getElementById("tableBody");
    const LB = isNaN(parseInt(lowerBound.value)) ? 0 : parseInt(lowerBound.value);
    const UB = isNaN(parseInt(upperBound.value)) ? 99999 : parseInt(upperBound.value);

    tableBody.className = "";
    if ((LB > UB) || (LB < 0) || (UB < 0)) {
      tableBody.className = "error";
      tableBody.innerText = "Неправильные значения фильтров!";
    } else {

      let table = createTable(data, LB, UB);
      if (table) tableBody.innerHTML = table;
      else {
        tableBody.className = "error";
        tableBody.innerText = "Нет данных, попадающих под условие фильтра!";
      }
    }
  } else {
    tableBody.className = "error";
    tableBody.innerText = "Данные не загружены! Нажмите кнопку 'Обновить'.";
  }
}

function createTable(data, lBound, uBound) {
  let tableHTML = `<table>`;

  const headers = ["id", "Название", "Количество", "Цена за единицу", "Сумма"];
  tableHTML += `<thead><tr>`;
  headers.forEach((header) => {
    tableHTML += `<th>${header}</th>`;
  });
  tableHTML += `</tr></thead>`;

  let counter = 0;
  data.forEach((row) => {
    if (lBound <= row.price && row.price <= uBound) {
      counter += 1;
      tableHTML += `
      <tr>
        <td>${counter}</td>
        <td>${row.name}</td>
        <td>${row.quantity}</td>
        <td>${row.price}</td>
        <td>${row.quantity * row.price}</td>
      </tr>
      `;
    }
  });

  tableHTML += `</table>`;
  if (counter > 0) return tableHTML;
  return 0;
}

lowerBound.addEventListener("input", fillTable);
upperBound.addEventListener("input", fillTable);

