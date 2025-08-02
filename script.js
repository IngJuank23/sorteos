// ======== Variables y referencias a elementos DOM ======== 
const nombreInput = document.getElementById('nombreInput');
const agregarBtn = document.getElementById('agregarBtn');
const listaNombres = document.getElementById('listaNombres');
const iniciarBtn = document.getElementById('iniciarBtn');
const slotContainer = document.getElementById('slotContainer');
const slotMachine = document.getElementById('slotMachine');
const ganadorDiv = document.getElementById('ganador');
const fondoKawaii = document.getElementById('fondoKawaii');

let participantes = [];
let girando = false;

// ======== Mostrar nombres como etiquetas horizontales ========
function mostrarLista() {
  listaNombres.innerHTML = '';
  participantes.forEach((nombre) => {
    const span = document.createElement('span');
    span.className = 'etiqueta-nombre';
    span.textContent = nombre;
    listaNombres.appendChild(span);
  });
}

// ======== Agregar participante ========
agregarBtn.addEventListener('click', () => {
  const texto = nombreInput.value.trim();
  if (texto === '') {
    alert('Por favor, escribe al menos un nombre válido.');
    return;
  }
  const nombres = texto
    .split('\n')
    .map(linea => linea.trim())
    .filter(linea => linea.length > 0);

  participantes.push(...nombres);
  mostrarLista();
  nombreInput.value = '';
  ganadorDiv.textContent = '';
  actualizarSlotVisual();
});

// ======== Mostrar nombres en la slot machine ========
function actualizarSlotVisual() {
  slotMachine.innerHTML = '';
  participantes.forEach((nombre) => {
    const div = document.createElement('div');
    div.textContent = nombre;
    div.className = 'slot-item';
    slotMachine.appendChild(div);
  });
}

// ======== Función para girar el slot machine vertical ========
function iniciarSorteo() {
  if (girando || participantes.length === 0) return;
  girando = true;
  ganadorDiv.textContent = '';

  actualizarSlotVisual();

  const repeticiones = 30 + Math.floor(Math.random() * 30);
  const alturaItem = 70; // Estimado, puede ajustarse
  let totalDesplazamiento = 0;

  const targetIndex = Math.floor(Math.random() * participantes.length);
  const desplazamientoFinal = (repeticiones + targetIndex) * alturaItem;

  slotMachine.style.transition = 'transform 2.5s cubic-bezier(0.2, 0.7, 0.3, 1)';
  slotMachine.style.transform = `translateY(-${desplazamientoFinal}px)`;

  setTimeout(() => {
    const ganador = participantes[targetIndex];
    ganadorDiv.textContent = `¡El ganador es: ${ganador}! 🎉`;
    participantes.splice(targetIndex, 1); // eliminar ganador
    mostrarLista();
    girando = false;
    actualizarSlotVisual();
    slotMachine.style.transition = 'none';
    slotMachine.style.transform = 'translateY(0)';
  }, 2600);
}

// ======== Evento para iniciar sorteo ========
iniciarBtn.addEventListener('click', iniciarSorteo);

// ======== Fondo kawaii animado ========
const imagenesValidas = [];
for(let n = 10; n <= 54; n++) {
  imagenesValidas.push(n);
}

function crearFondoKawaii() {
  fondoKawaii.innerHTML = '';
  const columnas = 10;
  const filas = 8;
  const total = columnas * filas;

  for (let i = 0; i < total; i++) {
    const img = document.createElement('img');
    const numImg = imagenesValidas[i % imagenesValidas.length];
    img.src = `assets/kawaii${numImg}.png`;
    img.className = 'kawaii-img';

    const fila = Math.floor(i / columnas);
    const columna = i % columnas;

    let leftBase = (columna + 0.5) * (100 / columnas);
    let topBase = (fila + 0.5) * (100 / filas);

    const offsetX = (Math.random() - 0.5) * (100 / columnas) * 0.4;
    const offsetY = (Math.random() - 0.5) * (100 / filas) * 0.4;

    img.style.left = `${leftBase + offsetX}vw`;
    img.style.top = `${topBase + offsetY}vh`;

    img.style.width = `${40 + Math.random() * 40}px`;
    img.style.animationDuration = `${15 + Math.random() * 15}s`;
    img.style.animationDelay = `${Math.random() * 10}s`;
    img.style.opacity = `${0.7 + Math.random() * 0.3}`;
    img.style.zIndex = '-1';

    fondoKawaii.appendChild(img);
  }
}

window.addEventListener('load', crearFondoKawaii);
