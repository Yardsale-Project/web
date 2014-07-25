<?php
namespace Application\Controller;

use Application\Controller\Controller;
use Application\Controller\FacebookChat\Facebook;
use Application\Controller\FacebookChat\SendMessage;

use Zend\View\Model\JsonModel;
use Zend\Console\Request as ConsoleRequest;
use Zend\Math\Rand;

use \Exception;

class SocialMediaConsoleController extends Controller
{

    private $_fb = null;
    private $_fbMessage = null;

    public function indexAction()
    {

        $retVal     = array();

        return 'test';   
    }

    public function sendInviteAction() {

        $request = $this->getRequest();

        // Make sure that we are running in a console and the user has not tricked our
        // application into running this action from a public web server.
        if (!$request instanceof ConsoleRequest){
            throw new \RuntimeException('You can only use this action from a console!');
        }

        // Get user email from console and check if the user used --verbose or -v flag
        $smsSetting   = $request->getParam('smsSetting');
        $verbose     = $request->getParam('verbose');

        $model = $this->model('SocialMedia');

        $invites = $model->getInvites($smsSetting);

        foreach ($invites as $invite) {
            if($smsSetting == 'fb') {
                $this->_sendFbInvite( $invite['sms_id'], $invite['sms_username'], $invite['token']);
            }
        }

        // reset new password
        //$newPassword = Rand::getString(16);

        /*echo $newPassword;
        //  Fetch the user and change his password, then email him ...
        // [...]

        if (!$verbose){
            return "Done! $smsSetting has received an email with his new password.\n";
        }else{
            return "Done! New password for user $smsSetting is '$newPassword'. It has also been emailed to him. \n";
        }*/
    }

    private function _sendFbInvite( $id, $username, $token) {

        //require_once 'autoload.php';


        $_appID = '266620273529963';
        $_appSecret = '4e5a568421a2fc1cd9d1c914b4234871';

        $config = array(
            'appId'     => $_appID,
            'secret'    => $_appSecret
        );

        if(empty($this->_fb)) {
            $this->_fb = new Facebook($config);
            $this->_fb->setAccessToken($token);
        }

        if(empty($this->_fbMessage)) {
            $this->_fbMessage = new SendMessage($this->_fb);
        }

        $url = 'https://www.facebook.com/' . $id;

        if($id == 10200854482123262) {
            echo 'ID:' . $id . "\r\n";
            echo 'Username:' . $username . "\r\n\r\n";

            $curl = curl_init($url);

            curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($curl, CURLOPT_HEADER, 1);
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);

            $response = curl_exec($curl);

            $header_size = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
            $header = substr($response, 0, $header_size);
            $body = substr($response, $header_size);

            $headers = explode("\r\n", $header);

            foreach ($headers as $value) {
                if(stripos($value, 'Location') !== false) {
                    $location = explode(': ', $value);
                    $url = trim($location[1]);

                    $url = explode('?', $url);
                    $urlParams = $url[1];
                    $urlParams = explode('&', $urlParams);
                    
                    foreach ($urlParams as $urlParam) {

                        if(stripos($urlParam, 'set') !== false) {

                            $set = explode('.', $urlParam);
                            $fbId = $set[ count($set) - 1];

                            echo $fbId . "\r\n";

                            $receiverId=$fbId ; // this may either be username or userID, this class takes care of both the //cases
                            $msg = "test message from yardsale";
                            try{
                                $result = $this->_fbMessage->sendMessage($msg,$receiverId);
                                var_dump($result);
                                echo 'message sent';
                            } catch (\Exception $err) {
                                echo  $err->getMessage();
                            }
                            break;
                        }
                        
                    }

                    break;
                }
            }
        }
    }
}
