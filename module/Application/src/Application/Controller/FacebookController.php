<?php
namespace Application\Controller;

use Application\Controller\Controller;


use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;
use Zend\Http\Client;

use \Exception;

use Facebook\FacebookSession;
use Facebook\FacebookRedirectLoginHelper;
use Facebook\FacebookRequest;
use Facebook\FacebookRequestException;

use Application\Controller\FacebookChat\SendMessage;
use Application\Controller\FacebookChat\Facebook;

class FacebookController extends Controller
{
    private $_appID = '266620273529963';
    private $_appSecret = '4e5a568421a2fc1cd9d1c914b4234871';
    private $_fbSession = null;
    private $_redirectUri = 'http://yardsale.druidinc.com';


    public function __construct() {

      FacebookSession::setDefaultApplication($this->_appID, $this->_appSecret);
      parent::__construct();
    }

    public function indexAction()
    {
        
    }

    private function _checkFBSession() {
        $retVal = array(
            'fbsession' => null,
            'loginUrl'  => null
        );
        
        $helper = new FacebookRedirectLoginHelper('http://yardsale.druidinc.com');

        try {
            $this->_fbSession = $helper->getSessionFromRedirect();
        } catch(FacebookRequestException $ex) {
            // When Facebook returns an error
            $this->_fbSession = null;
            $retVal['errorMessage'] = $ex->getMessage();
        } catch(\Exception $ex) {
            // When validation fails or other local issues
            $this->_fbSession = null;
            $retVal['errorMessage'] = $ex->getMessage();
        }

        if (empty($this->_fbSession)) {
            $this->_fbSession = null;

            $retVal['fbsession'] = $this->_fbSession;
                $retVal['loginUrl'] = $helper->getLoginUrl(array(
                'scope' => 'email',
                'display' => 'popup'
            ));
        }

        return $retVal;
    }

    public function postFeedAction() {
        $retVal = array();

        $fbStatus = $this->_checkFBSession();

        if(empty($fbStatus['fbsession'])) {

            if(!empty($fbStatus['errorMessage'])) {
                $retVal = array(
                    'success' => false,
                    'errorMessage'  => $fbStatus['errorMessage']
                );
            } else {
                $retVal = array(
                    'success' => true,
                    'status'  => 'login',
                    //'loginUrl'  => $fbStatus['loginUrl']
                    'loginUrl' => 'https://www.facebook.com/dialog/feed?app_id=' . $this->_appID . '&display=page&caption=An%20example%20caption&link=http://yardsale.druidinc.com&redirect_uri=http://yardsale.druidinc.com'
                );
            }
        }

        return new JsonModel($retVal);
    }

    public function getShareLinkAction() {
        $retVal = array();

        $_url = 'https://www.facebook.com/dialog/share_open_graph?';

        $actionProp = array(
            'object' => 'http://yardsale.druidinc.com',
            'message' => 'this is a message',
            'scrape'  => 'true',
            'image' =>    'http://yardsale.druidinc.com/img/admin/logo/logo_1.png'
        );

        $actionProp = json_encode($actionProp);

        $urlArr = array(
            'app_id=' . $this->_appID,
            'display=page',
            'action_type=share',
            'action_properties=' . urlencode($actionProp),
            'redirect_uri='. $this->_redirectUri
        );

        $_url = $_url . implode('&', $urlArr);

        $retVal = array(
            'success' => true,
            'url' => $_url
        );

        return new JsonModel($retVal);
    }

    public function fbInviteAction() {
        $retVal = array();

        $request = $this->getRequest();

        $customMessage = $this->params()->fromQuery('custom_message',null);
        $redirectUrl = 'http://yardsale.druidinc.com/?custom_message=' . urlencode($customMessage) . '#home/fb';

        $helper = new FacebookRedirectLoginHelper($redirectUrl);

        try {
            $fbSession = $helper->getSessionFromRedirect();
        } catch(FacebookRequestException $ex) {
            $retVal['success'] = false;
            $retVal['errorMessage'] = $ex->getMessage();

            $fbSession = null;
        } catch(\Exception $ex) {
            $retVal['success'] = false;
            $retVal['errorMessage'] = $ex->getMessage();

            $fbSession = null;
        }
        

        if(empty($fbSession)) {
            $params = array(
                'scope'         => 'xmpp_login, user_friends, publish_actions'
            );
            $loginUrl = $helper->getLoginUrl($params);

            $retVal = array(
                'success' => true,
                'loginUrl' => $loginUrl,
                'session'   => $fbSession
            );
        } else {
            try {
                $response = (new FacebookRequest($fbSession, 'GET', '/me/taggable_friends'))->execute();
                $object = $response->getGraphObjectList();
                $id = 0;

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
                    $id = 0;
                } else {
                    $user = $this->model('Users');
                    $result = $user->getAccoutInfoBySessionCode($validationCode);

                    if(!empty($result)) {
                        $id = $result['id'];
                    } else {
                        $retVal['success'] = false;
                        $retVal['errorMessage'] = 'Problem getting info';
                    }
                }
                
                if(!empty($id)) {

                    $smsModel = $this->model('SocialMedia');

                    $accessToken = $fbSession->getToken();

                    $smsModel->saveAccessToken($id, 'fb', $accessToken);

                    $fb = array();
                    foreach ($object as $dataProp) {
                        $name       = $dataProp->getProperty('name');
                        $pictureObj = $dataProp->getProperty('picture');
                        $picData    = $pictureObj->asArray();
                        $picUrl     = $picData->url;

                        $explodedPicUrl = explode('/', $picUrl);
                        $picName        = $explodedPicUrl[ count($explodedPicUrl) - 1];
                        $explodedPicName = explode('_', $picName);
                        $fbID           = $explodedPicName[1];

                        $data = array(
                            'user_id'       => $id,
                            'fbid'          => $fbID,
                            'fb_username'   => $name,
                            'custom_message'=> $customMessage
                        );

                        $smsModel->addInvite($data);

                        $fb[] = array(
                            'name' => $name,
                            'id'    => $fbID
                        );
                        

                        //$url = 'https://www.facebook.com/10200854482123262';
                    }

                    $retVal['success'] = true;
                    $retVal['message'] = 'Invites sent';
                    $retVal['fb'] = $fb;
                } else {
                    $retVal['success'] = false;
                    $retVal['errorMessage'] = 'Invite sending failed';
                }
                
            } catch (FacebookRequestException $ex) {
                $retVal['success'] = false;
                $retVal['errorMessage'] = $ex->getMessage();
            } catch (\Exception $ex) {
                $retVal['success'] = false;
                $retVal['errorMessage'] = $ex->getMessage();
            }
        }

        return new JsonModel($retVal);
    }

    public function fbchatAction() {
        $helper = new FacebookRedirectLoginHelper('http://yardsale.druidinc.com/application/facebook/fbchat2');
        
        $params = array(
                'scope'         => 'xmpp_login, user_friends, publish_actions'
        );
        $loginUrl = $helper->getLoginUrl($params);

        

        header("location:".$loginUrl);
        die();

        /*$config = array(
            'appId' => $this->_appID ,
            'secret'=> $this->_appSecret 
        );

        $facebook = new Facebook($config);

        if(!$facebook->getUser()) {
            $params = array(
                'scope'         => 'xmpp_login, user_friends, publish_actions',
                'redirect_uri'  => 'http://yardsale.druidinc.com/application/facebook/fbchat'
            );
        
            $url = $facebook->getLoginUrl($params);
            
            header("location:".$url);
            die();
        }

        $friendsList = $facebook->api(array('method' => 'friends.get'));

        echo '<pre>';
        print_r($friendsList);*/

        return $this->_view;
    }

    public function fbChat2Action() {
      $helper = new FacebookRedirectLoginHelper('http://yardsale.druidinc.com/application/facebook/fbchat2');
      $session = null;
      try {
        $session = $helper->getSessionFromRedirect();
      } catch(FacebookRequestException $ex) {
        // When Facebook returns an error
      } catch(\Exception $ex) {
        // When validation fails or other local issues
      }
      if ($session) {
        try {
          $response = (new FacebookRequest($session, 'GET', '/me/taggable_friends'))->execute();
          $object = $response->getGraphObjectList();
          
          foreach ($object as $dataProp) {
              $pictureObj = $dataProp->getProperty('picture');
              $picData = $pictureObj->asArray();
              $picUrl = $picData->url;

              echo $picUrl . '<br>';

              $explodedPicUrl = explode('/', $picUrl);
              $picName = $explodedPicUrl[ count($explodedPicUrl) - 1];
              $explodedPicName = explode('_', $picName);
              $fbID = $explodedPicName[1];

                $url = 'https://www.facebook.com/10200854482123262';
                // create curl resource 
                $ch = curl_init(); 

                // set url 
                curl_setopt($ch, CURLOPT_URL, $url); 

                //return the transfer as a string 
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

                // $output contains the output string 
                $output = curl_exec($ch); 

                // close curl resource to free up system resources 
                curl_close($ch);   

                var_dump($output);
              echo '<br>';
          }
        } catch (FacebookRequestException $ex) {
          echo $ex->getMessage();
        } catch (\Exception $ex) {
          echo $ex->getMessage();
        }
      }

      /*try {
        $attachment = array(
        'message'=> "Dont mind",
        'tags' => 'AaLyx6ju3Nt3FNndX4Ld05t2vVvSTlpOz1n1VwDMYzyxkkd_RlG_k5CXXCnTE3eB05Uz4rUXRPjwaJ5znJW8mBChpMgtu_t5vik51iAZH4G5yg',
        'place' => 'http://yardsale.druidinc.com'
        );
        $response = (new FacebookRequest($session, 'POST', '/me/feed', array (
            'message' => 'This is a test message'
          )))->execute();
        //$post = $facebook->api('/'.$uid.'/feed', 'post', $attachment);
        $object = $response->getGraphObject();
        var_dump($object);
        } catch (FacebookApiException $e) {
        //Error
        echo $e->getMessage();
        }*/

        $this->_view->setTemplate('application/facebook/fbchat');
        return $this->_view;

    }
}
