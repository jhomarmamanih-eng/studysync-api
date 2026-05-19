<script>
function home() {
    document.location.href = "index.php";
}
</script>

<body>
    <input type="button" value="HOME" onclick="home()">
    <br>
</body>

<?php
// ------------------------- FUNCIONES ------------------------------------

function Guardar($fec, $pro, $dur, $dep, $mon)
{
    $archivo = "datos.txt";
    $obj = fopen($archivo, 'a');

    // Guardar los datos separados por *
    fputs($obj, $fec . "*" . $pro . "*" . $dur . "*" . $dep . "*" . $mon . "*\n");

    fclose($obj);
}

function ObtMonto($dep, $dur)
{
    switch ($dep) {
        case "SANTA CRUZ":
            return rand(200, 205) * $dur;

        case "COCHABAMBA":
            return rand(50, 55) * $dur;

        default:
            return rand(100, 105) * $dur;
    }
}

function MuestraRegistro($fec, $pro, $dur, $dep, $mon)
{
    echo "<tr>
            <td>$fec</td>
            <td>$pro</td>
            <td>$dur</td>
            <td>$dep</td>
            <td>$mon</td>
          </tr>";
}

function Mostrar()
{
    $archivo = "datos.txt";

    // Verificar si el archivo existe
    if (!file_exists($archivo)) {
        echo "<p>No existen registros.</p>";
        return;
    }

    $obj = fopen($archivo, 'r');

    echo "<center><h1>LISTADO GENERAL DE PROYECTOS DE CONSTRUCCIÓN</h1></center>";
    echo "<hr size='5'>";
    echo "<table border='2' align='center'>";
    echo "<tr align='center' bgcolor='red'>
            <th>FECHA DE INICIO</th>
            <th>NOMBRE DEL PROYECTO</th>
            <th>NÚMERO DE DÍAS</th>
            <th>DEPARTAMENTO</th>
            <th>MONTO PROYECTO</th>
          </tr>";

    while (($linea = fgets($obj)) !== false) {
        list($fec, $pro, $dur, $dep, $mon) = explode("*", $linea);
        MuestraRegistro($fec, $pro, $dur, $dep, $mon);
    }

    echo "</table>";

    fclose($obj);
}

// ------------------- BLOQUE PRINCIPAL -----------------------------------

$fec = $_REQUEST["fecha"];
$pro = $_REQUEST["proyecto"];
$dur = $_REQUEST["duracion"];
$dep = $_REQUEST["departamento"];

// Calcular monto
$mon = ObtMonto($dep, $dur);

// Guardar datos
Guardar($fec, $pro, $dur, $dep, $mon);

// Mostrar registros
Mostrar();
?>