<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class UserController extends Controller {


    public function indexAction() {
        $retVal = array();
        return new JsonModel($retVal);
    }

    public function registerUserAction() {
        $retVal = array();
        $specialChars = array(
            '$', '/', '.', '_', '*', '(', ')'
        );

        $request = $this->getRequest();

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {
                $email      = $postData['email']; //$_POST['email'];
                $password   = $postData['password'];
                $uriParams  = $postData['uriParams'];

                // check for existing email
                if( !$this->_isEmailExist($email) ) {
                    
                    // generate unique validation code
                    $bcrypt = new Bcrypt();
                    $secureBcrypt = $bcrypt->create($email);
                    $securePass = $bcrypt->create($password);
                    $hash = hash('sha1', $email);

                    //store to db 
                    $users = $this->model('Users');

                    $data = array(
                        'email'     => $email,
                        'password'  => $securePass,
                        'validationCode'    => str_replace($specialChars, '', $secureBcrypt.$hash),
                        'sent'      => 1,
                        'role_id'   => 2
                    );

                    $result = $users->addUserRegistration($data);

                    if($result) {

                        $basePath = $this->getRequest()->getBasePath();
                        $uri = new \Zend\Uri\Uri($this->getRequest()->getUri());
                        $uri->setPath($basePath);
                        $uri->setQuery(array());
                        $uri->setFragment('');
                        $baseUrl = $uri->getScheme() . '://' . $uri->getHost() . '/' . $uri->getPath();

                        $to = $email;
                        $from = "From: Yardsale <yardsale@yardsale.com>\r\n";
                        $subject = 'do-not-reply : Yardsale Account Verification';
                        $message = "Hi,\r\n";
                        $message .= "\r\n";
                        $message .= "Thank you for joining Yardsale.\r\n";
                        $message .= "\r\n";
                        $message .= "To activate your account, please click the link: ";
                        $message .= $baseUrl . '#validate/' . str_replace($specialChars, '', $secureBcrypt.$hash) . "\r\n";
                        $message .= "\r\n";
                        $message .= "Thank,\r\n";
                        $message .= "\r\n";
                        $message .= "Yardsale";

                        mail($to,$subject,$message,$from);

                        $modelSnsMedia = $this->model('SocialMedia');

                        $uriParams = explode(',', $uriParams);

                        foreach ($uriParams as $requestId) {
                            $result = $modelSnsMedia->getSnsRequest($requestId);

                            if(!empty($result)) {
                                $data = array(
                                    'invite_accepted' => 1
                                );

                                $modelSnsMedia->acceptInvite($data, $result['id']);

                                //commission the user
                                $data = array(
                                    'user_id' => $result['user_id'],
                                    'commission_type_id' => 1
                                );

                                $commissionModel = $this->model('Commission');
                                $commissionModel->addCommission($data);

                                break;
                            }
                        }

                        $retVal['success'] = true;
                        $retVal['message'] = 'A validation link has been sent to your email. Please open your email and click the link to validate and activate your account.';
                    }


                } else {
                    $retVal['success'] = false;
                    $retVal['errorMessage'] = 'Email already exist';
                }

            } catch (\Exception $e){
                $retVal['success'] = false;
                $retVal['errorMessage'] = 'Problem adding user. ' . $e->getMessage();
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request';
        }

        return new JsonModel($retVal);

    }

    public function loginUserAction() {
        $retVal = array(
            "success" => true,
            "message" => "Logged in"
        );

        $request = $this->getRequest();

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {

                $host = $this->getRequest()->getServer('HTTP_HOST');
                $referer = $this->getRequest()->getServer('HTTP_REFERER');

                if(stripos($referer, $host) === FALSE) {
                    $session = $this->model('Session');
                    $result = $session->verifyToken($referer, $postData['token']);

                    if(empty($result)) {
                        throw new \Exception('Missin token' . $referer . ' token : ' . $postData['token']);
                    }
                } else {
                    $this->NoCSRF()->check( 'token', $postData, true, 60*10, false);
                }

                $email      = $postData['email'];
                $password   = $postData['password'];

                $users = $this->model('Users');
                $result = $users->getUserAccount($email);

                if(!empty($result))
                {
                    $securePassword = $result['password'];

                    $bcrypt = new Bcrypt();

                    //get password and verify if equal
                    if ($bcrypt->verify($password, $securePassword))
                    {

                        //check if account is active

                        if($result['active'] == 0)
                        {
                            $retVal = array(
                                "success" => false,
                                "errorMessage" => "Account has been deactivated"
                            );
                        }
                        else
                        {
                            //$users->logUserLastLogin($result['user_id']);

                            $user_id = $result['id'];
                            $loginValidationCode = hash('sha1', date('Y-m-d h:i:s'));
                            $result = $users->storeValidation($user_id, $loginValidationCode);

                            if(stripos($referer, $host) === FALSE) {
                                $session = $this->model('Session');
                                $session->storeToken($referer, $loginValidationCode);
                            } else {
                                $this->_sessionContainer->user_code = $loginValidationCode;
                            }
                            
                            if($result['user_id_count'] == 0 || $result['user_id_count'] == 1) {
                                $retVal['first_login'] = true;
                            }
                            
                            
                        }
                        
                    } 
                    else 
                    {
                        $retVal = array(
                            "success" => false,
                            "errorMessage" => "Invalid password"
                        );
                    }
                }
                else
                {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" => "Invalid username/password",
                        "redirect" => "/"
                    );
                }
                

            } catch (\Exception $e){
                $errorMessage = 'Invalid username/password';
                if(strpos($e->getMessage(), 'password') !== false)
                {
                    $errorMessage = 'Invalid username/password';
                }

                if(strpos(strtolower($e->getMessage()), 'csrf') !== false)
                {
                    $errorMessage = 'Invalid request source';
                }

                $retVal = array(
                    "success" => false,
                    "errorMessage" => $errorMessage . '. ' . $e->getMessage()
                );
            }
        } else {

            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request';

        }

        return new JsonModel($retVal);

    }

    public function logoutAction() {
        $retVal = array(
            "success" => true,
            "message" => "Logged out"
        );

        $request = $this->getRequest();
        $validationCode = '';

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {
                $host = $this->getRequest()->getServer('HTTP_HOST');
                $referer = $this->getRequest()->getServer('HTTP_REFERER');

                if(stripos($referer, $host) === FALSE) {
                    $session = $this->model('Session');
                    $result = $session->verifyToken($referer, $postData['token']);

                    if(empty($result)) {
                        throw new \Exception('Missin token' . $referer . ' token : ' . $postData['token']);
                    }
                } else {
                    $this->NoCSRF()->check( 'token', $postData, true, 60*10, false);
                }

                $session = $this->model('Session');
                if(stripos($referer, $host) === FALSE) {
                    
                    $result = $session->getValidationCode($referer);

                    if(!empty($result)) {
                        $validationCode = $result['validationCode'];
                    }
                } else {
                    $validationCode = $this->_sessionContainer->user_code;
                    $this->_sessionContainer->getManager()->destroy();
                }

                $result = $session->destroyValidationCodeSession($validationCode);

                if(empty($result)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" => "Problem logging out"
                    );
                }

            } catch (\Exception $e){
                $errorMessage = '';

                if(strpos(strtolower($e->getMessage()), 'csrf') !== false)
                {
                    $errorMessage = 'Invalid request source';
                }

                $retVal = array(
                    "success" => false,
                    "errorMessage" => $errorMessage . '. ' . $e->getMessage()
                );
            }
        } else {

            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request';

        }

        return new JsonModel($retVal);
    }

    public function getUserSessionCodeAction() {
        $retVal = array(
            "success" => true,
            "email" => "email@emai.com"
        );

        $request = $this->getRequest();
        $validationCode = '';

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {
                $host = $this->getRequest()->getServer('HTTP_HOST');
                $referer = $this->getRequest()->getServer('HTTP_REFERER');

                if(stripos($referer, $host) === FALSE) {
                    $session = $this->model('Session');
                    $result = $session->getValidationCode($referer);

                    if(!empty($result)) {
                        $validationCode = $result['validationCode'];
                    }
                } else {
                    $validationCode = $this->_sessionContainer->user_code;
                }

                if( empty($validationCode)) {
                    $retVal['email'] = '';
                    $this->_sessionContainer->getManager()->destroy();
                } else {
                    $user = $this->model('Users');
                    $result = $user->getAccoutInfoBySessionCode($validationCode);

                    if(!empty($result)) {
                        $retVal['email'] = $result['email'];
                    } else {
                        $retVal['errorMessage'] = 'Problem getting info';
                    }
                }

            } catch (\Exception $e){

                $retVal = array(
                    "success" => false,
                    "errorMessage" => $e->getMessage()
                );
            }
        } else {

            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request';

        }

        return new JsonModel($retVal);
    }

    private function _isEmailExist($email) {

        try {

            $users = $this->model('Users');
            $result = $users->isEmailExist($email);

            if(!empty($result)) {
                return true;
            }

        } catch ( \Exception $e) {
            throw new \Exception('Cannot check for email');
        }

        return false;
    }

    public function validateHashAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {
                $hash      = $postData['h'];

                $users = $this->model('Users');
                $result = $users->getInfoByValidationCode($hash);

                if(!empty($result)) {
                    $result = $users->activateAccount($result['id']);

                    if(!empty($result)) {
                        $retVal['success'] = true;
                        $retVal['message'] = 'Account activated';
                    } else {
                        $retVal['success'] = false;
                        $retVal['errorMessage'] = 'Account is already activated or there is an error activating the account';
                    }
                } else {

                    $retVal['success'] = false;
                    $retVal['errorMessage'] = 'Invalid link/code';
                }

            } catch (\Exception $e) {

                $retVal['success'] = false;
                $retVal['errorMessage'] = 'Problem activating account. ' . $e->getMessage();
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request.';
        }

        return new JsonModel($retVal);
    }

    public function generateTokenAction() {
        $token  = $this->NoCSRF()->generate('token');

        $host = $this->getRequest()->getServer('HTTP_HOST');
        $referer = $this->getRequest()->getServer('HTTP_REFERER');

        if(stripos($referer, $host) === FALSE) {
            $session = $this->model('Session');
            $session->storeToken($referer, $token);
        }

        return new JsonModel(array(
            'success'   => true,
            'token'     => $token,
            'referer'   => $this->getRequest()->getServer('HTTP_REFERER'),
            'host'      => $this->getRequest()->getServer('HTTP_HOST')
        ));
    }

    public function getUserInfoAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $userModel = $this->model('Users');

                $result = $userModel->getUserInfo($this->getUserId());                

                $retVal['success'] = true;
                $retVal['data'] = $result;
            } catch (\Exception $e) {

                $retVal['success'] = false;
                $retVal['errorMessage'] = 'Problem getting user information. ' . $e->getMessage();
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request.';
        }

        return new JsonModel($retVal);        
    }

    public function saveUserInfoAction(){
        $retVal = array();
        $errors = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();

                $user_id    = (!empty($postData['user_id']))? $postData['user_id'] : 0;
                $firstname  = (!empty($postData['firstname']))? $postData['firstname'] : '';
                $middlename = (!empty($postData['middlename']))? $postData['middlename'] : '';
                $lastname   = (!empty($postData['lastname']))? $postData['lastname'] : '';
                $telephone  = (!empty($postData['telephone']))? $postData['telephone'] : '';
                $mobile     = (!empty($postData['mobile']))? $postData['mobile'] : '';
                $address1   = (!empty($postData['address1']))? $postData['address1'] : '';
                $address2   = (!empty($postData['address2']))? $postData['address2'] : '';
                $country    = 1;

                if(empty($firstname)) {
                    $errors[] = 'First name field cannot be empty.';
                }

                if(empty($lastname)) {
                    $errors[] = 'Last name field cannot be empty.';
                }

                if(empty($mobile)) {
                    $errors[] = 'Mobile field cannot be empty.';
                }

                if(empty($address1)) {
                    $errors[] = 'Address1 field cannot be empty.';
                }

                if(empty($country)) {
                    $errors[] = 'Country field cannot be empty.';
                }

                if(!empty($errors)) {
                    $retVal['success'] = false;
                    $retVal['errorMessage'] = implode('<br>', $errors);
                } else {

                    $userModel = $this->model('Users');

                    $data = array(
                        'firstname'  => $firstname,
                        'middlename' => $middlename,
                        'lastname'   => $lastname,
                        'telephone'  => $telephone,
                        'mobile'     => $mobile,
                        'address1'   => $address1,
                        'address2'   => $address2,
                        'country'    => $country
                    );

                    if(empty($user_id)) {
                        $data['user_id'] = $this->getUserId();
                        $userModel->addUserInfo($data);
                    } else {
                        $userModel->updateUserInfo($data, $user_id);
                    }

                    $retVal['success'] = true;
                    $retVal['message'] = 'Saved';
                }
            } catch (\Exception $e) {

                $retVal['success'] = false;
                $retVal['errorMessage'] = 'Problem saving. ' . $e->getMessage();
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request.';
        }

        return new JsonModel($retVal); 
    }

    public function getPaymentSettingsAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $userModel = $this->model('Users');

                $result = $userModel->getSettings($this->getUserId());                

                $retVal['success'] = true;
                $retVal['data'] = $result;
            } catch (\Exception $e) {

                $retVal['success'] = false;
                $retVal['errorMessage'] = 'Problem getting settings. ' . $e->getMessage();
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request.';
        }

        return new JsonModel($retVal);        
    }
}
