Instrucciones de ejecución / despliegue

Para ejecutar el sistema correctamente, se deben seguir los siguientes pasos:

Primero, es necesario contar con los requisitos instalados en el equipo, como Node.js y MongoDB, ya que el sistema está desarrollado con estas tecnologías.

Una vez descargado o clonado el proyecto (Simulación 3), se debe abrir una terminal en la carpeta principal del sistema. Luego, se deben instalar las dependencias necesarias ejecutando el comando:

npm install

Después, se debe verificar que el archivo de configuración .env contenga los datos de conexión a la base de datos MongoDB, por ejemplo:

MONGO_URI=mongodb://127.0.0.1:27017/NombreBaseDatos
PORT=xxxx

El puerto (PORT) dependerá del que se haya configurado en el proyecto.

Posteriormente, se inicia el servidor backend ejecutando el siguiente comando en la terminal:

node src/app.js

Si el servidor se inicia correctamente, se mostrará un mensaje indicando que está corriendo en el puerto configurado.

Finalmente, se debe abrir un navegador web e ingresar a la siguiente dirección:

http://localhost:PORT

(Reemplazando PORT por el puerto configurado en el proyecto).

Desde ahí se podrá acceder al sistema y utilizar sus funcionalidades, las cuales incluyen la gestión de estudiantes, cursos, docentes y matrículas, permitiendo realizar operaciones como crear, consultar, editar y eliminar registros

La información se almacena en una base de datos MongoDB, la cual crea automáticamente las colecciones al momento de insertar datos por primera vez.
