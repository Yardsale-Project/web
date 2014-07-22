<?php
namespace Application\Controller;

use Application\Controller\Controller;


use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

require_once 'autoload.php';

use Facebook\FacebookSession;
use Facebook\FacebookRedirectLoginHelper;

class FacebookController extends Controller
{
    private $_appID = '266633476861976';
    private $_appSecret = '7d63ce67585ea3799135d0ac6bb85d4a';
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
        'object' => $this->_redirectUri,
        'message' => 'this is a message'
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
}
