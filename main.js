const CLAVE_STORAGE = "plan_gym_nutricion_lun_vie_v1";
const ORDEN_DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const DATOS_RESPALDO = [
  {
    id: "dia-lunes",
    dia: "Lunes",
    cliente: "Katherine Muñoz",
    rutina_dia: "Pierna y glúteo: sentadilla, prensa, extensiones y femoral acostado",
    desayuno: { comida: "Arepa asada con huevos revueltos", porciones: 1, calorias_porcion: 340, proteinas_porcion: 18 },
    almuerzo: { comida: "Pollo con arroz y ensalada", porciones: 1, calorias_porcion: 520, proteinas_porcion: 38 },
    cena: { comida: "Batido de avena, Nestum y cambur con arepa", porciones: 1, calorias_porcion: 480, proteinas_porcion: 20 }
  },
  {
    id: "dia-martes",
    dia: "Martes",
    cliente: "Katherine Muñoz",
    rutina_dia: "Torso: press de pecho, remo con barra, jalón al pecho y hombro",
    desayuno: { comida: "Avena cocida con leche y cambur", porciones: 1, calorias_porcion: 360, proteinas_porcion: 14 },
    almuerzo: { comida: "Carne magra con pasta y vegetales", porciones: 1, calorias_porcion: 550, proteinas_porcion: 36 },
    cena: { comida: "Arepa con queso y huevos", porciones: 1, calorias_porcion: 410, proteinas_porcion: 22 }
  },
  {
    id: "dia-miercoles",
    dia: "Miércoles",
    cliente: "Katherine Muñoz",
    rutina_dia: "Enfoque femoral y glúteo: peso muerto rumano, curl femoral y patada",
    desayuno: { comida: "Arepa con huevos y aguacate", porciones: 1, calorias_porcion: 390, proteinas_porcion: 17 },
    almuerzo: { comida: "Pescado o pollo con arroz y caraotas", porciones: 1, calorias_porcion: 530, proteinas_porcion: 35 },
    cena: { comida: "Batido de avena y cambur con tostadas", porciones: 1, calorias_porcion: 430, proteinas_porcion: 16 }
  },
  {
    id: "dia-jueves",
    dia: "Jueves",
    cliente: "Katherine Muñoz",
    rutina_dia: "Espalda y brazos: remo en máquina, face pulls, bíceps y tríceps",
    desayuno: { comida: "Huevos revueltos con arepa y queso", porciones: 1, calorias_porcion: 370, proteinas_porcion: 21 },
    almuerzo: { comida: "Pasta con pollo desmechado", porciones: 1, calorias_porcion: 540, proteinas_porcion: 34 },
    cena: { comida: "Arepa asada con atún o huevo", porciones: 1, calorias_porcion: 380, proteinas_porcion: 23 }
  },
  {
    id: "dia-viernes",
    dia: "Viernes",
    cliente: "Katherine Muñoz",
    rutina_dia: "Cuádriceps y core: zancadas, sentadilla búlgara, elevaciones y plancha",
    desayuno: { comida: "Batido de avena y cambur con arepa", porciones: 1, calorias_porcion: 400, proteinas_porcion: 17 },
    almuerzo: { comida: "Arroz, carne o pollo y ensalada", porciones: 1, calorias_porcion: 510, proteinas_porcion: 35 },
    cena: { comida: "Huevos con arepa y bebida láctea", porciones: 1, calorias_porcion: 390, proteinas_porcion: 20 }
  }
];

// Elementos del DOM
const dashboardTarjetas = document.querySelector("#dashboard-tarjetas");
const formRegistro = document.querySelector("#form-registro");
const registroIdInput = document.querySelector("#registro-id");
const diaSelect = document.querySelector("#dia-semana");
const clienteInput = document.querySelector("#cliente-nombre");
const rutinaInput = document.querySelector("#rutina-dia");
const mensajeFormulario = document.querySelector("#mensaje-formulario");
const btnLimpiar = document.querySelector("#btn-limpiar");

const filtroDiaSelect = document.querySelector("#filtro-dia");
const buscarTextoInput = document.querySelector("#buscar-texto");
const cuerpoTabla = document.querySelector("#cuerpo-tabla");

const totalCaloriasEl = document.querySelector("#total-calorias-semana");
const totalProteinasEl = document.querySelector("#total-proteinas-semana");
const promedioDiarioEl = document.querySelector("#promedio-diario");
const btnRestaurarDatos = document.querySelector("#btn-restaurar-datos");

let registros = [];

function sanitizarTexto(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function calcularComida(comidaObj) {
  const porciones = Math.max(0, Number(comidaObj.porciones) || 0);
  const calPorPorcion = Math.max(0, Number(comidaObj.calorias_porcion) || 0);
  const protPorPorcion = Math.max(0, Number(comidaObj.proteinas_porcion) || 0);

  return {
    comida: String(comidaObj.comida || "").trim(),
    porciones,
    calorias_porcion: calPorPorcion,
    proteinas_porcion: protPorPorcion,
    totalCalorias: porciones * calPorPorcion,
    totalProteinas: porciones * protPorPorcion
  };
}

function calcularRegistroCompleto(item) {
  const desayuno = calcularComida(item.desayuno);
  const almuerzo = calcularComida(item.almuerzo);
  const cena = calcularComida(item.cena);

  const calorias_totales = desayuno.totalCalorias + almuerzo.totalCalorias + cena.totalCalorias;
  const proteinas_totales_g = desayuno.totalProteinas + almuerzo.totalProteinas + cena.totalProteinas;

  return {
    ...item,
    desayuno,
    almuerzo,
    cena,
    resumen_dia: {
      calorias_totales,
      proteinas_totales_g
    }
  };
}

function ordenarPorDia(lista) {
  return [...lista].sort((a, b) => {
    const idxA = ORDEN_DIAS.indexOf(a.dia);
    const idxB = ORDEN_DIAS.indexOf(b.dia);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });
}

function guardarEnStorage() {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(registros));
}

function normalizarDatosExternos(datos) {
  if (!Array.isArray(datos)) return [];
  return datos.map((entry, index) => {
    const d = entry.desayuno || {};
    const a = entry.almuerzo || {};
    const c = entry.cena || {};
    return calcularRegistroCompleto({
      id: entry.id || `reg-${entry.dia || index}-${index}`,
      dia: entry.dia || ORDEN_DIAS[index] || "Lunes",
      cliente: entry.cliente || "Usuario",
      rutina_dia: entry.rutina_dia || entry.rutina || "Rutina general",
      desayuno: {
        comida: d.comida ?? d.nombre ?? "",
        porciones: d.porciones ?? 1,
        calorias_porcion: d.calorias_porcion ?? d.calorias ?? 0,
        proteinas_porcion: d.proteinas_porcion ?? d.proteinas ?? 0
      },
      almuerzo: {
        comida: a.comida ?? a.nombre ?? "",
        porciones: a.porciones ?? 1,
        calorias_porcion: a.calorias_porcion ?? a.calorias ?? 0,
        proteinas_porcion: a.proteinas_porcion ?? a.proteinas ?? 0
      },
      cena: {
        comida: c.comida ?? c.nombre ?? "",
        porciones: c.porciones ?? 1,
        calorias_porcion: c.calorias_porcion ?? c.calorias ?? 0,
        proteinas_porcion: c.proteinas_porcion ?? c.proteinas ?? 0
      }
    });
  });
}

async function cargarDatosIniciales() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado) {
    try {
      const parseado = JSON.parse(guardado);
      if (Array.isArray(parseado) && parseado.length > 0) {
        registros = ordenarPorDia(parseado.map(calcularRegistroCompleto));
        renderizarTodo();
        return;
      }
    } catch {
      localStorage.removeItem(CLAVE_STORAGE);
    }
  }

  try {
    const respuesta = await fetch("data.json");
    if (!respuesta.ok) throw new Error("No se pudo leer data.json");
    const jsonData = await respuesta.json();
    const listaJson = Array.isArray(jsonData) ? jsonData : jsonData.registros || jsonData.dias || [];
    registros = ordenarPorDia(normalizarDatosExternos(listaJson));
  } catch {
    registros = ordenarPorDia(DATOS_RESPALDO.map(calcularRegistroCompleto));
  }

  guardarEnStorage();
  renderizarTodo();
}

function renderizarDashboard() {
  if (!dashboardTarjetas) return;
  const ordenados = ordenarPorDia(registros);

  if (ordenados.length === 0) {
    dashboardTarjetas.innerHTML = `<p>No hay días registrados todavía. Usa el formulario para agregar uno.</p>`;
    return;
  }

  dashboardTarjetas.innerHTML = ordenados
    .map((reg) => {
      const { desayuno, almuerzo, cena, resumen_dia } = reg;
      return `
        <article class="tarjeta-dia">
          <h3>${sanitizarTexto(reg.dia)}</h3>
          <p class="rutina-texto"><strong>Rutina:</strong> ${sanitizarTexto(reg.rutina_dia)}</p>
          <ul class="lista-comidas">
            <li><strong>Desayuno:</strong> ${sanitizarTexto(desayuno.comida)} (${desayuno.porciones} porc. — ${desayuno.totalCalorias} kcal / ${desayuno.totalProteinas}g prot.)</li>
            <li><strong>Almuerzo:</strong> ${sanitizarTexto(almuerzo.comida)} (${almuerzo.porciones} porc. — ${almuerzo.totalCalorias} kcal / ${almuerzo.totalProteinas}g prot.)</li>
            <li><strong>Cena:</strong> ${sanitizarTexto(cena.comida)} (${cena.porciones} porc. — ${cena.totalCalorias} kcal / ${cena.totalProteinas}g prot.)</li>
          </ul>
          <p class="resumen-diario">Total día: ${resumen_dia.calorias_totales} kcal | ${resumen_dia.proteinas_totales_g} g proteína</p>
        </article>
      `;
    })
    .join("");
}

function renderizarTabla() {
  if (!cuerpoTabla) return;
  const diaFiltro = filtroDiaSelect ? filtroDiaSelect.value : "Todos";
  const textoFiltro = (buscarTextoInput ? buscarTextoInput.value : "").trim().toLowerCase();

  const filtrados = ordenarPorDia(registros).filter((reg) => {
    const coincideDia = diaFiltro === "Todos" || reg.dia === diaFiltro;
    const bloqueTexto = [
      reg.dia,
      reg.cliente,
      reg.rutina_dia,
      reg.desayuno.comida,
      reg.almuerzo.comida,
      reg.cena.comida
    ]
      .join(" ")
      .toLowerCase();
    const coincideTexto = textoFiltro === "" || bloqueTexto.includes(textoFiltro);
    return coincideDia && coincideTexto;
  });

  if (filtrados.length === 0) {
    cuerpoTabla.innerHTML = `<tr><td colspan="8">No hay registros que coincidan con el filtro.</td></tr>`;
    return;
  }

  cuerpoTabla.innerHTML = filtrados
    .map(
      (reg) => `
      <tr>
        <td><strong>${sanitizarTexto(reg.dia)}</strong></td>
        <td>${sanitizarTexto(reg.rutina_dia)}</td>
        <td>${sanitizarTexto(reg.desayuno.comida)}<br><small>${reg.desayuno.porciones} porc. (${reg.desayuno.totalCalorias} kcal / ${reg.desayuno.totalProteinas}g)</small></td>
        <td>${sanitizarTexto(reg.almuerzo.comida)}<br><small>${reg.almuerzo.porciones} porc. (${reg.almuerzo.totalCalorias} kcal / ${reg.almuerzo.totalProteinas}g)</small></td>
        <td>${sanitizarTexto(reg.cena.comida)}<br><small>${reg.cena.porciones} porc. (${reg.cena.totalCalorias} kcal / ${reg.cena.totalProteinas}g)</small></td>
        <td><strong>${reg.resumen_dia.calorias_totales} kcal</strong></td>
        <td><strong>${reg.resumen_dia.proteinas_totales_g} g</strong></td>
        <td>
          <div class="celda-acciones">
            <button type="button" class="btn-editar" data-accion="editar" data-id="${sanitizarTexto(reg.id)}">Editar</button>
            <button type="button" class="btn-eliminar" data-accion="eliminar" data-id="${sanitizarTexto(reg.id)}">Borrar</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderizarReportes() {
  if (!totalCaloriasEl || !totalProteinasEl || !promedioDiarioEl) return;

  const totalKcal = registros.reduce((acc, item) => acc + (item.resumen_dia?.calorias_totales || 0), 0);
  const totalProt = registros.reduce((acc, item) => acc + (item.resumen_dia?.proteinas_totales_g || 0), 0);
  const cantidadDias = registros.length > 0 ? registros.length : 1;

  const promKcal = Math.round(totalKcal / cantidadDias);
  const promProt = Math.round(totalProt / cantidadDias);

  totalCaloriasEl.textContent = `${totalKcal} kcal`;
  totalProteinasEl.textContent = `${totalProt} g`;
  promedioDiarioEl.textContent = `${promKcal} kcal / ${promProt} g`;
}

function renderizarTodo() {
  renderizarDashboard();
  renderizarTabla();
  renderizarReportes();
}

function mostrarMensaje(texto, esError = false) {
  if (!mensajeFormulario) return;
  mensajeFormulario.textContent = texto;
  mensajeFormulario.style.color = esError ? "#f87171" : "#22c55e";
}

function leerComidaFormulario(prefijo) {
  const comida = document.querySelector(`#${prefijo}-comida`).value.trim();
  const porciones = Number(document.querySelector(`#${prefijo}-porciones`).value);
  const calorias_porcion = Number(document.querySelector(`#${prefijo}-calorias`).value);
  const proteinas_porcion = Number(document.querySelector(`#${prefijo}-proteinas`).value);

  return { comida, porciones, calorias_porcion, proteinas_porcion };
}

function validarFormulario(datos) {
  if (!datos.dia) return "Selecciona un día de lunes a viernes.";
  if (!datos.cliente.trim()) return "Escribe un nombre o cliente.";
  if (!datos.rutina_dia.trim()) return "Escribe la rutina de gimnasio del día.";

  const comidas = [
    { nombre: "Desayuno", obj: datos.desayuno },
    { nombre: "Almuerzo", obj: datos.almuerzo },
    { nombre: "Cena", obj: datos.cena }
  ];

  for (const item of comidas) {
    if (!item.obj.comida) return `Falta escribir la comida del ${item.nombre}.`;
    if (Number.isNaN(item.obj.porciones) || item.obj.porciones <= 0) {
      return `Las porciones del ${item.nombre} deben ser mayores que 0.`;
    }
    if (
      Number.isNaN(item.obj.calorias_porcion) ||
      item.obj.calorias_porcion < 0 ||
      Number.isNaN(item.obj.proteinas_porcion) ||
      item.obj.proteinas_porcion < 0
    ) {
      return `Calorías y proteínas del ${item.nombre} no pueden ser negativas.`;
    }
  }

  return null;
}

function cargarRegistroEnFormulario(id) {
  const encontrado = registros.find((r) => r.id === id);
  if (!encontrado) return;

  registroIdInput.value = encontrado.id;
  diaSelect.value = encontrado.dia;
  clienteInput.value = encontrado.cliente;
  rutinaInput.value = encontrado.rutina_dia;

  document.querySelector("#desayuno-comida").value = encontrado.desayuno.comida;
  document.querySelector("#desayuno-porciones").value = encontrado.desayuno.porciones;
  document.querySelector("#desayuno-calorias").value = encontrado.desayuno.calorias_porcion;
  document.querySelector("#desayuno-proteinas").value = encontrado.desayuno.proteinas_porcion;

  document.querySelector("#almuerzo-comida").value = encontrado.almuerzo.comida;
  document.querySelector("#almuerzo-porciones").value = encontrado.almuerzo.porciones;
  document.querySelector("#almuerzo-calorias").value = encontrado.almuerzo.calorias_porcion;
  document.querySelector("#almuerzo-proteinas").value = encontrado.almuerzo.proteinas_porcion;

  document.querySelector("#cena-comida").value = encontrado.cena.comida;
  document.querySelector("#cena-porciones").value = encontrado.cena.porciones;
  document.querySelector("#cena-calorias").value = encontrado.cena.calorias_porcion;
  document.querySelector("#cena-proteinas").value = encontrado.cena.proteinas_porcion;

  mostrarMensaje(`Editando registro de ${encontrado.dia}. Guarda los cambios cuando termines.`);
  document.querySelector("#formulario-modulo").scrollIntoView({ behavior: "smooth" });
}

function limpiarFormulario() {
  formRegistro.reset();
  registroIdInput.value = "";
  document.querySelector("#desayuno-porciones").value = 1;
  document.querySelector("#almuerzo-porciones").value = 1;
  document.querySelector("#cena-porciones").value = 1;
  mostrarMensaje("");
}

formRegistro?.addEventListener("submit", (event) => {
  event.preventDefault();

  const candidato = {
    id: registroIdInput.value.trim() || `dia-${diaSelect.value.toLowerCase()}-${Date.now()}`,
    dia: diaSelect.value,
    cliente: clienteInput.value,
    rutina_dia: rutinaInput.value,
    desayuno: leerComidaFormulario("desayuno"),
    almuerzo: leerComidaFormulario("almuerzo"),
    cena: leerComidaFormulario("cena")
  };

  const error = validarFormulario(candidato);
  if (error) {
    mostrarMensaje(error, true);
    return;
  }

  const calculado = calcularRegistroCompleto(candidato);
  const indiceExistente = registros.findIndex((r) => r.id === calculado.id);

  if (indiceExistente !== -1) {
    registros[indiceExistente] = calculado;
    mostrarMensaje(`Registro de ${calculado.dia} actualizado y guardado.`);
  } else {
    registros.push(calculado);
    mostrarMensaje(`Registro de ${calculado.dia} guardado en localStorage.`);
  }

  registros = ordenarPorDia(registros);
  guardarEnStorage();
  renderizarTodo();
  limpiarFormulario();
  mostrarMensaje(`Cambios guardados (${calculado.resumen_dia.calorias_totales} kcal / ${calculado.resumen_dia.proteinas_totales_g}g proteína).`);
});

btnLimpiar?.addEventListener("click", limpiarFormulario);

filtroDiaSelect?.addEventListener("change", renderizarTabla);
buscarTextoInput?.addEventListener("input", renderizarTabla);

cuerpoTabla?.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-accion]");
  if (!boton) return;

  const accion = boton.dataset.accion;
  const id = boton.dataset.id;

  if (accion === "editar") {
    cargarRegistroEnFormulario(id);
  } else if (accion === "eliminar") {
    registros = registros.filter((r) => r.id !== id);
    guardarEnStorage();
    renderizarTodo();
    mostrarMensaje("Registro eliminado.");
  }
});

btnRestaurarDatos?.addEventListener("click", () => {
  localStorage.removeItem(CLAVE_STORAGE);
  registros = ordenarPorDia(DATOS_RESPALDO.map(calcularRegistroCompleto));
  guardarEnStorage();
  renderizarTodo();
  mostrarMensaje("Se restauraron los datos base de lunes a viernes.");
});

cargarDatosIniciales();