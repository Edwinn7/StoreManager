function formatNumber(number) {
  return number.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumbers() {
  const elements = document.querySelectorAll(".format-number");
  elements.forEach((el) => {
    const number = parseFloat(el.textContent.replace(/,/g, ""));
    el.textContent = formatNumber(number);
  });
}

document.addEventListener("DOMContentLoaded", formatNumbers);

// ganancias y totales
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

const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// Accion de busqueda global
document.addEventListener("DOMContentLoaded", function () {
  const searchIcon = document.getElementById("search-icon");
  if (searchIcon) {
    searchIcon.addEventListener("click", function () {
      const searchContainer = this.parentElement;
      if (searchContainer) {
        searchContainer.classList.toggle("active");
        document.getElementById("search-input").focus(); // Poner el foco en el campo de búsqueda
      }
    });
  }
  
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const searchValue = this.value.toLowerCase();
      const rows = document.querySelectorAll("table tbody tr");

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        let match = false;
        cells.forEach((cell) => {
          if (cell.textContent.toLowerCase().includes(searchValue)) {
            match = true;
          }
        });
        row.style.display = match ? "" : "none";
      });
    });
  }
});

//COMPLETAR CAMPO NOMBRE
document.getElementById("nombre").addEventListener("input", function () {
  const query = this.value;
  const resultsContainer = document.getElementById("autocomplete-results");
  if (query.length < 2) {
    // Opcional: iniciar búsqueda solo si el texto tiene al menos 2 caracteres
    resultsContainer.classList.remove("show");
    resultsContainer.innerHTML = "";
    return;
  }

  fetch(`/buscar_clientes?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      resultsContainer.innerHTML = "";
      if (data.length > 0) {
        resultsContainer.classList.add("show");
        data.forEach((cliente) => {
          const li = document.createElement("li");
          li.textContent = cliente.nombre;
          li.dataset.id = cliente.id; // Asumiendo que también devuelves un id
          li.addEventListener("click", function () {
            document.getElementById("nombre").value = this.textContent;
            resultsContainer.classList.remove("show");
            // Aquí puedes hacer algo con el id del cliente seleccionado
            console.log("Cliente seleccionado:", this.dataset.id);
          });
          resultsContainer.appendChild(li);
        });
      } else {
        resultsContainer.classList.remove("show");
      }
    });
});

// completar demas campos cliente

document.getElementById("nombre").addEventListener("input", function () {
  const query = this.value;
  const resultsContainer = document.getElementById("autocomplete-results");
  if (query.length < 2) {
    resultsContainer.classList.remove("show");
    resultsContainer.innerHTML = "";
    return;
  }

  fetch(`/buscar_clientes?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      resultsContainer.innerHTML = "";
      if (data.length > 0) {
        resultsContainer.classList.add("show");
        data.forEach((cliente) => {
          const li = document.createElement("li");
          li.textContent = cliente.nombre;
          li.dataset.id = cliente.id; // Asumiendo que también devuelves un id
          li.dataset.cedula = cliente.cedula || "";
          li.dataset.celular = cliente.celular || "";
          li.dataset.email = cliente.email || "";
          li.dataset.ciudad = cliente.ciudad || "";
          li.dataset.direccion = cliente.direccion || "";
          li.dataset.instagram = cliente.instagram || "";
          li.addEventListener("click", function () {
            document.getElementById("nombre").value = this.textContent;
            document.getElementById("cedula").value = this.dataset.cedula;
            document.getElementById("celular").value = this.dataset.celular;
            document.getElementById("email").value = this.dataset.email;
            document.getElementById("ciudad").value = this.dataset.ciudad;
            document.getElementById("direccion").value = this.dataset.direccion;
            document.getElementById("instagram").value = this.dataset.instagram;
            resultsContainer.classList.remove("show");
          });
          resultsContainer.appendChild(li);
        });
      } else {
        resultsContainer.classList.remove("show");
      }
    });
});

// Ocultar resultados al hacer clic fuera del contenedor de búsqueda
document.addEventListener("click", function (event) {
  const resultsContainer = document.getElementById("autocomplete-results");
  if (
    !resultsContainer.contains(event.target) &&
    event.target.id !== "nombre"
  ) {
    resultsContainer.classList.remove("show");
  }
});



// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});
