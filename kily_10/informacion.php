------------------------ PAGINA INFORMACION.PHP -----------------------------
<script>
function home(){
  document.location.href="index.php";
}
</script>

<BODY>
<input type = button value="HOME" onclick="home()";">    
<br>
</BODY>

//------------------------- FUNCIONES ------------------------------------
<?php
function Mostrar($DepEleg)
{
    $archivo = "datos.txt";
    $obj = fopen($archivo,'r');
        
    echo "<CENTER><H1>LISTADO GENERAL DE PROYECTOS DE CONSTRUCCION</H1></CENTER>";
    echo "<CENTER><H2>DEPARTAMENTO: $DepEleg</H2></CENTER>";
    echo "<hr size=5>";
    echo "<table border =2 align=center>";
    echo "<tr align=center bgcolor=red> ";
    echo "<th>FECHA DE INICIO</th> <th>NOMBRE DEL PROYECTO</th> <th>NUMERO DE DIAS</th> <th>DEPARTAMENTO</th> <th>MONTO PROYECTO</th> </TR>";

     $Acu=0;

    while(($Linea = fgets($obj)) !== false)
    {
      list($fec,$pro, $dur,$dep,$Mon) = explode("*",$Linea);
      if($dep == $DepEleg)
      {
        MuestraRegistro($fec, $pro, $dur, $dep, $Mon);
        $Acu += $Mon;
      }
    }
    echo "<tr align=center bgcolor=pink><td colspan=5>Total Monto: $Acu</tr>";
    echo "</table>";
    fclose($obj);
}
function MuestraRegistro($fec, $pro, $dur, $dep, $Mon)
{
    echo "<tr><td>$fec</td> 
    <td>$pro</td>
    <td>$dur</td>
    <td>$dep</td>
    <td>$Mon</td>
    </tr>";
}

?>

// -------------------  BLOQUE PRINCIPAL ---------------------------------
<?php
//Bloque Principal
$DepEleg = $_REQUEST["departamento"];
$DepEleg = str_replace("_"," ",$DepEleg);

Mostrar($DepEleg);
?>

