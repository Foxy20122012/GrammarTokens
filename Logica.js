// Tamaño de la tabla hash
const tableSize = 100;

// Tabla de símbolos vacía
const symbol_table = [];

// Elementos prohibidos para la tabla de símbolos
const forbiddenElements = ['s','a', '!', '"', '#', '$', 'b',
 '&', '\'', '(', ')', ',', '.', ':', ';', '<',
   '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'
,'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W','a', 'b', 'c', 'd',
 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
 's', 't', 'u', 'v', 'w','`','!','#','$','&','°','_','¡','1','2','3','4',
 '5','6','8','9','´','otro-elemento'];

function parseExpression() {
  const expression = document.getElementById('expression').value;

  if (expression) {
    symbol_table.length = 0; // Limpiar la tabla de símbolos

    const elements = extractElements(expression);
    insertElements(elements);

    document.getElementById('result').textContent = '';

    // Mostrar la tabla de símbolos en el resultado
    const tableHtml = generateSymbolTableHtml();
    document.getElementById('symbolTable').innerHTML = tableHtml;
  } else {
    document.getElementById('result').textContent = 'Ingresa una expresión';
    document.getElementById('symbolTable').innerHTML = '';
  }
}

function extractElements(expression) {
  const elements = [];
  let currentElement = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (isLetter(char)) {
      currentElement += char;
    } else if (isOperator(char)) {
      if (currentElement !== '') {
        elements.push(currentElement);
        currentElement = '';
      }

      elements.push(char);
    } else if (char === ' ') {
      if (currentElement !== '') {
        elements.push(currentElement);
        currentElement = '';
      }
    }
  }

  if (currentElement !== '') {
    elements.push(currentElement);
  }

  return elements;
}

function insertElements(elements) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (isVariable(element)) {
      if (forbiddenElements.includes(element.toLowerCase())) {
        continue; // No se permite agregar este elemento a la tabla de símbolos
      }

      Insert(element, 'variable');
    } else if (isOperator(element)) {
      let operatorType;

      if (element === '+') {
        operatorType = 'suma';
      } else if (element === '-') {
        operatorType = 'resta';
      } else if (element === '*') {
        operatorType = 'multiplicacion';
      } else if (element === '/') {
        operatorType = 'division';
      } else if (element === '=') {
        operatorType = 'igual';
      }

      Insert(element, operatorType);
    }
  }
}

function Insert(nombre, tipo) {
  const registro = hash(nombre);

  // Verificar si el registro ya existe en la tabla de símbolos
  let newIndex = registro;
  let collisions = 0;

  while (symbol_table[newIndex] !== undefined) {
    collisions++;
    newIndex = (registro + collisions) % tableSize;
  }

  symbol_table[newIndex] = {
    registro: newIndex,
    nombre: nombre,
    tipo: tipo
  };
}

function generateSymbolTableHtml() {
  let tableHtml = '<table><tr><th>Registro</th><th>Nombre</th><th>Tipo</th></tr>';

  for (let i = 0; i < symbol_table.length; i++) {
    const entry = symbol_table[i];
    if (entry) {
      tableHtml += '<tr><td>' + entry.registro + '</td><td>' + entry.nombre + '</td><td>' + entry.tipo + '</td></tr>';
    }
  }

  tableHtml += '</table>';

  return tableHtml;
}

function hash(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash += nombre.charCodeAt(i);
  }
  return hash % tableSize;
}

function isLetter(char) {
  return /[a-zA-Z]/.test(char);
}

function isOperator(char) {
  return /[\+\-\*\/=]/.test(char);
}

function isVariable(element) {
  return isLetter(element[0]) && !isOperator(element);
}

function restrictLetters(event) {
  const char = String.fromCharCode(event.keyCode || event.which);
  if (forbiddenElements.includes(char.toLowerCase())) {
    event.preventDefault(); // Cancelar la acción predeterminada del evento
  }
}

function searchTable() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  const symbolTable = document.getElementById('symbolTable');
  const rows = symbolTable.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName('td');
    let shouldShowRow = false;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      if (cell.innerHTML.toLowerCase().indexOf(searchValue) > -1) {
        shouldShowRow = true;
        break;
      }
    }

    if (shouldShowRow) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  }
}
