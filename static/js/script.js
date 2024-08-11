function formatNumber(number) {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumbers() {
    const elements = document.querySelectorAll('.format-number');
    elements.forEach(el => {
        console.log('Elemento encontrado:', el.textContent);
        const number = parseFloat(el.textContent.replace(/,/g, ''));
        el.textContent = formatNumber(number);
    });
}

document.addEventListener('DOMContentLoaded', formatNumbers);

function calcularGananciaYTotal() {
	const precioCompra = parseFloat(document.getElementById('precio_compra').value) || 0;
	const precioVenta = parseFloat(document.getElementById('precio_venta').value) || 0;
	const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
	const ganancia = (precioVenta - precioCompra) * cantidad;
	const total = precioVenta * cantidad;
	document.getElementById('ganancia').value = ganancia.toFixed(2);
	document.getElementById('total').value = total.toFixed(2);
}



const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})

if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

