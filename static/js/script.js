// Formato de números
function formatNumber(number) {
  return number.toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatNumbers() {
  document.querySelectorAll(".format-number").forEach((el) => {
    const number = parseFloat(el.textContent.replace(/,/g, ""));
    el.textContent = formatNumber(number);
  });
}

// Ganancias y totales
function calcularGananciaYTotal() {
  const precioCompra =
    parseFloat(document.getElementById("precio_compra").value) || 0;
  const precioVenta =
    parseFloat(document.getElementById("precio_venta").value) || 0;
  const cantidad = parseInt(document.getElementById("cantidad").value) || 0;
  const ganancia = (precioVenta - precioCompra) * cantidad;
  const total = precioVenta * cantidad;

  document.getElementById("ganancia").value = ganancia.toFixed(2);
  document.getElementById("total").value = total.toFixed(2);
}

// Manejo de eventos para la barra de búsqueda
document.addEventListener("DOMContentLoaded", () => {
  formatNumbers();

  // Activar/desactivar barra de búsqueda
  const searchIcon = document.getElementById("search-icon");
  const searchInput = document.getElementById("search-input");

  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
      const searchContainer = searchIcon.parentElement;
      if (searchContainer) {
        searchContainer.classList.toggle("active");
        searchInput.focus();
      }
    });

    // Filtrado de la tabla
    searchInput.addEventListener("keyup", () => {
      const searchValue = searchInput.value.toLowerCase();
      document.querySelectorAll("table tbody tr").forEach((row) => {
        const match = [...row.querySelectorAll("td")].some((cell) =>
          cell.textContent.toLowerCase().includes(searchValue)
        );
        row.style.display = match ? "" : "none";
      });
    });
  }
});

// Autocompletar nombre de cliente
function setupAutocomplete(inputId, endpoint, resultContainerId) {
  const input = document.getElementById(inputId);
  const resultsContainer = document.getElementById(resultContainerId);

  if (input && resultsContainer) {
    input.addEventListener("input", () => {
      const query = input.value.trim();

      if (query.length < 2) {
        resultsContainer.classList.remove("show");
        resultsContainer.innerHTML = "";
        return;
      }

      fetch(`${endpoint}?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
          resultsContainer.innerHTML = "";
          if (data.length > 0) {
            resultsContainer.classList.add("show");
            data.forEach((cliente) => {
              const li = document.createElement("li");
              li.textContent = cliente.nombre;
              li.dataset.id = cliente.id;

              Object.keys(cliente).forEach((key) => {
                if (key !== "nombre" && key !== "id") {
                  li.dataset[key] = cliente[key] || "";
                }
              });

              li.addEventListener("click", () => {
                input.value = li.textContent;
                resultsContainer.classList.remove("show");

                // Autocompletar otros campos si existen
                [
                  "cedula",
                  "celular",
                  "email",
                  "ciudad",
                  "direccion",
                  "instagram",
                ].forEach((field) => {
                  const fieldElement = document.getElementById(field);
                  if (fieldElement && li.dataset[field]) {
                    fieldElement.value = li.dataset[field];
                  }
                });
              });

              resultsContainer.appendChild(li);
            });
          } else {
            resultsContainer.classList.remove("show");
          }
        });
    });

    // Ocultar resultados al hacer clic fuera del contenedor
    document.addEventListener("click", (event) => {
      if (!resultsContainer.contains(event.target) && event.target !== input) {
        resultsContainer.classList.remove("show");
      }
    });
  }
}

// Configurar autocompletado para diferentes páginas
document.addEventListener("DOMContentLoaded", () => {
  setupAutocomplete("nombre", "/buscar_clientes", "autocomplete-results");
  setupAutocompleteHistorial("search-input", "/buscar_historial_cliente", "autocomplete-results");
});

// Toggle sidebar y barra de búsqueda
document.addEventListener("DOMContentLoaded", () => {
  const menuBar = document.querySelector("#content nav .bx.bx-menu");
  const sidebar = document.getElementById("sidebar");
  const searchButton = document.querySelector(
    "#content nav form .form-input button"
  );
  const searchButtonIcon = document.querySelector(
    "#content nav form .form-input button .bx"
  );
  const searchForm = document.querySelector("#content nav form");

  if (menuBar && sidebar) {
    menuBar.addEventListener("click", () => sidebar.classList.toggle("hide"));
  }

  if (searchButton && searchButtonIcon && searchForm) {
    searchButton.addEventListener("click", (e) => {
      if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle("show");
        searchButtonIcon.classList.toggle(
          "bx-search",
          !searchForm.classList.contains("show")
        );
        searchButtonIcon.classList.toggle(
          "bx-x",
          searchForm.classList.contains("show")
        );
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace("bx-x", "bx-search");
        searchForm.classList.remove("show");
      }
    });

    if (window.innerWidth < 768) {
      sidebar.classList.add("hide");
    }
  }
});

// Modo oscuro
document.getElementById("switch-mode").addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

// PRUEBA
// Autocompletar nombre de cliente (para historial)
function setupAutocompleteHistorial() {
  const input = document.getElementById("nombre_historial");
  const resultsContainer = document.getElementById(
    "autocomplete-results-historial"
  );

  if (input && resultsContainer) {
    input.addEventListener("input", () => {
      const query = input.value.trim();

      if (query.length < 2) {
        resultsContainer.classList.remove("show");
        resultsContainer.innerHTML = "";
        return;
      }

      fetch(`/buscar_historial_cliente?query=${query}`)
        .then((response) => response.json())
        .then((data) => {
          resultsContainer.innerHTML = "";
          if (data.length > 0) {
            resultsContainer.classList.add("show");
            data.forEach((cliente) => {
              const li = document.createElement("li");
              li.textContent = cliente.nombre;
              li.dataset.id = cliente.id;

              li.addEventListener("click", () => {
                input.value = li.textContent;
                input.dataset.id = li.dataset.id;
                resultsContainer.classList.remove("show");
              });

              resultsContainer.appendChild(li);
            });
          } else {
            resultsContainer.classList.remove("show");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    document.addEventListener("click", function (event) {
      if (!resultsContainer.contains(event.target) && event.target !== input) {
        resultsContainer.classList.remove("show");
      }
    });
  }
}
