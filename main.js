const svgContainer = document.getElementById("svgContainer");
let svgObjects = [];
const svgType = "circle";
const svgColor = "blue";
const svgRadius = "20";

const tblContainer = document.getElementById("tblContainer");
const tblBody = tblContainer.getElementsByTagName("tbody")[0];

const storageKey = "svgObjects";

svgContainer.addEventListener("click", handleObjectCreation.bind(this));
svgContainer.addEventListener("mousedown", handleObjectMovement.bind(this));

function handleObjectCreation(event) {
  const { offsetX, offsetY } = event;

  if (checkObjectOverlap(offsetX, offsetY)) {
    return;
  }

  svgObjects.push({
    x: offsetX,
    y: offsetY,
    radius: svgRadius,
    datas: {
      name: "",
      type: "",
      color: "",
      price: "",
      status: "",
    },
  });

  saveLocalStorage();
  renderSVGObjects();
  renderTableRows();
}

function handleObjectMovement(event) {
  const { target, offsetX, offsetY } = event;

  if (target.tagName.toLowerCase() === "circle") {
    const svgObject = readSVGObject(target);

    if (svgObject) {
      const initialMouseX = offsetX;
      const initialMouseY = offsetY;
      const initialObjectX = svgObject.x;
      const initialObjectY = svgObject.y;

      const mouseMoveHandler = (event) => {
        const { offsetX, offsetY } = event;

        const deltaX = offsetX - initialMouseX;
        const deltaY = offsetY - initialMouseY;
        const newX = initialObjectX + deltaX;
        const newY = initialObjectY + deltaY;

        svgObject.x = newX;
        svgObject.y = newY;

        saveLocalStorage();
        renderSVGObjects();
        renderTableRows();
      };

      const mouseUpHandler = () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    }
  }
}

function checkObjectOverlap(x, y) {
  for (const object of svgObjects) {
    const distance = Math.sqrt((x - object.x) ** 2 + (y - object.y) ** 2);
    if (distance <= object.radius) {
      return true;
    }
  }
  return false;
}

// CRUD SVG Objects
function createSVGObject(x, y) {
  const svgObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  svgObject.setAttribute("cx", x);
  svgObject.setAttribute("cy", y);
  svgObject.setAttribute("r", svgRadius);
  svgObject.setAttribute("fill", "blue");
  return svgObject;
}

function readSVGObject(svgObject) {
  for (const object of svgObjects) {
    if (object.element === svgObject) {
      return object;
    }
  }
  return null;
}

function deleteSVGObject(svgObject) {
  const objectIndex = svgObjects.indexOf(svgObject);
  console.log(objectIndex);
  if (objectIndex !== -1) {
    const svgCircles = svgContainer.getElementsByTagName("circle");
    const circle = svgCircles[objectIndex];
    circle.remove();
    svgObjects.splice(objectIndex, 1);
  }
}

// CRUD LocalStorage
function saveLocalStorage() {
  localStorage.setItem(storageKey, JSON.stringify(svgObjects));
}

function retrieveLocalStorage() {
  const savedObjects = localStorage.getItem(storageKey);
  if (savedObjects) {
    svgObjects = JSON.parse(savedObjects);
  }
}

function renderSVGObjects() {
  svgContainer.innerHTML = "";

  svgObjects.forEach((object) => {
    const { x, y, radius } = object;
    const svgObject = createSVGObject(x, y, radius);
    object.element = svgObject;
    svgContainer.appendChild(svgObject);
  });
}

function renderTableRows() {
  tblBody.innerHTML = "";

  svgObjects.forEach((object, index) => {
    const row = document.createElement("tr");
    const objectCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.setAttribute("key", index);
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("value", object.datas.name);
    nameInput.addEventListener("input", (event) => {
      object.datas.name = event.target.value;
      saveLocalStorage();
    });
    const typeCell = document.createElement("td");
    const priceCell = document.createElement("td");
    const priceInput = document.createElement("input");
    priceInput.setAttribute("key", index);
    priceInput.setAttribute("type", "text");
    priceInput.setAttribute("value", object.datas.price);
    priceInput.addEventListener("change", (event) => {
      object.datas.price = event.target.value;
      saveLocalStorage();
    });
    const statusCell = document.createElement("td");
    const btnCell = document.createElement("td");
    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("type", "button");
    btnDelete.innerText = "delete";
    btnDelete.addEventListener("click", () => {
      deleteSVGObject(object);
      saveLocalStorage();
      renderSVGObjects();
      renderTableRows();
    });

    objectCell.textContent = index + "-" + object.x + "-" + object.y || "";
    nameCell.appendChild(nameInput);
    typeCell.textContent = object.datas.color || "";
    priceCell.appendChild(priceInput);
    statusCell.textContent = object.datas.status || "";
    btnCell.appendChild(btnDelete);

    row.appendChild(objectCell);
    row.appendChild(nameCell);
    row.appendChild(typeCell);
    row.appendChild(priceCell);
    row.appendChild(statusCell);
    row.appendChild(btnCell);
    tblBody.appendChild(row);
  });
}

function init() {
  console.log("init renderSVGObjects");

  retrieveLocalStorage();
  renderSVGObjects();
  renderTableRows();
}
