# Sistema de Gestión de Ventas y Clientes

Este proyecto es un sistema de gestión de ventas y clientes. El sistema permite registrar, gestionar y visualizar pedidos, abonos, y el historial de clientes, utilizando una arquitectura basada en Flask para el backend y MySQL para la base de datos.

## Características

- **Registro de Pedidos**: Los administradores pueden registrar nuevos pedidos y asociarlos a clientes existentes.
- **Gestión de Abonos**: Permite registrar abonos y reflejarlos automáticamente en el historial de clientes.
- **Historial de Clientes**: Muestra el movimiento de saldos de cada cliente, incluyendo detalles como producto, cantidad, venta, compra, ganancia, estado de envío y total.
- **Dashboard**: Muestra estadísticas del día, incluyendo el total de ventas del día y la cantidad de pedidos.
- **Interfaz Responsiva**: Utiliza Bootstrap para una interfaz responsiva y moderna.
- **Autenticación**: Sistema de login para asegurar que solo los administradores tengan acceso al sistema.

## Tecnologías Utilizadas

- **Backend**: Flask (Python)
- **Base de Datos**: MySQL
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Control de Versiones**: Git

## Requisitos Previos

- Python 3.x
- MySQL
- XAMPP (Opcional, para la gestión de MySQL)
- pipenv o pip (para la gestión de dependencias)

## Pasos para la ejecución

Sigue los siguientes pasos para ejecutar el proyecto:

clona este repositorio en tu máquina local

1. Abre una terminal o línea de comandos en tu sistema operativo y navega hasta la carpeta raíz del proyecto.
2. Ejecuta el siguiente comando para crear un entorno virtual (virtual environment):
   - En Windows:
     ```
     python -m venv venv
     ```
   - En macOS/Linux:
     ```
     python3 -m venv venv
     ```
3. Activa el entorno virtual:
   - En Windows:
     ```
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```
     source venv/bin/activate
     ```
4. Instala las dependencias del proyecto ejecutando el siguiente comando en la ruta raíz del proyecto:
   ```
   pip install -r requirements.txt
   ```
5. Crea la base de datos utilizando el archivo `storemanager.txt` y establece los parámetros de conexión en el archivo `app.py`.
6. Después de instalar las dependencias y configurar la base de datos, ejecuta la aplicación con el siguiente comando:
   ```
   python app.py
     ```
