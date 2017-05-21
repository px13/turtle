<?php
include 'functions.php';
page_head("Prihlásenie");

session_unset();
if (isset($_POST["email"])&& isset($_POST["pass"]))
{
	
	if ($link = db_connect()) {
		$mail = strtolower(addslashes($_POST["email"])); 
		$password = md5(addslashes($_POST["pass"]));
		$sql = "SELECT u.user_id, u.mail, u.password
				FROM users u
				WHERE LOWER(u.mail) = '$mail'";
		$result = mysqli_query($link, $sql);
		$error = null;
		if ($row = mysqli_fetch_array($result)) {
			if ($password == $row['password']) {
				
					$_SESSION['loggedUser'] = $row['user_id'];
					$_SESSION['loggedUserMail'] = $row['mail'];
				}
			else {
				$error = 'err-wrong-password';
			}
		}
		else {
			$error = 'err-non-existent-acc';
		}
	}
	if ($error !== null){
		echo $error;
	}
	else
	{
		echo "login uspesny";
		?><meta http-equiv="refresh" content="1;url=sprava.php"> <?php
	}
}

?>

<br>
<form method="post">
	<table>
		<tr>
			<td>Email:</td>
			<td><input type="email" name="email" value="<?php if (isset($_POST["email"])) echo $_POST["email"];?>" /></td>
		</tr>
		<tr>
			<td>Heslo:</td>
			<td><input type="password" name="pass" /></td>
		</tr>
		<tr>
			<td><input type="button" onclick="location.href='index.php';" value="Späť"></td>
			<td><input type="submit" name="prihlasit" value="OK"></td>
		</tr>
	</table>
</form>

<?php
page_footer();
?>
