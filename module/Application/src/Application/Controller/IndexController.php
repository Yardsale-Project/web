<?php
namespace Application\Controller;

use Application\Controller\Controller;


use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class IndexController extends Controller
{

    public function indexAction()
    {
        $host = $this->getRequest()->getServer('HTTP_HOST');
        
        if($this->MobileDetect()->isMobile())
        {

           $host = str_replace('local.', '', $host);

           $url = 'http://m-' . $host;

           $this->plugin('redirect')->toUrl($url);

           return false;
        }

        $token  = $this->NoCSRF()->generate('token');
        /*$token  = $this->NoCSRF()->generate('token');
        if(empty($this->_sessionContainer->user_id))
        {
            $this->_view->setVariables(
                array(
                    'token' => $token
                )
            );
            
            $this->_view->setTemplate('application/index/login');

            return $this->_view;
        }

        if(strcasecmp($this->_sessionContainer->terminal_id, 'MAIN') != 0)
        {
            $this->_view->setTemplate('application/index/store');
        }
        $this->_view->setVariables(
            array(
                'token' => $token
            )
        );
        return $this->_view;*/

        $this->_view->setVariables(
            array(
                'token' => $token
            )
        );

        return $this->_view;
    }

    public function loginAction()
    {
        $retVal = array(
            "success" => true,
            "message" => "Logged in",
            "redirect" => "/"
        );

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            try
            {   
                $this->NoCSRF()->check( 'token', $postData, true, 60*10, false);


                $username = $postData['username'];
                $password = $postData['password'];
                $store = $postData['store'];
                
                
                $users = $this->model('Users');
                $result = $users->getUserAccount($username);

                //check if username existed
                if(!empty($result))
                {
                    $securePassword = $result['password'];

                    $bcrypt = new Bcrypt();

                    //get password and verify if equal
                    if ($bcrypt->verify($password, $securePassword))
                    {

                        //check if account is active

                        if(strcasecmp(strtolower(trim($result['deactivated'])), 'Y') == 0)
                        {
                            $retVal = array(
                                "success" => false,
                                "errorMessage" => "Account has been deactivated",
                                "redirect" => "/"
                            );
                        }
                        else
                        {
                            $users->logUserLastLogin($result['user_id']);

                            $this->_sessionContainer->user_id = $result['user_id'];
                            $this->_sessionContainer->user_fName = $result['fName'];
                            $this->_sessionContainer->user_lName = $result['lName'];
                            $this->_sessionContainer->user_role = $result['role'];
                            $this->_sessionContainer->terminal_id = $store;
                            
                        }
                        
                    } 
                    else 
                    {
                        $retVal = array(
                            "success" => false,
                            "errorMessage" => "Invalid password",
                            "redirect" => "/"
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
                
            } 
            catch(\Exception $e) 
            {
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
                    "errorMessage" => $errorMessage . '. ' . $e->getMessage(),
                    "redirect" => "/"
                );
            }

        }
        else
        {
            $retVal = array(
                "success" => false,
                "errorMessage" => "Logged out",
                "redirect" => "/"
            );
        }

        return new JsonModel($retVal);
    }

    public function logoutAction()
    {
        $retVal = array(
            "success" => true,
            "message" => "Logged out",
            "redirect" => "/"
        );

        try
        {  
            $request = $this->getRequest();
            $postData = $request->getPost(); 
            $this->NoCSRF()->check( 'token', $postData, true, 60*10, false);

            $this->_sessionContainer->getManager()->destroy();

        } 
        catch(\Exception $e) 
        {
            $retVal = array(
                "success" => false,
                "errorMessage" => "Invalid request source",
                "redirect" => "/"
            );
        }

        
        return new JsonModel($retVal);
        
    }
}
