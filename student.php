<?php 
$conn=mysqli_connect('localhost','root','','ajandphptesting');
$post=file_get_contents("php://input");
$ndata=json_decode($post);
$action=$ndata->action;
if($action=='get_student_list')
{
	$sqry="select * from students";
	$exe=mysqli_query($conn,$sqry);
	$data=array();
	if(mysqli_num_rows($exe)>0)
	{
		$data['reponse']='success';
			while($row=mysqli_fetch_assoc($exe))
			{
				$data['list'][]=$row;
			}
		}
	else
	{
		$data['reponse']='failed';
		$data['list']=array();
	}
	$slist=json_encode($data);
	echo $slist;
}
else if($action=="add_student_list")
{
	$name=$ndata->name;
	$email=$ndata->email;
	$mbno=$ndata->mbno;
	$address=$ndata->address;
	$iquery="insert into students(NAME,EMAIL,MB_NO,ADDRESS) values('$name','$email','$mbno','$address')";
	$iexe=mysqli_query($conn,$iquery);
	$data=array();
	if($iexe)
	{
		$data['response']='success';
		$data['msg']="Student list Added successfully";
	}
	else{
		$data['response']='failed';
		$data['msg']="Student list not Added successfully".mysqli_error($conn);
	}
	echo json_encode($data);
}
else if($action=="get_student_data")
{
	$id=$ndata->id;
	$sqry="select * from students where ID='$id'";
	$exe=mysqli_query($conn,$sqry);
	$data=array();
	if(mysqli_num_rows($exe)>0)
	{
		$data['response']='success';
		while($row=mysqli_fetch_assoc($exe))
		{
			$data['list']=$row;
		}
	}
	else
	{
		$data['response']='failed';
		$data['list']=array();
	}
	$slist=json_encode($data);
	echo $slist;

}
/*else if($action=="update_student_list")
{
	$id=$ndata->ID;
	$name=$ndata->NAME;
	$email=$ndata->EMAIL;
	$mbno=$ndata->MB_NO;
	$address=$ndata->ADDRESS;
	$uquery="update students set NAME='$name',EMAIL='$email',MB_NO='$mbno',ADDRESS='$address' where ID='$id'";
	$uexe=mysqli_query($conn,$uquery);
	$data=array();
	if($uexe)
	{
		$data['response']='success';
		$data['msg']="Student Details Updated successfully";
	}
	else{
		$data['response']='failed';
		$data['msg']="Student Details not Updated successfully".mysqli_error($conn);
	}
	echo json_encode($data);

}*/
else if($action=="delete_student_data")
{
	$id=$ndata->id;
	$dqry="delete from students where ID='$id'";
	$dexe=mysqli_query($conn,$dqry);
	$data=array();
	if($dexe)
	{
		$data['response']='success';
		$data['msg']="Student Removed successfully";
	}
	else
	{
		$data['response']='failed';
		$data['msg']="Student not Removed".mysqli_error($conn);;
	}
	$slist=json_encode($data);
	echo $slist;

}
?>