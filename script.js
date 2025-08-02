// ======== Variables y referencias a elementos DOM ======== 
const nombreInput = document.getElementById('nombreInput');
const agregarBtn = document.getElementById('agregarBtn');
const listaNombres = document.getElementById('listaNombres');
const iniciarBtn = document.getElementById('iniciarBtn');
const ruleta = document.getElementById('ruleta');
const ganadorDiv = document.getElementById('ganador');
const fondoKawaii = document.getElementById('fondoKawaii');
const contadorParticipantes = document.getElementById('contadorParticipantes');
const listaGanadores = document.getElementById('listaGanadores');
const reiniciarBtn = document.getElementById('reiniciarBtn');

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
  contadorParticipantes.textContent = `Participantes ingresados: ${participantes.length}`;
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
    ruleta.appendChild(div);
  });
}

// ======== Función para girar la ruleta tipo slot (scroll vertical) ========
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

// ======== Resaltar participante actual en la ruleta y hacer scroll vertical ========
function marcarParticipanteActual(indice) {
  const items = ruleta.querySelectorAll('.ruleta-item');
  items.forEach((item, i) => {
    item.classList.toggle('active', i === indice);
  });

  // Scroll vertical suave para centrar el participante activo
  const itemActual = items[indice];
  if (itemActual) {
    const ruletaRect = ruleta.getBoundingClientRect();
    const itemRect = itemActual.getBoundingClientRect();

    // Calculamos el scroll para centrar verticalmente el elemento activo
    const offset = itemActual.offsetTop - (ruleta.clientHeight / 2) + (itemActual.clientHeight / 2);
    ruleta.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  }
}

// ======== Finalizar sorteo mostrando ganador ========
function finalizarSorteo(indiceGanador) {
  const ganador = participantes[indiceGanador];
  ganadorDiv.textContent = `¡El ganador es: ${ganador}! 🎉`;

  // Agregar ganador a la lista visible
  const li = document.createElement('li');
  li.textContent = ganador;
  listaGanadores.appendChild(li);

  // Eliminar ganador del array y actualizar visuales
  participantes.splice(indiceGanador, 1);
  mostrarLista();
  actualizarRuletaVisual();

  // Reiniciar índice para no fallar en próxima ronda
  indiceActual = 0;
}

// ======== Evento para iniciar sorteo ========
iniciarBtn.addEventListener('click', iniciarSorteo);

// ======== Botón reiniciar ========
reiniciarBtn.addEventListener('click', () => {
  participantes = [];
  mostrarLista();
  actualizarRuletaVisual();
  ganadorDiv.textContent = '';
  listaGanadores.innerHTML = '';
  contadorParticipantes.textContent = `Participantes ingresados: 0`;
  indiceActual = 0;
  girando = false;
  clearInterval(ruletaInterval);
});

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


