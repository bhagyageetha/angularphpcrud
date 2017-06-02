<?php
/**
 * Created by PhpStorm.
 * User: as
 * Date: 6/2/2017
 * Time: 5:16 PM
 */
$conn=mysqli_connect('localhost','root','','ajandphptesting');
$ndata=json_decode($_POST['sdata']);
$action=$ndata->action;
if($action=="add_student_list"){

    $file=$_FILES["file"]["name"];
    $name=$ndata->name;
    $email=$ndata->email;
    $mbno=$ndata->mbno;
    $address=$ndata->address;
    $iquery="insert into students(NAME,EMAIL,MB_NO,ADDRESS) values('$name','$email','$mbno','$address')";
    $iexe=mysqli_query($conn,$iquery);


    $data=array();
    if($iexe)
    {
        $time = time();
        $newfile=$time."_".$file;
        $last_id = mysqli_insert_id($conn);
        if(move_uploaded_file($_FILES["file"]["tmp_name"], "images/".$newfile))
        {
            $ur = "update students set IMAGE='$newfile' WHERE ID='$last_id'";
            $exe=mysqli_query($conn,$ur);
            if($exe){

                $data['fileupload']='Image Uploaded';
            }
            else{
                $data['fileupload']='Image not Uploaded';
            }

        }
        else{
            $data['fileupload']='Image not Uploaded';
        }
        $data['response']='success';
        $data['msg']="Student list Added successfully";
    }
    else{
        $data['response']='failed';
        $data['msg']="Student list not Added successfully".mysqli_error($conn);
    }
    echo json_encode($data);
}
else if($action=="update_student_list")
{
    $id=$ndata->ID;
    $name=$ndata->NAME;
    $email=$ndata->EMAIL;
    $mbno=$ndata->MB_NO;
    $address=$ndata->ADDRESS;
    $image=$ndata->IMAGE;
    $uquery="update students set NAME='$name',EMAIL='$email',MB_NO='$mbno',ADDRESS='$address' where ID='$id'";
    $uexe=mysqli_query($conn,$uquery);
    $data=array();
    if($uexe)
    {
        if(!empty($_FILES["file"]))
        {
			$file=$_FILES["file"]['name'];
            $time = time();
            $newfile=$time."_".$file;
            $last_id = mysqli_insert_id($conn);
            if(move_uploaded_file($_FILES["file"]["tmp_name"], "images/".$newfile))
            {
                $ur = "update students set IMAGE='$newfile' WHERE ID='$id'";
                $exe=mysqli_query($conn,$ur);
                if($exe){

                    $data['fileupload']='Image Uploaded';
                }
                else{
                    $data['fileupload']='Image not Uploaded';
                }

            }
            else{
                $data['fileupload']='Image not Uploaded';
            }
        }
        else{
            $data['fileupload']='Images not replaced';
        }

        $data['response']='success';
        $data['msg']="Student list Updated successfully";
    }
    else{
        $data['response']='failed';
        $data['msg']="Student list not Updated successfully".mysqli_error($conn);
    }
    echo json_encode($data);
}
