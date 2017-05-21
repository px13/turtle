<?php
include 'functions.php';
session_start();
/*if (!isset($_SESSION['loggedUser']))
{
	die();
}*/

if (isset($_POST["bin"]) || isset($_POST["fs"]))
{
	$_SESSION['project']->bin = explode(',', $_POST["bin"]);
	if ($_POST['fs'] == "")
	{
		die();
	}
	if (strpos($_POST["fs"], ';') !== false)
	{
		$fs = explode(';', $_POST["fs"]);
	}
	else
	{
		$fs = array();
		$fs[] = $_POST["fs"];
	}
	$_SESSION['project']->fs = array();
	for ($i = 0 ; $i < count($fs) ; $i++)
	{
		$pom = explode(',', $fs[$i]);
		$f = new Func(null, $_SESSION['project']->id, $pom[0], array_slice($_SESSION['project']->bin, intval($pom[1]), intval($pom[2])-intval($pom[1])+1));
		$_SESSION['project']->add_function($f);
	}
}

else if (isset($_POST["pr"]) || isset($_POST["f"]))
{
	if ($link = db_connect()) {
		$sql = "SELECT f.code2 as code2
				FROM projects p
				INNER JOIN functions f on (p.project_id = f.project_id)
				WHERE p.name = '".$_POST["pr"]."' AND f.name = '".$_POST["f"]."' AND p.user_id = ".$_SESSION['loggedUser'];
		$result = mysqli_query($link, $sql);
		if ($row = mysqli_fetch_array($result)) {
			echo $row['code2'];
		}
		else
		{
			echo 0;
		}
	}
	else
	{
		echo 0;
	}
}


