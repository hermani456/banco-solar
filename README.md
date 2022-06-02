# Prueba Banco Solar
Habilidades a evaluar
- Conectar una base de datos PostgreSQL con Node.
- Realizar consultas DML con Node y el paquete pg.
- Realizar consultas TCL con Node y el paquete pg.
- Construir una API RESTful utilizando PostgreSQL para la persistencia de datos.
- Manejar errores.
- Manejar códigos de estado HTTP

## Herramientas usadas

- [PostgreSQL](https://www.postgresql.org/download/) - Descargar postgresql 
- [Nodejs](https://nodejs.org/en/) - Descargar nodejs.

## Pasos para ejecutar el proyecto
1. Crear una base de datos llamada bancosolar con el siguiente comando: 
- `CREATE DATABASE bancosolar;`
2. Crear la tabla usuarios:
- `CREATE TABLE usuarios (
   id SERIAL PRIMARY KEY,
   nombre VARCHAR(50),
   balance FLOAT CHECK (balance >= 0)
);`
3. Crear la tabla transferencias:
- `CREATE TABLE transferencias (
   id SERIAL PRIMARY KEY,
   emisor INT,
   receptor INT,
   monto FLOAT,
   fecha TIMESTAMP,
   FOREIGN KEY (emisor) REFERENCES usuarios(id),
   FOREIGN KEY (receptor) REFERENCES usuarios(id)
);`
4. Descargar o clonar el repositorio.
5. Dentro de la carpeta raiz del proyecto abrir una terminal y ejecutar el siguiente comando:
- `npm run setup`
6. Finalmente ingresar a la siguiente url: http://localhost:3000
