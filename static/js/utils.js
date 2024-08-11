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
