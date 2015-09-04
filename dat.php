<?php
	
	$servername = "localhost";
	$username = "";
	$password = '';
	$db = "";	
	
	//User data
	//User ID/ Table to use for queries
	$tbl = $_POST["tbl"];
	$tbl = str_replace("-", "_", $tbl);
	$tbl = str_replace("\n", "", $tbl);
	$typ = $_POST["req"];

	
	// Create connection
	$conn = mysqli_connect($servername, $username, $password, $db);
	
	// Check connection
	if (!$conn) 
	{
		die("Connection failed: " . mysqli_connect_error());
	}
	//Determine Upload or Download
	switch ($typ)
	{
		case "d":
			$str = $_POST["st"];
			$end = $_POST["en"];
			$sql = "SELECT * FROM " . $tbl;
			$sql .= " WHERE date BETWEEN '" . $str . "' AND '" . $end . "'";
			$sql .= " ORDER BY UNIX ASC";
			$result = mysqli_query($conn, $sql);
			
			if (mysqli_num_rows($result) > 0) 
			{
				// output data of each row
				while($row = mysqli_fetch_row($result)) 
				{
					for ($i=0;$i<count($row);$i++)
					{
						echo $row[$i];
						if ($i != count($row)-1){echo ",";}
					}
					echo "\n";
				}
			} 
			else 
			{
				echo "0 results";
			}
			break;
			
		case "u":
			$obs = $_POST["obs"];			
			$obs = str_replace("\n", "", $obs);
			//Check Table exists
			$sql = "SHOW TABLES LIKE '$tbl';";
			$res = mysqli_query($conn, $sql);
			$exist = mysqli_num_rows($res) > 0;
			if ($exist)
			{
				$sql = "INSERT INTO '$tbl' VALUES ($obs);";
				$upl = mysqli_query($conn, $sql);
				
				$o = explode(",",$obs);
				$ob_arr = array("","","","");
				$i = 0;
				foreach ($o as $ob)
				{
					$ob_arr[$i] .= "'" . $ob . "'";
					$i++;
				}
				$obs = implode(",",$ob_arr);
				$sql = "INSERT INTO $tbl VALUES ($obs)";
				if(mysqli_query($conn, $sql)){}else{echo "NOT UPLOADED";}
			}
			else
			{
				$sql  = "CREATE TABLE `$tbl` (";
				$sql .= "`date`	DATE NOT NULL,";
				$sql .= "`UNIX`	DECIMAL(12,2),";
				$sql .= "`local`	TIME,";
				$sql .= "`dust`	DOUBLE PRECISION);";
				//$sql .= "INSERT INTO $tbl VALUES ($obs);";
				
				if(mysqli_query($conn, $sql))
				{
					$o = explode(",",$obs);
					$ob_arr = array("","","","");
					$i = 0;
					foreach ($o as $ob)
					{
						$ob_arr[$i] .= "'" . $ob . "'";
						$i++;
					}
					$obs = implode(",",$ob_arr);
					echo $obs;
					$sql = "INSERT INTO $tbl VALUES ($obs)";
					echo $sql;
					if(mysqli_query($conn, $sql)){}else{echo "NOT UPLOADED";}
					
				}
			}
			break;
			
		case "t":
			$sql = "SHOW TABLES;";
			$result = mysqli_query($conn, $sql);
			
			if (mysqli_num_rows($result) > 0) 
			{
				// output data of each row
				while($row = mysqli_fetch_row($result)) 
				{
					for ($i=0;$i<count($row);$i++)
					{
						echo $row[$i];
						if ($i != count($row)-1){echo ",";}
					}
					echo "\n";
				}
			} 
			else 
			{
				echo "0 results";
			}
			break;
			
		case "t":
			$sql = "SHOW TABLES;";
			$result = mysqli_query($conn, $sql);
			
			if (mysqli_num_rows($result) > 0) 
			{
				// output data of each row
				while($row = mysqli_fetch_row($result)) 
				{
					for ($i=0;$i<count($row);$i++)
					{
						echo $row[$i];
						if ($i != count($row)-1){echo ",";}
					}
					echo "\n";
				}
			} 
			else 
			{
				echo "0 results";
			}
			break;
	}
	
	mysqli_close($conn);
	

	
?>