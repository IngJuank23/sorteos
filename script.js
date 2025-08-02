// ======== Variables y referencias a elementos DOM ======== 
const nombreInput = document.getElementById('nombreInput');
const agregarBtn = document.getElementById('agregarBtn');
const listaNombres = document.getElementById('listaNombres');
const iniciarBtn = document.getElementById('iniciarBtn');
const ruleta = document.getElementById('ruleta');
const ganadorDiv = document.getElementById('ganador');
const fondoKawaii = document.getElementById('fondoKawaii');

let participantes = [];
let ruletaInterval;
let indiceActual = 0;
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
  actualizarRuletaVisual();
});

// ======== Mostrar en la ruleta los participantes (textos) ========
function actualizarRuletaVisual() {
  ruleta.innerHTML = '';
  participantes.forEach((nombre) => {
    const div = document.createElement('div');
    div.textContent = nombre;
    div.className = 'ruleta-item';
    div.style.padding = '10px';
    div.style.margin = '0 10px';
    div.style.borderRadius = '10px';
    div.style.background = '#ffd6e8';
    div.style.minWidth = '100px';
    div.style.fontWeight = 'bold';
    div.style.userSelect = 'none';
    ruleta.appendChild(div);
  });
}

// ======== Función para girar la ruleta tipo slot ========
function iniciarSorteo() {
  if (girando) return;
  if (participantes.length === 0) {
    alert('Agrega al menos un participante para iniciar el sorteo.');
    return;
  }
  girando = true;
  ganadorDiv.textContent = '';
  let velocidad = 100;
  let vueltas = 0;
  const maxVueltas = 30 + Math.floor(Math.random() * 30);

  ruletaInterval = setInterval(() => {
    indiceActual = (indiceActual + 1) % participantes.length;
    marcarParticipanteActual(indiceActual);
    vueltas++;

    if (vueltas > maxVueltas * 0.7) {
      velocidad += 15;
      clearInterval(ruletaInterval);
      ruletaInterval = setInterval(() => {
        indiceActual = (indiceActual + 1) % participantes.length;
        marcarParticipanteActual(indiceActual);
        vueltas++;
        if (vueltas >= maxVueltas) {
          clearInterval(ruletaInterval);
          finalizarSorteo(indiceActual);
          girando = false;
        }
      }, velocidad);
    }
  }, velocidad);
}

// ======== Resaltar participante actual en la ruleta ========
function marcarParticipanteActual(indice) {
  const items = ruleta.querySelectorAll('.ruleta-item');
  items.forEach((item, i) => {
    item.style.background = i === indice ? '#ff69b4' : '#ffd6e8';
    item.style.color = i === indice ? 'white' : '#333';
    item.style.transform = i === indice ? 'scale(1.2)' : 'scale(1)';
    item.style.transition = 'all 0.3s ease';
  });
}

// ======== Finalizar sorteo mostrando ganador ========
function finalizarSorteo(indiceGanador) {
  ganadorDiv.textContent = `¡El ganador es: ${participantes[indiceGanador]}! 🎉`;
}

// ======== Agregar evento al botón iniciar ========
iniciarBtn.addEventListener('click', iniciarSorteo);

// ======== Animación de fondo kawaii mejorada ========
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
