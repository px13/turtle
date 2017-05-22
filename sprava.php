<?php
include 'functions.php';
page_head("Turtle - Správa projektov");

if (!isset($_SESSION['loggedUser']))
{
	die();
}

if (isset($_POST['delCheckBox']) && !empty($_POST['delCheckBox']))
{
	for ($i = 0 ; $i < count($_POST['delCheckBox']) ; $i++)
	{
		zmazProjekt($_POST['delCheckBox'][$i]);
	}
}

//if (!isset($_SESSION['zoznamProjektov']) || count($_SESSION['zoznamProjektov']) == 0)
//{
	if ($link = db_connect()) {
		$_SESSION['zoznamProjektov'] = array();
		$sql = "SELECT p.project_id, p.name
				FROM projects p
				WHERE p.user_id = ".$_SESSION['loggedUser'];
		$result = mysqli_query($link, $sql);
		while ($row = mysqli_fetch_array($result)) {
			$pom = array();
			$pom[] = $row['project_id'];
			$pom[] = $row['name'];
			$_SESSION['zoznamProjektov'][] = $pom;
		}
	}
	else
	{
		echo "dat-error";
	}
//}

?>
<br>
<form method="post">
	<table border="1">
		<tr>
			<th>Projekt</th>
			<th>Zmazať</th>
		</tr>
		<?php
			for ($i = 0 ; $i < count($_SESSION['zoznamProjektov']) ; $i++)
			{$_SESSION['zoznamProjektov']
				?>
				<tr>
					<td><a href="index.php?id=<?php echo $_SESSION['zoznamProjektov'][$i][0]; ?>"><?php echo $_SESSION['zoznamProjektov'][$i][1]; ?></a></td>
					<td><input name="delCheckBox[]" value="<?php echo $_SESSION['zoznamProjektov'][$i][0]; ?>" type="checkbox"></td>
				</tr>
				<?php
			}
		?>
		<tr>
			<td><input type="button" onclick="location.href='index.php?id=new';" value="+"></td>
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



