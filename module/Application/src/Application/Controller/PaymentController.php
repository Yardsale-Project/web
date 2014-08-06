<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Console\Request as ConsoleRequest;
use Zend\Math\Rand;

use \Exception;

class PaymentController extends Controller
{

    private $_fb = null;
    private $_fbMessage = null;

    public function indexAction()
    {

        $retVal     = array();

        return $this->_view;
    }

    public function payAction() {

        $httpEndpoint   = null;
        $userId         = null;
        $userPassword   = null;
        $signature      = null;
        $appId          = null;
        $email          = null;
        $retVal         = array();

        $request = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            try {
                $itemCode = $request->getParam('verbose');
            } catch(\Exception $e) {

                $retVal = array(
                    "success" => false,
                    "errorMessage" =>  $e->getMessage()
                );
            }
        } else {
            $reVal = array(
                'success'       => false,
                'errorMessage'  => 'Invalid request'
            );
        }

        return new JsonModel($retVal);
    }

    public function getPaypalAccountAction() {

        $retVal = array();

        $request = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            try {
                $userId = $this->getUserId();

                if(empty($userId)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" =>  'User not logged in'
                    );                    
                } else {
                    $userModel = $this->model('Users');
                    $result = $userModel->getSettings($userId);


                    if(empty($result['pp_email'])) {
                        $retVal['email'] = '';
                    } else {
                        $retVal['email'] = $result['pp_email'];
                    }

                    $retVal['success'] = true;
                }
            } catch(\Exception $e) {

                $retVal = array(
                    "success" => false,
                    "errorMessage" =>  $e->getMessage()
                );
            }
        } else {
            $reVal = array(
                'success'       => false,
                'errorMessage'  => 'Invalid request'
            );
        }

        return new JsonModel($retVal);
    }

    public function getPayKeyAction() {
        $retVal = array();

        $request = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            $itmId = (!empty($postData['itmId']))?  $postData['itmId'] : '';
            $price = (!empty($postData['price']))?  $postData['price'] : '';
            $quantity = (!empty($postData['quantity']))?  $postData['quantity'] : '';

            try {
                $userId = $this->getUserId();

                if(empty($userId)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" =>  'User not logged in'
                    );                    
                } else {

                    $payKey = $this->_getPayKey($itmId, $price, $quantity);

                    $retVal['success'] = true;
                    $retVal['payKey'] = $payKey;
                }
            } catch(\Exception $e) {

                $retVal = array(
                    "success" => false,
                    "errorMessage" =>  $e->getMessage()
                );
            }
        } else {
            $reVal = array(
                'success'       => false,
                'errorMessage'  => 'Invalid request'
            );
        }

        return new JsonModel($retVal);
    }

    public function savePPSettingAction() {
        $retVal = array();

        $request = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            $ppemail            = (!empty($postData['ppemail']))? $postData['ppemail'] : '';
            $smsPaymentEnable   = (!empty($postData['smsPaymentEnable']))? $postData['smsPaymentEnable'] : 0;
            $pppassword         = (!empty($postData['pppassword']))? $postData['pppassword'] : '';

            $itmId = (!empty($postData['itmId']))?  $postData['itmId'] : '';
            $price = (!empty($postData['price']))?  $postData['price'] : '';
            $quantity = (!empty($postData['quantity']))?  $postData['quantity'] : '';

            try {
                $userId = $this->getUserId();

                if(empty($userId)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" =>  'User not logged in'
                    );                    
                } else if( empty($ppemail)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" =>  'Paypal Email cannot be empty'
                    );
                } else if( !empty($smsPaymentEnable) && empty($pppassword)) {
                    $retVal = array(
                        "success" => false,
                        "errorMessage" =>  'Paypal Password cannot be empty if SMS Payment is enabled'
                    );
                } else {
                    $userModel = $this->model('Users');
                    
                    $data = array(
                        array(
                            'user_id'   => $userId,
                            'name'      => 'pp_email',
                            'value'     => $ppemail,
                            'added'     => date('Y-m-d h:i:s')
                        ),
                        array(
                            'user_id'   => $userId,
                            'name'      => 'sms_payment_enabled',
                            'value'     => $smsPaymentEnable,
                            'added'     => date('Y-m-d h:i:s')
                        )
                    );

                    if(!empty($pppassword)) {
                        $data[] = array(
                            'user_id'   => $userId,
                            'name'      => 'pp_password',
                            'value'     => $pppassword,
                            'added'     => date('Y-m-d h:i:s')
                        );
                    }

                    foreach ($data as $value) {
                        $userModel->addSetting($value);
                    }

                    $payKey = $this->_getPayKey($itmId, $price, $quantity);

                    $retVal['success'] = true;
                    $retVal['payKey'] = $payKey;
                    $retVal['message'] = 'Paypal Setting saved';
                }
            } catch(\Exception $e) {

                $retVal = array(
                    "success" => false,
                    "errorMessage" =>  $e->getMessage()
                );
            }
        } else {
            $reVal = array(
                'success'       => false,
                'errorMessage'  => 'Invalid request'
            );
        }

        return new JsonModel($retVal);
    }

    private function _getPayKey($itmId, $price, $quantity, $type='online_order') {
        $email = '';

        $settingsModel = $this->model('Settings');
        $settings = $settingsModel->getSettings('paypal');

        $userId = $this->getUserId();

        $userModel = $this->model('Users');
        $result = $userModel->getSettings($userId);

        if(empty($result['pp_email'])) {
            $email = '';
        } else {
            $email = $result['pp_email'];
        }



        if(!$this->isProduction()) {
            $httpEndpoint   = $settings['http_endpoint_adaptivepay_sandbox'];
            $userName         = $settings['user_id_sandbox'];
            $userPassword   = $settings['user_password_sandbox'];
            $signature      = $settings['user_signature_sandbox'];
            $appId          = $settings['app_id_sandbox'];
        }


        $headers = array(
            "X-PAYPAL-SECURITY-USERID:" . $userName,
            "X-PAYPAL-SECURITY-PASSWORD:" . $userPassword,
            "X-PAYPAL-SECURITY-SIGNATURE:" . $signature,
            "X-PAYPAL-APPLICATION-ID:" . $appId,
            "X-PAYPAL-REQUEST-DATA-FORMAT:NV",
            "X-PAYPAL-RESPONSE-DATA-FORMAT:JSON",
            "X-PAYPAL-DEVICE-IPADDRESS:" . $this->getClientIP()
        );

        $request_body = array(
            'actionType'    => 'PAY',
            'cancelUrl'     => 'http://yardsale.druidinc.com',
            'currencyCode'  => 'USD',
            'returnUrl'     => 'http://example.com',
            'requestEnvelope.errorLanguage'=> 'en_US',
            'receiverList.receiver(0).amount'=> floatval(str_replace(',', '', $price)) * $quantity,
            'receiverList.receiver(0).email'=> 'egeeboygutierrez91-facilitator@gmail.com',
            // 'senderEmail'   => $email
        );

        if($type == 'invite_commission') {
            $request_body['senderEmail'] = $email;
        }

        $request = array();

        foreach ($request_body as $key => $value) {
            $request[] = $key . '=' . $value;
        }

        $request = implode('&', $request);

        $http = $this->HTTP()->init($httpEndpoint);        
        $http->setHeaders($headers);
        $http->executePost($request, FALSE);
        $response = $http->getResponse();

        $response = json_decode($response['body'], true);

        $payKey = (!empty($response['payKey']))? $response['payKey'] : 0;
        
        return $payKey;
    }

    private function _getPaypalAccount($userId) {}
}
