// task 1 - создать таблицу - complete
// task 2 - заполнить таблицу - complete
// task 3 - запустить фильтры - complete
// task 4 - создать стиль - complete
// task 5 - получить данные с их сервера - CORS-защита))
// task 6 - отобразить данные с их сервера

const testRes = [
  {
    price: 9685,
    quantity: 3,
    name: "Бумага для принтера"
  },
  {
    price: 13896,
    quantity: 5,
    name: "Шкаф книжный"
  },
  {
    price: 14739,
    quantity: 5,
    name: "Канцелярский набор"
  }
];

function getData1() {
  const data = JSON.parse(JSON.stringify(testRes));
  return data;
}

async function getData() {
  const url = "http://exercise.develop.maximaster.ru/service/products/";
  const response = await fetch(url);
  if (!response.ok) {
    alert("Ошибка HTTP: " + response.status);
  } else {
    const data = await response.json();
    console.log("data: ", data);
    return data;
  }
}

let data = null;

async function fillTable() {
  if (!data) data = await getData1();

  const tableBody = document.getElementById("tableBody");
  const lowerBound = document.getElementById("priceFrom").value || 0;
  const upperBound = document.getElementById("priceTo").value || 99999;

  tableBody.className = "";
  if (lowerBound > upperBound || (lowerBound || upperBound) < 0) {
    tableBody.className = "error";
    tableBody.innerText = "Неправильные значения фильтров!";
  } else {
    let table = createTable(data, lowerBound, upperBound);
    if (table) tableBody.innerHTML = table;
    else {
      tableBody.className = "error";
      tableBody.innerText = "Нет данных, попадающих под условие фильтра!";
    }
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