<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class CategoryController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'succcess'  => true,
            'children'  => array(
                array(
                    'text'      => 'Category 1',
                    'children'  => array(
                        array(
                            'text'  => 'Subcat 1,1',
                            'leaft' => true
                        )
                    )
                ),
                array(
                    'text'  => 'Category 2'
                ),
                array(
                    'text'  => 'Category 3',
                    'children'  => array(
                        array(
                            'text'  => 'Subcat 3,1',
                            'leaft' => true
                        ),
                        array(
                            'text'  => 'Subcat 3,2',
                            'leaft' => true
                        )
                    )
                )
            )
        );

        return new JsonModel($retVal);   
    }

    /*public function getUsersAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $users = $this->model('Users');
        $result = $users->getUsers();

        if(!empty($users))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function saveUserAction()
    {
        $data = array();
        $retVal = array();
        $file_temp = "";
        $new_path = null;

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();
            $fileData = $request->getFiles();

            $userId = (!empty($postData['user_id'])) ? $postData['user_id'] : 0;
            $username = (!empty($postData['username'])) ? $postData['username'] : '';
            $password = (!empty($postData['password'])) ? $postData['password'] : '';
            $firstname = (!empty($postData['firstname'])) ? $postData['firstname'] : '';
            $middlename = (!empty($postData['middlename'])) ? $postData['middlename'] : '';
            $lastname = (!empty($postData['lastname'])) ? $postData['lastname'] : '';
            $email = (!empty($postData['email'])) ? $postData['email'] : '';
            $address = (!empty($postData['address'])) ? $postData['address'] : '';
            $gender = (!empty($postData['gender'])) ? $postData['gender'] : '';
            $role = (!empty($postData['role'])) ? $postData['role'] : 0;
            $deactivate = (!empty($postData['deactivate'])) ? $postData['deactivate'] : '';
            $photo = (!empty($fileData['img-photo'])) ? $fileData['img-photo'] : array();

            if(!empty($photo['size']))
            {
                $file       = $photo;
                $file_name  = $file["name"];
                $file_temp  = $file["tmp_name"];
                
                $parts      = explode('.', $file_name);
                $ext        = $parts[1];
                $photo       = date('Y_m_d') . '_' . $username . '.' . $ext;
            }
            else
            {
                $photo = null;
            }
            
            //check for duplicate username
            $users = $this->model('Users');
            $usernameResult = array();

            if(!empty($postData['usernameEdit']))
            {
                $usernameResult = $users->getUserAccount($username);
            }

            if(!empty($usernameResult))
            {
                $retVal = array(
                    "success" => false,
                    "errorMessage" => 'Username "' . $username . '" already exist'
                );
            }
            else
            {
                $bcrypt = new Bcrypt();
                $securePass = $bcrypt->create($password);


                if(!empty($photo))
                {
                    $new_path = move_uploaded_file($file_temp,  ROOTH_PATH . "/public/img/userPic/" . $photo);
                }


                if(empty($userId))
                {
                    $data = array(
                        'username' => $username,
                        'password' => $securePass,
                        'fName'     => $firstname,
                        'midName'   => $middlename,
                        'lName'     => $lastname,
                        'email'     => $email,
                        'address'   => $address,
                        'gender'    => $gender,
                        'createDate'=> date('Y-m-d H:i:s'),
                        'picLocation'=> $photo,
                        'deactivated'=> ($deactivate)? 'Y' :'N',
                        'role'      => $role
                    );

                    if (empty($new_path) && !empty($photo)) 
                    {
                        $retVal = array(
                            'success'       => false,
                            'errorMessage' => 'Error uploading photo'
                        );
                    }
                    else
                    {
                        $affected_rows = $users->addUser($data);

                        if(empty($affected_rows))
                        {
                            $retVal = array(
                                'success'       => false,
                                'errorMessage' => 'Adding new user failed'
                            );
                        }
                        else
                        {
                            $retVal = array(
                                'success'       => true,
                                'message' => 'New user added successfully'
                            );
                        }
                    }
                }
                else
                {
                    $data = array(
                        'username' => $username,
                        'fName'     => $firstname,
                        'midName'   => $middlename,
                        'lName'     => $lastname,
                        'email'     => $email,
                        'address'   => $address,
                        'gender'    => $gender,
                        'updateDate'=> date('Y-m-d H:i:s'),
                        'deactivated'=> ($deactivate)? 'Y' :'N',
                        'role'      => $role
                    );

                    if(!empty($photo))
                    {
                        $data['picLocation'] = $photo;
                    }

                    if(!empty($password))
                    {
                        $data['password'] = $securePass;
                    }

                    if (empty($new_path) && !empty($photo)) 
                    {
                        $retVal = array(
                            'success'       => false,
                            'errorMessage' => 'Error uploading photo'
                        );
                    }
                    else
                    {
                        $affected_rows = $users->updateUser($data, $userId);

                        if(empty($affected_rows))
                        {
                             $retVal = array(
                                'success'       => false,
                                'errorMessage' => 'Updating user failed'
                            );
                        }
                        else
                        {
                            $retVal = array(
                                'success'       => true,
                                'message' => 'User updated successfully'
                            );
                        }
                    }
                }
            }
        }
        else
        {
            $retVal = array(
                'success'       => false,
                'errorMessage' => 'Invalid request'
            );
        }


        return new JsonModel($retVal);
    }

    public function deleteUserAction()
    {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $userId = isset($postData['user_id']) ? $postData['user_id'] : 0;

            if(empty($userId))
            {
                $retVal = array(
                    'success'       => false,
                    'errorMessage' => 'Please select a record to delete.'
                );
            }
            else
            {
                $user = $this->model('Users');
                $affected_rows = $user->deleteUser($userId);

                if(empty($affected_rows))
                {
                    $retVal = array(
                        'success'       => false,
                        'errorMessage' => 'Delete failed.'
                    );
                }
                else
                {
                    $retVal = array(
                        'success'       => true,
                        'message' => 'Record deleted successfully.'
                    );
                }
            }
        }

        return new JsonModel($retVal);
    }*/
}
