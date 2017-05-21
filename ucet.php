<?php
include 'functions.php';
page_head("Turtle - Nastavenie účtu");

if (!isset($_SESSION['loggedUser']))
{
	die();
}

if (isset($_POST["del"]) && $_POST["del"] == "on")
{
	zmaz_ucet($_SESSION['loggedUser']);
	session_unset();
	session_destroy();
	?><meta http-equiv="refresh" content="1;url=index.php"><?php
}

if (isset($_POST["pass"]) && isset($_POST["pass2"]) && $_POST["pass"] != "")
{
	if ($_POST["pass"] != $_POST["pass2"])
	{
		echo "Heslo a Heslo znova sa nezhoduje.";
	}
	else
	{
		zmen_heslo($_SESSION['loggedUser'], md5(addslashes($_POST["pass"])));
		?><meta http-equiv="refresh" content="1;url=index.php"><?php
	}
}

?>
<br>
<form method="post">
	<table>
		<tr>
			<td>Zmazať účet:</td>
		</tr>
		<tr>
			<td><input type="checkbox" name="del"></td>
		</tr>
		<tr>
			<td>Zmena hesla:</td>
		</tr>
		<tr>
			<td>Nové heslo:</td>
			<td><input type="password" name="pass" /></td>
		</tr>
		<tr>
			<td>Nové heslo znova:</td>
			<td><input type="password" name="pass2"/></td>
		</tr>
		<tr>
			<td><input type="button" onclick="location.href='index.php';" value="Späť"></td>
			<td><input type="submit" name="zmena" value="OK"></td>
		</tr>
	</table>
</form>

<?php

page_footer();

?>



