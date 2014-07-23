<?php
namespace Application\Controller;

use Application\Controller\Controller;


use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

require_once 'autoload.php';

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

    public function fbchatAction() {

        $config = array(
            'appId' => $this->_appID ,
            'secret'=> $this->_appSecret 
        );

        $facebook = new Facebook($config);
        $helper = new FacebookRedirectLoginHelper('http://yardsale.druidinc.com/application/facebook/fbchat');
        $fbsession = $helper->getSessionFromRedirect();

        if(!$facebook->getUser()) {
            $params = array(
                'scope'         => 'xmpp_login, user_friends',
                'redirect_uri'  => 'http://yardsale.druidinc.com/application/facebook/fbchat'
            );
        
            $url = $facebook->getLoginUrl($params);
            
            header("location:".$url);
            die();
        }

        try {
          $response = (new FacebookRequest($session, 'GET', '/me'))->execute();
          $object = $response->getGraphObject();
          echo $object->getProperty('name');
        } catch (FacebookRequestException $ex) {
          echo $ex->getMessage();
        } catch (\Exception $ex) {
          echo $ex->getMessage();
        }


        //$friendsList = $facebook->api('/me/friends');

        /*echo '<pre>';
        print_r($friendsList);*/

        return $this->_view;
    }
}
