document.addEventListener("DOMContentLoaded", (event) => {
  // creating canvas
  let col = document.getElementById("col");
  let row = document.getElementById("row");
  let but = document.getElementById("but");
  let container = document.getElementById("container");
  let drawingButton = document.getElementById("drawing");
  let isMouseDown = false;
  let toggle = document.getElementById("toggle-lines");
  let displayedPixeSize = document.getElementById("displayedPixeSize");
  let finalePixelSize = document.getElementById("finalePixelSize");
  let drawing = true;

  document.addEventListener("mousedown", () => {
    isMouseDown = true;
  });
  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
  document.addEventListener("keypress", (event) => {
    // console.log(event.key);
    // console.log("aa");

    if (event.key === "d") {
      drawing = true;
      drawingButton.innerText = "Drawing";
    } else if (event.key === "e") {
      drawingButton.innerText = "Eracing";

      drawing = false;
    }
  });

  drawingButton.addEventListener("click", () => {
    drawing = !drawing;
    if (drawing) {
      drawingButton.innerText = "Drawing";
    } else {
      drawingButton.innerText = "Eracing";
    }
  });
  but.addEventListener("click", () => {
    container.innerHTML = "";
    // console.log(col.value, row.value);
    let rowDiv = document.createElement("div");
    let rowDivChild = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.draggable = false;
    rowDivChild.style.height = `${displayedPixeSize.value}px`;
    rowDivChild.draggable = false;
    rowDivChild.id = "pixel";
    rowDivChild.style.width = `${displayedPixeSize.value}px`;
    rowDivChild.style.border = "1px solid black";
    container.style.width = `${row.value * displayedPixeSize.value}px`;

    // rowDivChild.style.backgroundColor = "red";
    for (let i = 0; i < Number(row.value); i++) {
      rowDiv.appendChild(rowDivChild.cloneNode(true));
    }

    for (let i = 0; i < Number(col.value); i++) {
      let clonedRowDiv = container.appendChild(rowDiv.cloneNode(true));
      clonedRowDiv.addEventListener("mouseover", (event) => {
        // drawing
        //   ? (document.body.style.cursor = 'url("./icons/pencill.png"), auto')
        //   : (document.body.style.cursor = 'url("./icons/eracer.png"), auto');

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
    displayedPixeSize.addEventListener("change", () => {
      let children = document.querySelectorAll("#pixel");
      container.style.width = `${row.value * displayedPixeSize.value}px`;

      children.forEach((element) => {
        element.style.height = `${displayedPixeSize.value}px`;
        element.style.width = `${displayedPixeSize.value}px`;
      });
    });
    toggle.addEventListener("click", () => {
      let children = document.querySelectorAll("#pixel");
      children.forEach((element) => {
        element.style.border = element.style.border ? "" : "1px solid black";
      });
      container.style.border = container.style.border ? "" : "1px solid black";
    });
  });

  let colorWheel = document.getElementById("color");
  let curentColor = "rgb(0,0,0)";
  colorWheel.addEventListener("change", () => {
    curentColor = colorWheel.value;
    let historyDiv = document.getElementById("history");
    if (historyDiv.childNodes.length < 10) {
      let historyCube = document.createElement("div");
      historyCube.style.width = "40px";
      historyCube.style.height = "40px";
      historyCube.style.cursor = "pointer";

      historyCube.style.backgroundColor = curentColor;
      historyCube.addEventListener("click", (event) => {
        curentColor = event.target.style.backgroundColor;
        colorWheel.value = rgbToHex(curentColor);
      });
      historyDiv.appendChild(historyCube);
    } else {
      historyDiv.removeChild(historyDiv.lastChild);
      let historyCube = document.createElement("div");
      historyCube.style.width = "25px";
      historyCube.style.height = "25px";
      historyCube.style.cursor = "pointer";

      historyCube.style.backgroundColor = curentColor;
      historyCube.addEventListener("click", (event) => {
        curentColor = event.target.style.backgroundColor;
        colorWheel.value = rgbToHex(curentColor);
      });
      historyDiv.insertBefore(historyCube, historyDiv.firstChild);
    }
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
    const cellSize = finalePixelSize.value ? 10 : finalePixelSize.value;
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
