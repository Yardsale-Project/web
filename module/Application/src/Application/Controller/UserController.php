<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;
use Zend\Mail;

use \Exception;

class UserController extends Controller {


    public function indexAction() {
        $retVal = array();
        return new JsonModel($retVal);
    }

    public function registerUserAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {
                $email      = $postData['email'];
                $password   = $postData['password'];

                // check for existing email
                if( !$this->_isEmailExist($email) ) {
                    
                    // generate unique validation code
                    $bcrypt = new Bcrypt();
                    $secureBcrypt = $bcrypt->create($email);
                    $hash = hash('sha1', $email);

                    //store to db 
                    $users = $this->model('Users');

                    $data = array(
                        'email'     => $email,
                        'password'  => $password,
                        'validationCode'    => str_replace(array('$', '/'), '', $secureBcrypt.$hash),
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

                        //send email
                        $mail = new Mail\Message();
                        $mail->setBody( $baseUrl . '/#validate/' . str_replace(array('$', '/'), '', $secureBcrypt.$hash))
                             ->setFrom('somebody@example.com', 'Some Sender')
                             ->addTo('egeeboygutierrez91@gmail.com', 'Some Recipient')
                             ->setSubject('TestSubject');

                        $retVal['success'] = true;
                        $retVal['message'] = 'Email sent';
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
                        $retVal['errorMessage'] = 'Error activating account';
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
}
