const pool = require('./db')
const insertar = async (datos) => {
	const consulta = {
		text: 'INSERT INTO usuarios (nombre, balance) values($1, $2) RETURNING *',
		values: datos,
	}
	try {
		const result = await pool.query(consulta)
		return result
	} catch (error) {
		console.log(error.code)
		return error
	}
}
const consultar = async () => {
	try {
		const result = await pool.query('SELECT * FROM usuarios')
		return result
	} catch (error) {
		console.log(error.code)
		return error
	}
}
const editar = async (datos, id) => {
	const consulta = {
		text: `UPDATE usuarios SET
  nombre = $1,
  balance = $2
  WHERE id = $3 RETURNING *`,
		values: [...datos, id],
	}
	try {
		const result = await pool.query(consulta)
		console.log(result)
		return result
	} catch (error) {
		console.log(error)
		return error
	}
}
const eliminar = async (id) => {
	try {
		const result = await pool.query(`DELETE FROM usuarios WHERE id = $1`, [id])
		return result
	} catch (error) {
		console.log(error.code)
		return error
	}
}
const consultarTransferencias = async () => {
	const query = {
		text: 'SELECT fecha, nombreemisor.nombre, nombrereceptor.nombre, monto FROM transferencias AS transf INNER JOIN usuarios AS nombreemisor ON transf.emisor = nombreemisor.id INNER JOIN usuarios AS nombrereceptor ON transf.receptor = nombrereceptor.id;',	
		rowMode: 'array',
	}
	try {
		const result = await pool.query(query)
		return result.rows
	} catch (error) {
		console.log(error.code)
		return error
	}
}
const transaccion = async (datos) => {
   const [emisor, receptor, monto] = datos
	if(emisor === receptor) return null
   pool.connect(async (err, client, release) => {
	await client.query('BEGIN')
	try {
		const transaction =
			'INSERT INTO transferencias (emisor, receptor, monto, fecha) values ($1, $2, $3, NOW())'
		const ultimaTRansaccion = await client.query(transaction, [emisor, receptor, monto])
		const descontar = 'UPDATE usuarios SET balance = balance - $1 WHERE id = $2'
		await client.query(descontar, [monto, emisor])
		const acreditar = 'UPDATE usuarios SET balance = balance + $1 WHERE id = $2'
		await client.query(acreditar, [monto, receptor])
		await client.query('COMMIT')
		console.log(ultimaTRansaccion.rows)
		return ultimaTRansaccion.rows
	} catch (e) {
		await client.query('ROLLBACK')
		console.log('Error código: ' + e.code)
		console.log('Detalle del error: ' + e.detail)
		console.log('Tabla originaria del error: ' + e.table)
		console.log('Restricción violada en el campo: ' + e.constraint)
	}
   release()
})
}

module.exports = { insertar, consultar, editar, eliminar, consultarTransferencias, transaccion }
