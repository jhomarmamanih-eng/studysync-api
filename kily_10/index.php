<!-- index.php -->
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fundación Prosociedad</title>

<style>
    body{
        background:#00e64d;
        font-family: "Arial Narrow", Arial, sans-serif;
        margin:0;
        padding:0;
    }

    h1{
        text-align:center;
        padding:30px 0;
        font-family: Impact, serif;
        font-size:48px;
        color:black;
        margin:0;
    }

    hr{
        border:2px solid #ccc;
        width:90%;
    }

    .contenedor{
        width:830px;
        margin:40px auto;
        border:3px solid #444;
        background:#36c9d0;
        box-shadow:0 0 0 3px #888 inset;
    }

    .logo{
        text-align:center;
        padding:20px;
        border-bottom:2px solid #666;
    }

    .logo img{
        width:220px;
        height:220px;
        object-fit:contain;
        background:white;
    }

    table{
        width:100%;
        border-collapse:collapse;
    }

    td{
        border:2px solid #666;
        padding:12px;
        text-align:center;
        font-size:24px;
        font-family: "Arial Narrow", Arial, sans-serif;
    }

    input[type="text"],
    input[type="number"],
    input[type="date"],
    select{
        font-size:20px;
        padding:4px;
        width:180px;
    }

    .botones input{
        font-size:20px;
        padding:8px 20px;
        cursor:pointer;
    }

    .radio-group{
        font-size:22px;
    }

    .radio-group label{
        margin-right:10px;
    }
</style>
</head>
<body>

<h1>FUNDACION PROSOCIEDAD</h1>
<hr>

<div class="contenedor">

    <div class="logo">
        <!-- Cambia logo.png por la imagen que tengas -->
        <img src="logo.png" alt="Logo Fundación">
    </div>

    <form action="guardar.php" method="post">
        <table>
            <tr>
                <td>
                    FECHA REGISTRO:<br>
                    <input type="date" name="fecha" required>
                </td>
                <td>
                    NOMBRE DEL VOLUNTARIO:<br>
                    <input type="text" name="nombre" required>
                </td>
            </tr>

            <tr>
                <td>
                    GÉNERO:<br>
                    <select name="genero">
                        <option>Masculino</option>
                        <option>Femenino</option>
                    </select>
                </td>
                <td>
                    EDAD:<br>
                    <input type="number" name="edad" min="1" max="100" required>
                </td>
            </tr>

            <tr>
                <td>
                    TIPO DE VOLUNTARIADO:<br>
                    <div class="radio-group">
                        <label><input type="radio" name="tipo" value="Bombero" required> Bombero</label>
                        <label><input type="radio" name="tipo" value="Banco de Sangre"> Banco de Sangre</label>
                        <label><input type="radio" name="tipo" value="Hambre Cero"> Hambre Cero</label>
                    </div>
                </td>
                <td>
                    DÍA DISPONIBLE A LA SEMANA:<br>
                    <select name="dia">
                        <option>Lunes</option>
                        <option>Martes</option>
                        <option>Miércoles</option>
                        <option>Jueves</option>
                        <option>Viernes</option>
                        <option>Sábado</option>
                        <option>Domingo</option>
                    </select>
                </td>
            </tr>

            <tr class="botones">
                <td>
                    <input type="submit" value="GUARDAR">
                </td>
                <td>
                    <input type="button" value="INFORMACIÓN"
                           onclick="window.location.href='informacion.php'">
                </td>
            </tr>
        </table>
    </form>

</div>

</body>
</html>