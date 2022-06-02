const http = require('http')
const url = require('url')
const {
	insertar,
	consultar,
	editar,
	eliminar,
	transaccion,
	consultarTransferencias,
} = require('./consultas')
const fs = require('fs')
http
	.createServer(async (req, res) => {
		if (req.url == '/' && req.method === 'GET') {
			res.setHeader('content-type', 'text/html')
			const html = fs.readFileSync('index.html', 'utf8')
			res.writeHead(200, { 'content-type': 'text/html' })
			res.end(html)
		}
		if (req.url == '/usuario' && req.method == 'POST') {
			let body = ''
			req.on('data', (chunk) => {
				body += chunk
			})
			req.on('end', async () => {
				try {
					const datos = Object.values(JSON.parse(body))
					const respuesta = await insertar(datos)
					res.writeHead(201, { 'content-type': 'application/json' })
					res.end(JSON.stringify(respuesta))
				} catch (err) {
					res.writeHead(400, { 'content-type': 'application/json' })
					res.end('Error:', err)
				}
			})
		}
		if (req.url == '/usuarios' && req.method === 'GET') {
			try {
				const registros = await consultar()
				res.writeHead(200, { 'content-type': 'application/json' })
				res.end(JSON.stringify(registros.rows))
			} catch (error) {
				res.writeHead(400, { 'content-type': 'application/json' })
				res.end('Error:', error)
			}
		}
		if (req.url.startsWith('/usuario?') && req.method === 'PUT') {
			const { id } = url.parse(req.url, true).query
			let body = ''
			req.on('data', (chunk) => {
				body += chunk
			})
			req.on('end', async () => {
				const datos = Object.values(JSON.parse(body))
				const respuesta = await editar(datos, id)
				res.writeHead(201, { 'content-type': 'application/json' })
				res.end(JSON.stringify(respuesta))
			})
		}
		if (req.url.startsWith('/usuario?') && req.method == 'DELETE') {
			const { id } = url.parse(req.url, true).query
			const respuesta = await eliminar(id)
			res.writeHead(200, { 'content-type': 'application/json' })
			res.end(JSON.stringify(respuesta))
		}
		if (req.url == '/transferencias' && req.method === 'GET') {
			const registrosTransferencia = await consultarTransferencias()
			res.writeHead(200, { 'content-type': 'application/json' })
			res.end(JSON.stringify(registrosTransferencia))
		}
		if (req.url == '/transferencia' && req.method == 'POST') {
			let body = ''
			req.on('data', (chunk) => {
				body += chunk
			})
			req.on('end', async () => {
				console.log(body)
				const datos = Object.values(JSON.parse(body))
				const respuesta = await transaccion(datos)
				res.writeHead(201, { 'content-type': 'application/json' })
				res.end(JSON.stringify(respuesta))
			})
		}
	})
	.listen(3000, () => {
		console.log('Server running at http://localhost:3000/')
	})
