<?php
include 'functions.php';
page_head("Registrácia");

class Validate {
    var $error_message;

    function email($e) {
        $e = addslashes(strip_tags(trim($e)));
        if ($link = db_connect())
        {
        $sql = "SELECT u.mail
        FROM users as u 
        WHERE u.mail = '".$e."'";
        $result = mysqli_query($link,$sql);  
            if (mysqli_num_rows($result) == 0 )
            {
            return true;
            }
            else
            {
            $this->HandleError("err-email-duplicate");
            return false;
            }
        }
    }
    function validate_pass($p1,$p2) {
    	if ($p1 != $p2)
    	{
    		$this->HandleError("err-password-match");
    		return false;
    	}else{
    		return true;
    	}
    }
    function validate_mail($e){
    	
    	if (empty($e)) {
        $this->HandleError("err-no-email");
        return false;
      } else {
        // check if e-mail address is well-formed
        if (!filter_var($e, FILTER_VALIDATE_EMAIL)) {
          $this->HandleError("err-invalid-email");
          return false;
        }
      }
      return true;
    }
    function required_pass($p) {
    	if (empty($p)){
    		$this->HandleError("err-no-password");
    		return false;
    	}
    	return true;
    }
    function GetErrorMessage()
    {
        if(empty($this->error_message))
        {
            return '';
        }
        $errormsg = nl2br(htmlentities($this->error_message,ENT_COMPAT,"UTF-8"));
        return $errormsg;
    }    
    //-------Private Helper functions-----------
    
    function HandleError($err)
    {
        $this->error_message = $err;
    }
}
class Reg{
    var $error_message;
    var $message;
    function registruj($email,$pass) 
    {
      if ($link = db_connect())
      { 
        $sql =  "INSERT INTO users (mail, password) VALUES('".$email."','".$pass."')";
        $result = mysqli_query($link,$sql); 
		session_unset();
        if ($result)
		{
			$_SESSION['loggedUser'] = mysqli_insert_id($link);
			$_SESSION['loggedUserMail'] = $email;
			$_SESSION['project'] = new Project(null, $_SESSION['loggedUser'], "Novy projekt", "", "");
			vytvorProjekt($_SESSION['project']);
			$this->Handle("m-registration-success");
			?>
			<meta http-equiv="refresh" content="10;url=index.php"> 
			<?php      
        }
        else
        {
            $this->HandleError("err-registration");
            ?>
            <meta http-equiv="refresh" content="10;url=registracia.php"> 
            <?php
        }
    }
    else
        {
            $this->HandleError("err-db-connection-fail");
        }
    }
    function GetErrorMessage()
    {
        if(empty($this->error_message))
        {
            return '';
        }
        $errormsg = nl2br(htmlentities($this->error_message,ENT_COMPAT,"UTF-8"));
        return $errormsg;
    } 
    function GetMessage()
    {
        if(empty($this->message))
        {
            return '';
        }
        $msg = nl2br(htmlentities($this->message,ENT_COMPAT,"UTF-8"));
        return $msg;
    }       
    
    function HandleError($err)
    {
        $this->error_message = $err;
    }
    function Handle($msg)
    {
        $this->message = $msg;
    }
}

session_unset();
$val = new Validate();
$reg = new Reg();
if (isset($_POST["email"])&& $val->validate_mail($_POST["email"]) &&
	isset($_POST["pass"])&&  $val->required_pass($_POST["pass"]) &&
	isset($_POST["pass2"])&& $val->required_pass($_POST["pass2"]) )
	{
		$_SESSION['email'] = strtolower(addslashes($_POST["email"]));   
		$_SESSION['pass']  = md5(addslashes($_POST["pass"]));
		$_SESSION['pass2'] = md5(addslashes($_POST["pass2"]));
		if($val->email($_SESSION['email']) && $val->validate_pass($_SESSION['pass'],$_SESSION['pass2'])){
			$reg->registruj($_SESSION['email'],$_SESSION['pass']);
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
			<td>Heslo znova:</td>
			<td><input type="password" name="pass2"/></td>
		</tr>
		<tr>
			<td><input type="button" onclick="location.href='index.php';" value="Späť"></td>
			<td><input type="submit" name="registrovat" value="OK"></td>
		</tr>
	</table>
</form>


<?php
echoMessage($reg->GetMessage());
$err = $val->GetErrorMessage();
echoError(!empty($err) ? $err : $reg->GetErrorMessage());
page_footer();
?>
