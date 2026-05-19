<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro de Voluntarios</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>

<div class="contenedor">
    <h1>Registro de Voluntarios</h1>

    <form action="guardar.php" method="POST">

        <label>Nombre:</label>
        <input type="text" name="nombre" required>

        <label>Edad:</label>
        <input type="number" name="edad" required>

        <label>Género:</label>
        <select name="genero" required>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
        </select>

        <label>Tipo de Voluntariado:</label>
        <select name="tipo" required>
            <option value="Salud">Salud</option>
            <option value="Educación">Educación</option>
            <option value="Medio Ambiente">Medio Ambiente</option>
            <option value="Animales">Animales</option>
        </select>

        <input type="submit" value="Guardar Voluntario">

    </form>

    <br>

    <a href="informacion.php">Ver Información de Voluntarios</a>

</div>

</body>
</html>