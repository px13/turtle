<?php
include 'functions.php';
page_head("Turtle");
if (isset($_SESSION['loggedUser']) && isset($_POST["textAreaCode"]))
{
	if (!($_SESSION['project']->name == $_POST["projectName"] && $_SESSION['project']->code == $_POST["textAreaCode"]))
	{
		$_SESSION['project']->name = addslashes($_POST["projectName"]);
		$_SESSION['project']->code = addslashes($_POST["textAreaCode"]);
		ulozProjekt($_SESSION['project']);
	}
	
}
else if (isset($_SESSION['loggedUser']) && isset($_GET["id"]))
{
	if ($_GET["id"] == "new")
	{
		$_SESSION['project'] = new Project(null, $_SESSION['loggedUser'], "Novy_projekt", "", []);
	}
	else if ($link = db_connect()) {
		$sql = "SELECT *
				FROM projects p
				WHERE p.project_id = '".$_GET["id"]."' AND p.user_id = ".$_SESSION['loggedUser'];
		$result = mysqli_query($link, $sql);
		if ($row = mysqli_fetch_array($result)) {
			$_SESSION['project'] = new Project($row['project_id'], $row['user_id'], $row['name'], $row['code'], explode(',', $row['code2']));
		}
		else
		{
			echo "projekt neexistuje alebo si ho nevytvoril";
		}
	}
	else
	{
		echo "dat-error";
	}
}

?>

<div id="err">

</div>

<form id="formCode" method="post"><textarea name="textAreaCode" id="projectCode" ><?php if (isset($_SESSION['project'])) echo $_SESSION['project']->code; ?></textarea></form>
<div id="canvasArea">
	<canvas id="canvas" width="500" height="500"></canvas>
	Canvas 500x500
	<button onclick="zmaz()" id="clear">Clear</button>
</div>

<aside id="help">

<h2> Help: </h2>

<h3> Prikazy: </h3>
dopredu x<br>
vlavo x<br>
vpravo x<br>
opakuj x [ ]<br>
kym podmienka [ ]<br>
priradenie: a = 5<br>

<h3> Príklad: </h3>
a = 1<br>
kym a &lt;= 100<br>
[<br>
dopredu a<br>
vpravo 90<br>
a = a + 3<br>
]<br>

</aside>

<div id="c">
	<button onclick="kresliProjekt(document.getElementById('projectCode').value)" id="codeProjectOk">OK</button>
	<?php
	if (isset($_SESSION['loggedUser'])) 
	{
		?>
		<input form="formCode" type="text" name="projectName" id="projectName" value="<?php echo $_SESSION['project']->name;?>">
		<button form="formCode" type="submit">Save</button>
		<?php
	}
	?>
</div>
<div id="d">
	Konzola:
	<input type="text" id="code">
</div>
	
<script>
document.getElementById("code")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        kresli(document.getElementById('code').value);
		document.getElementById('code').value = "";
    }
});
</script>

<?php

page_footer();

?>



