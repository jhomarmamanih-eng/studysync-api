<?php

$nombre = $_POST['nombre'];
$edad = $_POST['edad'];
$genero = $_POST['genero'];
$tipo = $_POST['tipo'];

// Horas aleatorias entre 3 y 8
$horas = rand(3, 8);

// INVESTIGACION (FUNCIÓN date())//

$fechaRegistro = date("d/m/Y H:i:s");

// Datos a guardar
$registro = $nombre . ";" .
            $edad . ";" .
            $genero . ";" .
            $tipo . ";" .
            $horas . ";" .
            $fechaRegistro . "\n";

// Guardar en archivo texto
$archivo = fopen("voluntarios.txt", "a");
fwrite($archivo, $registro);
fclose($archivo);

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Datos Guardados</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body>

<div class="contenedor">

    <h1>Voluntario Registrado</h1>

    <table>
        <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Género</th>
            <th>Tipo</th>
            <th>Horas</th>

            <!-- NUEVA COLUMNA -->
            <th>Fecha Registro</th>
        </tr>

<?php

$archivo = fopen("voluntarios.txt", "r");

while(!feof($archivo))
{
    $linea = fgets($archivo);

    if(trim($linea) != "")
    {
        $datos = explode(";", $linea);

        echo "<tr>";
        echo "<td>" . $datos[0] . "</td>";
        echo "<td>" . $datos[1] . "</td>";
        echo "<td>" . $datos[2] . "</td>";
        echo "<td>" . $datos[3] . "</td>";
        echo "<td>" . $datos[4] . "</td>";

        //AQUÍ SE MUESTRA LA FECHA REGISTRADA//

        echo "<td>" . $datos[5] . "</td>";

        echo "</tr>";
    }
}

fclose($archivo);

?>

    </table>

    <br>

    <a href="index.php">Volver</a>

</div>

</body>
</html>