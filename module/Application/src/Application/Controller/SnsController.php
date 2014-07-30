<?php
namespace Application\Controller;

use Application\Controller\Controller;


use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;
use Zend\Http\Client;

use \Exception;

class SnsController extends Controller
{
    private $_appID = '266620273529963';
    private $_appSecret = '4e5a568421a2fc1cd9d1c914b4234871';
    private $_fbSession = null;
    private $_redirectUri = 'http://yardsale.druidinc.com';


    public function indexAction()
    {
        
    }

    public function fbInviteAction() {
        $retVal = array();
        $fbUserIds = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            try
            {
                $userId = $this->getUserId();
                $requestId = (!empty($postData['requestId']))? $postData['requestId'] : 0;

                if(empty($userId)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" =>  'Invalid request. Unknown user.'
                    );
                } else {
                    $snsModel = $this->model('SocialMedia');

                    $data = array(
                        'user_id' => $userId,
                        'sms_request_id' => $requestId,
                        'invite_sent' => 1,
                        'invite_accepted' => 0
                    );

                    $result = $snsModel->addInvite($data);

                    if(!empty($result)) {
                        $retVal = array(
                            'success'   => true,
                            'message'   => 'Invite sent'
                        );
                    } else {
                        $retVal = array(
                            "success"       => false,
                            "errorMessage"  => 'Error saving request id.'
                        );
                    }
                }

            } catch(\Exception $e) {

                $retVal = array(
                    "success" => false,
                    "errorMessage" =>  $e->getMessage()
                );
            }

        }
        else
        {
            $retVal = array(
                "success" => false,
                "errorMessage" => "Invalid request"
            );
        }

        return new JsonModel($retVal);
    }
}
