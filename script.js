document.addEventListener("DOMContentLoaded", (event) => {
  // creating canvas
  let col = document.getElementById("col");
  let row = document.getElementById("row");
  let but = document.getElementById("but");
  let container = document.getElementById("container");
  let drawingButton = document.getElementById("drawing");
  let isMouseDown = false;
  let toggle = document.getElementById("toggle-lines");

  document.addEventListener("mousedown", () => {
    isMouseDown = true;
  });
  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });

  drawingButton.addEventListener("click", () => {
    drawing = !drawing;
    if (drawing) {
      drawingButton.innerText = "Drawing";
    } else {
      drawingButton.innerText = "Eracing";
    }
  });
  let drawing = true;
  but.addEventListener("click", () => {
    container.innerHTML = "";
    // console.log(col.value, row.value);
    let rowDiv = document.createElement("div");
    let rowDivChild = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.draggable = false;
    rowDivChild.style.height = "40px";
    rowDivChild.draggable = false;
    rowDivChild.id = "pixel";
    rowDivChild.style.width = "40px";
    rowDivChild.style.border = "1px solid black";
    // console.log(row.value * 40);
    container.style.width = `${row.value * 40}px`;

    // rowDivChild.style.backgroundColor = "red";
    for (let i = 0; i < Number(row.value); i++) {
      rowDiv.appendChild(rowDivChild.cloneNode(true));
    }

    for (let i = 0; i < Number(col.value); i++) {
      let clonedRowDiv = container.appendChild(rowDiv.cloneNode(true));
      clonedRowDiv.addEventListener("mouseover", (event) => {
        event.preventDefault();
        if (drawing && isMouseDown) {
          event.target.style.backgroundColor = curentColor;
        } else if (!drawing && isMouseDown) {
          event.target.style.backgroundColor = "";
        }
      });
      clonedRowDiv.addEventListener("mousedown", (event) => {
        event.preventDefault();
        if (drawing) {
          event.target.style.backgroundColor = curentColor;
        } else if (!drawing) {
          event.target.style.backgroundColor = "";
        }
      });
    }
    // container.appendChild(rowDiv);
    toggle.addEventListener("click", () => {
      let children = document.querySelectorAll("#pixel");
      // console.log(children);
      children.forEach((element) => {
        element.style.border = element.style.border ? "" : "1px solid black";
      });
      container.style.border = container.style.border ? "" : "1px solid black";

      // children.style.border = "";
    });
  });

  // choosing colors
  let colorWheel = document.getElementById("color");
  let curentColor = "black";

  colorWheel.addEventListener("change", () => {
    curentColor = colorWheel.value;
    console.log(curentColor);
  });
  function rgbToHex(rgb) {
    // Extract the numbers from the rgb string
    const result = rgb.match(/\d+/g);

    if (!result) return null; // If no match is found, return null

    // Convert each RGB component to its hexadecimal form
    const r = parseInt(result[0]).toString(16).padStart(2, "0");
    const g = parseInt(result[1]).toString(16).padStart(2, "0");
    const b = parseInt(result[2]).toString(16).padStart(2, "0");

    // Return the concatenated hex color code
    return `#${r}${g}${b}`.toUpperCase();
  }
  document.getElementById("download-btn").addEventListener("click", () => {
    // getting the colors
    let colorArray = [];
    let tempArray = [];
    const cellSize = 50;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = row.value * cellSize;

    canvas.height = col.value * cellSize;
    let rows = document.getElementById("container").childNodes;

    for (let i = 0; i < rows.length; i++) {
      const elementNodes = rows[i].childNodes;
      for (let j = 0; j < elementNodes.length; j++) {
        const bgColor = elementNodes[j].style.backgroundColor;
        if (bgColor) {
          tempArray.push(rgbToHex(bgColor));
        } else {
          tempArray.push("#FFFFFF"); // Default color if no background is found
        }
      }
      colorArray.push(tempArray);
      tempArray = [];
    }

    // doing canvas stuff
    for (let y = 0; y < colorArray.length; y++) {
      for (let x = 0; x < colorArray[y].length; x++) {
        ctx.fillStyle = colorArray[y][x];
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Convert canvas to data URL in JPEG format
    const dataURL = canvas.toDataURL("image/png");

    // Create a link element and set its href to the data URL
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "image.png";

    // Append the link to the body, click it to trigger the download, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(colorArray);
  });
});
