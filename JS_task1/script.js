const box = document.getElementById('myBox');
const widthInp = document.getElementById('box_X');
const heightInp = document.getElementById('box_Y');
const button = document.getElementById('myButton');


function changeSize(arg, value) {
  if (!value || value < 0) {
    value = 100;
    if (arg === 'w') {
      widthInp.value = '';
    } else {
      heightInp.value = '';
    }
  }
  if (arg === 'w') {
    box.style.width = value + 'px';
  } else {
    box.style.height = value + 'px';
  }

}

widthInp.addEventListener('input', () => changeSize('w', widthInp.value));
heightInp.addEventListener('input', () => changeSize('h', heightInp.value));

function changeColor() {
  box.style.backgroundColor = getRandomColor();
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

button.addEventListener('click', () => {
  changeColor();
});
