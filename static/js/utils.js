document.addEventListener('DOMContentLoaded', function() {
    // Toggle de la barra de búsqueda
    document.getElementById('search-icon').addEventListener('click', function() {
        const searchContainer = this.parentElement;
        searchContainer.classList.toggle('active');
        document.getElementById('search-input').focus();  // Poner el foco en el campo de búsqueda
    });

    // Filtrado de la tabla
    document.getElementById('search-input').addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const rows = document.querySelectorAll('table tbody tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;
            cells.forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchValue)) {
                    match = true;
                }
            });
            row.style.display = match ? '' : 'none';
        });
    });
});
