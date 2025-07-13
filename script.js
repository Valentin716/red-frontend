let contador = 0;

function agregarActividad() {
  const contenedor = document.getElementById("actividades");
  const div = document.createElement("div");
  div.innerHTML = `
    <label>Actividad ${contador + 1}</label>
    <input placeholder="Nombre" name="nombre-${contador}" required />
    <input type="number" placeholder="Duración" name="duracion-${contador}" required />
    <input placeholder="Predecesoras (coma separadas)" name="predecesoras-${contador}" />
    <hr>
  `;
  contenedor.appendChild(div);
  contador++;
}

document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();
  const actividades = [];

  for (let i = 0; i < contador; i++) {
    const nombre = document.querySelector(`[name=nombre-${i}]`).value;
    const duracion = parseInt(document.querySelector(`[name=duracion-${i}]`).value);
    const predecesoras = document.querySelector(`[name=predecesoras-${i}]`).value
      .split(',')
      .map(p => p.trim()).filter(p => p !== "");

    actividades.push({ nombre, duracion, predecesoras });
  }

  const res = await fetch("https://red-proyecto-api.onrender.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actividades })
  });

  const data = await res.json();
  if (data.error) {
    alert("Error: " + data.error);
    return;
  }

  document.getElementById("resultado").innerHTML = `
    <h2>Ruta Crítica: ${data.ruta_critica.join(" → ")}</h2>
    <p>Duración Total: ${data.duracion_total} días</p>
    <img src="data:image/png;base64,${data.imagen}" />
  `;
});