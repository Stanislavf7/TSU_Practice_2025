let myMap;

ymaps.ready(init);

function init() {
  let myPlacemark;
  myMap = new ymaps.Map(
    "map",
    {
      center: [54.1932, 37.6171],
      zoom: 15
    },
    {
      balloonMaxWidth: 300,
      searchControlProvider: "yandex#search"
    }
  );

  function createPlacemark(coords) {
    return new ymaps.Placemark(
      coords,
      {
        balloonContentFooter: "Координаты щелчка: " + [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(", ")
      },
      {
        preset: "islands#redCircleDotIcon",
        draggable: true
      }
    );
  }

  // Определяем адрес по координатам (обратное геокодирование).
  function getAddress(coords) {
    ymaps.geocode(coords).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);

      myPlacemark.properties.set({
        // В качестве контента балуна задаем строку с адресом объекта.
        balloonContentBody: firstGeoObject.getAddressLine()
      });
    });
  }

  myMap.events.add("click", function (e) {
    let coords = e.get("coords");

    if (myPlacemark) {
      myPlacemark.geometry.setCoordinates(coords);
    } else {
      myPlacemark = createPlacemark(coords);
      myMap.geoObjects.add(myPlacemark);
      myPlacemark.events.add("dragend", function () {
        getAddress(myPlacemark.geometry.getCoordinates());
      });
    }
    getAddress(coords);
    myPlacemark.balloon.open();
  });
}

function serializeForm(formNode) {
  return new FormData(formNode);
}

function validateData(formData) {
  let errors = [];

  formData.forEach((entry) => {
    let [name, value] = entry;
    value = value.trim();
    let regex = /^$/;

    switch (name) {
      case "Телефон":
        regex = /^\d+$/;
        if (!regex.test(value)) errors.push(`Поле "${name}" должно состоять только из цифр!`);
        break;

      case "Email":
        regex = /^.*@{1}.*\.{1}.*$/;
        if (value) if (!regex.test(value)) errors.push(`Поле "${name}" содержит неправильный адрес!`);
        break;

      default:
        break;
    }
  });

  if (!myMap.geoObjects.getLength()) {
    errors.push(`Выберете адрес доставки!`);
  }

  return errors;
}

function mySubmit(event) {
  event.preventDefault();
  let data = serializeForm(myForm);
  let errors = validateData(Array.from(data.entries()));

  if (!errors.length) {
    resMsg.textContent = "Заказ успешно оформлен!";
    if (resMsg.classList.contains("error")) resMsg.classList.remove("error");
  } else {
    resMsg.textContent = errors.join("\n");
    resMsg.classList.add("error");
  }
}

function checkRequired(event) {
  const formNode = event.target.form;
  const requiredFields = myForm.querySelectorAll("input[required]");

  const fillFlag = Array.from(requiredFields).every((input) => input.value.trim() !== "");
  formNode.querySelector("button").disabled = !fillFlag;
}
const myForm = document.getElementById("myForm");
const resMsg = document.getElementById("submitResult");

myForm.addEventListener("input", checkRequired);
myForm.addEventListener("submit", mySubmit); 