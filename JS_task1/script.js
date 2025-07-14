function changeBox(isColorChange){
	const box = document.getElementById('myBox');
	
	let width = document.getElementById('box_X').value;
	if (!width || width < 0){
		document.getElementById('box_X').value = null;
		width = 100;
	}
	let height = document.getElementById('box_Y').value;
	if (!height || height < 0){
		document.getElementById('box_Y').value = null;
		height = 100;
	}
	let bgColor = box.style.backgroundColor;
	
	const newStyle = {
		width: `${width}px`,
		height: `${height}px`,
		backgroundColor: isColorChange ? getRandomColor() : bgColor
	};
	Object.assign(box.style, newStyle);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}