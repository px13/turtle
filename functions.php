<?php
//include 'config.php';

function page_head($title)
{
    session_start();
?>
<!DOCTYPE html>
<html lang="sk">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="keywords" content="turtle graphic">
        <meta name="author" content="Peter Kuljovský">
        <title><?php echo $title ?></title>
        <script type="text/javascript" src="turtle.js" ></script>

		<style>
		body {
			background-color: black; 
			background-repeat: no-repeat;
			background-position: center top;
			color: white;
			margin: 0;
			font-family: "Courier New", Courier, monospace;
		}
		
		header {
			
		}
		
		footer {
			position: absolute;
			bottom: 0;
			height: 20px;
			padding: 5px;
			width: 99%;
			text-align:center;
			color: #286900;
		}

		nav {
			margin-top: 10px;
			margin-bottom: 10px;
			
			
		}

		nav ul {
			margin: 0;
			padding: 0;
			text-align:center;
		}

		nav ul li {
			display: inline;
		}

		nav ul li a {
			padding-left: 15px;
			padding-right: 15px;
			font-weight: bold;
			color:#286900;
			text-decoration: none;
		}

		nav ul li a:hover {
			color: #b8860b
		}
		nav ul li .current{
			color: #8b0000;
		}
				
		#projectCode {
			width: 350px;
			height: 521px;
			border: 1px solid white;
			float: left;
			margin: 5px;
			background-color: black;
			color:white;
			resize: none;
		}
		
		#canvasArea {
			width: 500px;
			height: 525px;
			border: 1px solid white;
			margin: 5px;
			float: left;
		}
		
		#canvas {
			
		}
		
		#clear {
			float: right;
		}
		
		aside {
			float: left;
			margin-left: 30px; 
		}

		#c {
			width: 358px;
			height: 25px;
			margin: 5px;
			clear: left;
			float: left;
		}
		#d {
			width: 500px;
			height: 25px;
			margin: 5px;
			float: left;
		}
		#code {
			width: 408px;
			background-color: black;
			color: white;
			border: 1px solid white;
			font-family: "Courier New", Courier, monospace;
		}
		#projectName {
			width: 200px;
			background-color: black;
			color: white;
			border: 1px solid white;
			font-family: "Courier New", Courier, monospace;
		}
		a {
			text-decoration: none;
			color: #286900;
			text-align:center;
		}
		a h1 {
			margin: 0px;
		}
		a:hover {
			color: #b8860b;
		}
		table {
			margin: 0 auto;
		}
		#err {
			color: red;
		}
			
		</style>
		
    </head>

    <body>
		<header>
			<a href="."><h1>Turtle Graphic</h1></a>
		</header>
		<nav>
			<ul>
			<?php
			if (!isset($_SESSION['loggedUser'])) 
			{
				?>
				<li><a href="registracia.php"> Registracia </a></li>
				<li><a href="login.php"> Prihlasenie </a></li>
				<?php
			}
			else
			{
				?>
				<li><a href="sprava.php">Správa projektov</a></li>
				<li><a href="ucet.php">Nastavenie účtu</a></li>
				<li><a href="logout.php"> Odhlasenie (<?php echo $_SESSION['loggedUserMail']; ?>) </a></li>
				<?php
			}
			?>
			</ul>
		</nav>
<?php
}

function echoError($key, $info = null){
    echo $key;
}
function echoMessage($key, $info = null){
    echo $key;
}
function db_connect() {
	
    if ($link = @mysqli_connect('localhost', "skturtle", "***")) {
        if (@mysqli_select_db($link, "skturtle")) {
            @mysqli_query($link, "SET CHARACTER SET 'utf8'");
            return $link;
        } else {
            echoError('err-db-choice-fail');
            return false;
        }
    } else {
        echoError('err-db-connection-fail');
        return false;
    }
}

class Project
{
	public $id, $user_id, $name, $code, $bin, $fs = array();
	
	function __construct($id, $user_id, $name, $code, $bin)
	{
		$this->id = $id;
		$this->user_id = $user_id;
		$this->name = $name;
		$this->code = $code;
		$this->bin = $bin;
	}
	function add_function($f)
	{
		$this->fs[] = $f;
	}
}

class Func
{
	public $id, $name, $bin;
	
	function __construct($id, $project_id, $name, $bin)
	{
		$this->id = $id;
		$this->project_id = $project_id;
		$this->name = $name;
		$this->bin = $bin;
	}
}

function vytvorProjekt($p)
{
	if ($link = db_connect())
    {
		$sql =  "INSERT INTO projects (user_id, name, code, code2) VALUES('".$p->user_id."','".$p->name."','".$p->code."','".implode(',', $p->bin)."')";
		$result = mysqli_query($link, $sql);
		if ($result)
		{
			$p->id = mysqli_insert_id($link);
			echo "ok";
		}
		else
		{
			echo "Chyba pri vytvarani projektu.";
		}
		
	}
	else
	{
		echo "err-db-connection-fail";
	}
}

function zmazProjekt($id)
{
	if ($link = db_connect())
    {
		$sql =  "DELETE FROM projects WHERE project_id = ".$id." AND user_id = ".$_SESSION['loggedUser'];
		$result = mysqli_query($link, $sql);
		if ($result)
		{
			echo "ok";
		}
		else
		{
			echo "Chyba pri mazani projektu";
		}
		
	}
	else
	{
		echo "err-db-connection-fail";
	}
}

function ulozProjekt($p)
{
	if ($p->id == null)
	{
		vytvorProjekt($p);
	}
	else if ($link = db_connect())
    { 
		$sql =  "UPDATE projects SET name = '".$p->name."', code = '".$p->code."', code2 = '".implode(',', $p->bin)."' WHERE project_id = ".$p->id;
        $result = mysqli_query($link,$sql);
		$sql =  "DELETE FROM functions WHERE project_id = ".$p->id;
        $result = mysqli_query($link,$sql);
		for ($i = 0 ; $i < count($p->fs) ; $i++)
		{
			$result = ulozFunkciu($link, $p->fs[$i]);
		}
        if ($result)
		{
			echo "ulozenie uspesne";
        }
		else
		{
			echo "ulozenie neuspesne";
		}
    }
    else
	{
		echo "err-db-connection-fail";
	}
}

function ulozFunkciu($link, $f)
{
	if ($f->id == null)
	{
		$sql = "INSERT INTO functions (project_id, name, code2) VALUES('".$f->project_id."','".$f->name."','".implode(',', $f->bin)."')";
	}
	else
	{
		$sql =  "UPDATE functions SET name = '".$f->name."', code2 = '".implode(',', $f->bin)."' WHERE function_id = ".$f->id;
	}
	$result = mysqli_query($link, $sql);
	if ($f->id == null)
	{
		$f->id = mysqli_insert_id($link);
	}
	return $result;
}

function zmen_heslo($user_id, $pass)
{
	if ($link = db_connect())
    { 
        $sql =  "UPDATE users SET password = '".$pass."' WHERE user_id = ".$user_id."";
        $result = mysqli_query($link,$sql);
        if ($result)
		{
			echo "akcia uspesna";
        }
        else
        {
            echo "akcia neuspesna";
			echo mysqli_error($link);
        }
    }
    else
	{
		echo "err-db-connection-fail";
	}
}

function zmaz_ucet($user_id)
{
	if ($link = db_connect())
    { 
        $sql =  "DELETE FROM users WHERE user_id = ".$user_id."";
        $result = mysqli_query($link,$sql);
        if ($result)
		{
			echo "akcia uspesna";
        }
        else
        {
            echo "akcia neuspesna";
			echo mysqli_error($link);
        }
    }
    else
	{
		echo "err-db-connection-fail";
	}
}

function page_footer()
{
    ?>
	<footer>
		<em>&copy; 2017 Peter Kuljovský</em> 
	</footer>
    </body>
	</html>
    <?php
}