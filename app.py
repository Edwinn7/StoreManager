from flask import Flask, render_template, request, redirect, url_for, session, request
import mysql.connector

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# HACER QUE SE MUEVAN LOS SALDOS DE CLIENTE (HISTORIAL CLIENTE)

# Configuracion de la conexion a la base de datos
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="storemanager"
)

# 04/08
@app.route('/')
def index():
    return redirect(url_for('login'))

# Página de inicio de sesión
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cursor = db.cursor()
        cursor.execute("SELECT * FROM administradores WHERE username = %s AND password = %s", (username, password))
        administrador = cursor.fetchone()
        cursor.close()
        if administrador:
            session['logged_in'] = True
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error='Credenciales incorrectas')
    return render_template('login.html')

@app.route('/registrar_pedido', methods=['GET', 'POST'])
def registrar_pedido():
    if 'logged_in' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        tipo_cliente = request.form['tipo_cliente']
        canal_compra = request.form['canal_compra']
        medio_pago = request.form['medio_pago']
        nombre = request.form['nombre']
        producto = request.form['producto']
        precio_compra = float(request.form['precio_compra'])
        precio_venta = float(request.form['precio_venta'])
        costo_envio = float(request.form['costo_envio'])
        tipo_compra = request.form['tipo_compra']
        cantidad = int(request.form['cantidad'])
        total = precio_venta * cantidad
        ganancia = (precio_venta - precio_compra) * cantidad
        pago_en_caja = request.form['pago_en_caja']
        cedula = request.form['cedula']
        celular = request.form['celular']
        email = request.form['email']
        ciudad = request.form['ciudad']
        direccion = request.form['direccion']
        instagram = request.form['instagram']

        cursor = db.cursor()
        try:
            # Insertar el pedido
            cursor.execute("""
                INSERT INTO orders (tipo_cliente, canal_compra, medio_pago, costo_envio, tipo_compra, total, ganancia, pago_en_caja, cedula, celular, email, ciudad, direccion, instagram, user, producto, date_order)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """, (tipo_cliente, canal_compra, medio_pago, costo_envio, tipo_compra, total, ganancia, pago_en_caja, cedula, celular, email, ciudad, direccion, instagram, nombre, producto))
            order_id = cursor.lastrowid

            # Verificar que el cliente exista, buscando por cédula o celular
            if cedula:
                cursor.execute("SELECT id, nombre FROM clientes WHERE cedula = %s", (cedula,))
            elif celular:
                cursor.execute("SELECT id, nombre FROM clientes WHERE celular = %s", (celular,))
            else:
                return "Cédula o celular requerido", 400

            result = cursor.fetchone()
            if result is None:
                # Si el cliente no existe, manejar el error
                return "Cliente no encontrado", 404

            cliente_id = result[0]  # Acceder por índice entero
            cliente_nombre = result[1]  # Acceder al nombre del cliente

            # Insertar en historial_clientes
            cursor.execute("""
                INSERT INTO historial_clientes (cliente_id, cliente_nombre, fecha, producto, cantidad, venta, compra, ganancia, pago_en_caja, estado_envio, comentarios, total)
                VALUES (%s, %s, NOW(), %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (cliente_id, cliente_nombre, producto, cantidad, precio_venta, precio_compra, ganancia, pago_en_caja, 'Pendiente', 'N/A', total))
            
            db.commit()
        except Exception as e:
            db.rollback()
            return str(e), 500
        finally:
            cursor.close()

        return redirect(url_for('dashboard'))

    return render_template('registrar_pedido.html')


@app.route('/registrar_abono', methods=['GET', 'POST'])
def registrar_abono():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        fecha = request.form['fecha']
        valor = request.form['valor']
        cuenta = request.form['cuenta']
        nombre = request.form['nombre']
        medio_pago = request.form['medio_pago']
        confirmacion = request.form['confirmacion']
        
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO abonos (fecha, valor, cuenta, nombre, medio_pago, confirmacion)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (fecha, valor, cuenta, nombre, medio_pago, confirmacion))
        
        db.commit()
        cursor.close()
        return redirect(url_for('dashboard'))
    
    return render_template('registrar_abono.html')

@app.route('/registrar_usuario', methods=['GET', 'POST'])
def registrar_usuario():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        nombre = request.form['nombre']
        cedula = request.form['cedula']
        celular = request.form['celular']
        email = request.form['email']
        ciudad = request.form['ciudad']
        direccion = request.form['direccion']
        instagram = request.form['instagram']
        
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO clientes (nombre, cedula, celular, email, ciudad, direccion, instagram)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (nombre, cedula, celular, email, ciudad, direccion, instagram))
        
        db.commit()
        cursor.close()
        return redirect(url_for('dashboard'))
    
    return render_template('registrar_usuario.html')

# Página del panel de control (dashboard)
@app.route('/dashboard')
def dashboard():
    if 'logged_in' in session:
        cursor = db.cursor(dictionary=True)
        # Obtener la cantidad de pedidos del día
        cursor.execute("SELECT COUNT(*) AS num_orders_today FROM orders WHERE DATE(date_order) = CURDATE()")
        num_orders_today = cursor.fetchone()['num_orders_today']        
        # Obtener la cantidad total de clientes
        cursor.execute("SELECT COUNT(*) AS num_clients FROM clientes")
        num_clients = cursor.fetchone()['num_clients']
        # Obtener todos los pedidos (si es necesario para otras partes del dashboard)
        cursor.execute("SELECT * FROM orders")
        orders = cursor.fetchall()
        cursor.close()
        return render_template('dashboard.html', num_orders_today=num_orders_today, num_clients=num_clients, orders=orders)
    else:
        return redirect(url_for('login'))
    
# Registro y listado de clientes
@app.route('/clientes', methods=['GET', 'POST'])
def clientes():
    if 'logged_in' in session:
        if request.method == 'POST':
            cedula = request.form['cedula']
            nombre = request.form['nombre']
            ciudad = request.form['ciudad']
            direccion = request.form['direccion']
            celular = request.form['celular']
            email = request.form['email']
            instagram = request.form['instagram']
            cursor = db.cursor()
            cursor.execute("INSERT INTO clientes (cedula, nombre, ciudad, direccion, celular, email, instagram) VALUES (%s, %s, %s, %s, %s, %s, %s)", 
                           (cedula, nombre, ciudad, direccion, celular, email, instagram))
            db.commit()
            cursor.close()
            return redirect(url_for('clientes'))
        else:
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM clientes")
            clientes = cursor.fetchall()
            cursor.close()
            return render_template('clientes.html', clientes=clientes)
    else:
        return redirect(url_for('login'))    
    
@app.route('/cliente/<int:cliente_id>')
def detalle_cliente(cliente_id):
    if 'logged_in' in session:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM clientes WHERE id = %s", (cliente_id,))
        cliente = cursor.fetchone()
        cursor.close()
        if cliente:
            return render_template('detalle_cliente.html', cliente=cliente)
        else:
            return "Cliente no encontrado."
    else:
        return redirect(url_for('login'))

    
@app.route('/ventas')
def ventas():
    if 'logged_in' in session:
        # Lógica para obtener datos de ventas
        return render_template('ventas.html')
    else:
        return redirect(url_for('login'))

@app.route('/saldos')
def saldos():
    if 'logged_in' in session:
        # Lógica para obtener datos de saldos
        return render_template('saldos.html')
    else:
        return redirect(url_for('login'))

@app.route('/analytics')
def analytics():
    if 'logged_in' in session:
        # Lógica para obtener datos de análisis
        return render_template('analytics.html')
    else:
        return redirect(url_for('login'))

@app.route('/message')
def message():
    if 'logged_in' in session:
        # Lógica para obtener datos de mensajes
        return render_template('message.html')
    else:
        return redirect(url_for('login'))

@app.route('/team')
def team():
    if 'logged_in' in session:
        # Lógica para obtener datos del equipo
        return render_template('team.html')
    else:
        return redirect(url_for('login'))

@app.route('/settings')
def settings():
    if 'logged_in' in session:
        # Lógica para obtener datos de configuración
        return render_template('settings.html')
    else:
        return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/historial_cliente', methods=['GET'])
def historial_cliente():
    if 'logged_in' not in session:
        return redirect(url_for('login'))
    
    search_query = request.args.get('search_query', '').strip()
    
    if not search_query:
        return render_template('historial_cliente.html', historial=[], total_deuda=0, saldo_a_favor=0, suma_total=0, cliente_nombre='')

    cursor = db.cursor(dictionary=True)
    try:
        # Buscar el cliente por nombre, cédula o celular
        cursor.execute("""
            SELECT id, nombre FROM clientes WHERE nombre LIKE %s OR cedula LIKE %s OR celular LIKE %s
        """, ('%' + search_query + '%', '%' + search_query + '%', '%' + search_query + '%'))
        cliente = cursor.fetchone()
        if not cliente:
            return render_template('historial_cliente.html', historial=[], total_deuda=0, saldo_a_favor=0, suma_total=0, cliente_nombre='')

        cliente_id = cliente['id']
        cliente_nombre = cliente['nombre']

        # Obtener el historial del cliente
        cursor.execute("""
            SELECT * FROM historial_clientes WHERE cliente_id = %s
        """, (cliente_id,))
        historial = cursor.fetchall()

        # Calcular total deuda, saldo a favor y suma total
        total_deuda = sum(entry['total'] for entry in historial if entry['total'] > 0) or 0
        saldo_a_favor = sum(entry['total'] for entry in historial if entry['total'] < 0) or 0
        suma_total = total_deuda + saldo_a_favor

    finally:
        cursor.close()

    return render_template('historial_cliente.html', historial=historial, total_deuda=total_deuda, saldo_a_favor=saldo_a_favor, suma_total=suma_total, cliente_nombre=cliente_nombre)








# Ruta para el registro de cliente
@app.route('/registro_cliente')
def registro_cliente():
    return render_template('registro_cliente.html')

# Ruta para los movimientos de cliente
@app.route('/movimientos_cliente')
def movimientos_cliente():
    return render_template('movimientos_cliente.html')

if __name__ == '__main__':
    app.run(debug=True)