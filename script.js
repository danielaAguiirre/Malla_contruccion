document.addEventListener("DOMContentLoaded", () => {
  const felicitacion = document.getElementById("felicitaciones");
  const btnModoOscuro = document.getElementById("btnModoOscuro");

  // --- Cargar estado guardado desde localStorage ---
  const aprobadoGuardado = JSON.parse(localStorage.getItem("ramosAprobados")) || [];
  aprobadoGuardado.forEach(id => {
    const ramo = document.querySelector(`.ramo[data-id='${id}']`);
    if (ramo) {
      ramo.classList.add("aprobado");
      ramo.classList.remove("bloqueado");
    }
  });

  // --- Función para guardar estado ---
  function guardarEstado() {
    const ramosAprobados = Array.from(document.querySelectorAll(".ramo.aprobado")).map(r => r.getAttribute("data-id"));
    localStorage.setItem("ramosAprobados", JSON.stringify(ramosAprobados));
  }

  // --- Manejador clic ramos ---
  document.querySelectorAll(".ramo").forEach(ramo => {
    ramo.addEventListener("click", () => {
      if (ramo.classList.contains("bloqueado")) {
        alert("Este ramo está bloqueado. Debes aprobar sus requisitos primero.");
        return;
      }

      const estabaAprobado = ramo.classList.contains("aprobado");
      ramo.classList.toggle("aprobado");

      const id = ramo.getAttribute("data-id");

      if (!estabaAprobado) {
        // Mostrar felicitación
        felicitacion.classList.add("mostrar");
        setTimeout(() => {
          felicitacion.classList.remove("mostrar");
        }, 3000);

        // Desbloquear ramos dependientes
        document.querySelectorAll(".ramo.bloqueado").forEach(r => {
          const requisitos = r.getAttribute("data-requisitos");
          if (!requisitos) return;
          const reqArray = requisitos.split(",").map(s => s.trim()).filter(Boolean);
          if (reqArray.includes(id)) {
            const todosAprobados = reqArray.every(reqId => {
              const requisito = document.querySelector(`.ramo[data-id='${reqId}']`);
              return requisito && requisito.classList.contains("aprobado");
            });
            if (todosAprobados) {
              r.classList.remove("bloqueado");
            }
          }
        });

      } else {
        // Bloquear dependientes y desaprobarlos
        document.querySelectorAll(".ramo").forEach(r => {
          const requisitos = r.getAttribute("data-requisitos");
          if (!requisitos) return;
          const reqArray = requisitos.split(",").map(s => s.trim()).filter(Boolean);
          if (reqArray.includes(id)) {
            r.classList.add("bloqueado");
            r.classList.remove("aprobado");
          }
        });
      }

      guardarEstado();
    });
  });

  // --- Modo Oscuro: cargar modo guardado ---
  const modoGuardado = localStorage.getItem("modoOscuro");
  if (modoGuardado === "true") {
    document.body.classList.add("modo-oscuro");
  }

  // --- Botón modo oscuro ---
  btnModoOscuro.addEventListener("click", () => {
    document.body.classList.toggle("modo-oscuro");
    const modoActivo = document.body.classList.contains("modo-oscuro");
    localStorage.setItem("modoOscuro", modoActivo);
    btnModoOscuro.textContent = modoActivo ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
  });

  // Texto inicial botón
  if (document.body.classList.contains("modo-oscuro")) {
    btnModoOscuro.textContent = "☀️ Modo Claro";
  } else {
    btnModoOscuro.textContent = "🌙 Modo Oscuro";
  }
});
