<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Console\Request as ConsoleRequest;
use Zend\Math\Rand;

use Zend\Db\Sql\Expression;

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
        $payKey = 0;

        $request = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            $id                 = (!empty($postData['id']))? $postData['id'] : 0;
            $ppemail            = (!empty($postData['pp_email']))? $postData['pp_email'] : '';
            $smsPaymentEnable   = (!empty($postData['sms_payment_enabled']))? $postData['sms_payment_enabled'] : 0;
            $pppassword         = (!empty($postData['pp_password']))? $postData['pp_password'] : '';
            $saveOnly           = (!empty($postData['saveOnly']))? $postData['saveOnly'] : 0;

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

                    $settings = $userModel->getSettings($userId);
                    
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
                        
                        if(empty($id)) {
                            $userModel->addSetting($value);
                        } else {
                            if(array_key_exists($value['name'], $settings)) {
                                unset($value['added']);
                                $value['updated'] = date('Y-m-d h:i:s');
                                $userModel->updateSetting($value, $id, $value['name']);
                            } else {
                                $userModel->addSetting($value);
                            }
                            
                        }
                    }

                    if(!$saveOnly) {
                        $payKey = $this->_getPayKey($itmId, $price, $quantity);
                    }

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

        $settingsModel  = $this->model('Settings');
        $settings       = $settingsModel->getSettings('paypal');

        $userId         = $this->getUserId();

        $userModel      = $this->model('Users');
        $result         = $userModel->getSettings($userId);

        if(empty($result['pp_email'])) {
            $email = '';
        } else {
            $email = $result['pp_email'];
        }

        $orderModel     = $this->model('Order');

        $data = array(
            'user_id'   => $userId,
            'added'     => date('Y-m-d h:i:s'),
            'status'    => 1,
            'paid'      => 0,
            'active'    => 1
        );

        $orderId = $orderModel->addOrder($data);

        $data = array(
            'order_id'  => $orderId,
            'item_id'   => $itmId,
            'quantity'  => $quantity,
            'price'     => $price
        );

        $orderModel->addOrderItem($data);

        $data = array(
            'order_id'      => $orderId,
            'payment_type'  => 'pp'
        );
        
        $orderModel->addOrderPayment($data);


        $productModel = $this->model('Product');
        $itemDetails = $productModel->getProductById($itmId);

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
            'cancelUrl'     => 'http://yardsale.druidinc.com/#pp/c/' . $orderId,
            'currencyCode'  => 'USD',
            'returnUrl'     => 'http://yardsale.druidinc.com/#pp/s/' . $orderId,
            'requestEnvelope.errorLanguage'=> 'en_US',
            'receiverList.receiver(0).amount'=> floatval(str_replace(',', '', $itemDetails['currentPrice'])) * $quantity,
            'receiverList.receiver(0).email'=> $itemDetails['email'],
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

        $http->close();
        
        $this->_setPaymentOptions(  $headers, $payKey, $itemDetails, $quantity, $type );

        return $payKey;
    }

    private function _setPaymentOptions( $headers, $payKey, $itemDetails, $quantity, $type='online_order') {
        $url = 'https://svcs.sandbox.paypal.com/AdaptivePayments/SetPaymentOptions';


        $request_body = array(
            'requestEnvelope.errorLanguage'                 => 'en_US',

            'initiatingEntitity.institutionCustomer.displayName'    => 'Yardsale.com',
            'initiatingEntitity.institutionCustomer.email'          => 'yardsale@yardsale.com',

            'receiverOptions[0].receiver.email'             => $itemDetails['email'],
            'receiverOptions[0].invoiceData.item[0].name'   => $itemDetails['productName'],
            'receiverOptions[0].invoiceData.item[0].price'  => floatval(str_replace(',', '', $itemDetails['currentPrice'])) * $quantity,
            'receiverOptions[0].invoiceData.item[0].itemCount' => $quantity,
            'receiverOptions[0].invoiceData.item[0].itemPrice' => floatval(str_replace(',', '', $itemDetails['currentPrice'])),
            'payKey'                                        => $payKey
        );

        $request = array();

        foreach ($request_body as $key => $value) {
            $request[] = $key . '=' . $value;
        }

        $request = implode('&', $request);

        $http = $this->HTTP()->init($url);        
        $http->setHeaders($headers);
        $http->executePost($request, FALSE);
        $response = $http->getResponse();

        $response = json_decode($response['body'], true);

        $http->close();
    }

    private function _getPaypalAccount($userId) {}

    public function updateOrderAction() {
        $retVal = array();
        $error = array();

        $request = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            $order = (!empty($postData['order']))? $postData['order'] : 0;
            $status = (!empty($postData['status']))? $postData['status'] : 0;

            try {
                $userId = $this->getUserId();

                if( empty($order) ) {
                    $error[] = 'Order empty';
                }

                if( empty($status) ) {
                    $error[] = 'Status empty';
                }

                if(count($error)) {

                    $reVal['success'] = false;
                    $reVal['errorMessage'] = implode('<br>', $error);
                } else {

                    $orderModel = $this->model('Order');

                    $data = array(
                        'status'    => $status,
                        'updated'   => date('Y-m-d h::s')
                    );

                    $where = array(
                        'id' => $order
                    );
                    
                    $reVal['success'] = true;

                    if($status == 3) {
                        $reVal['message'] = 'Order cancelled successfully';
                    } else if($status == 2) {
                        $reVal['message'] = 'Order successful';
                        $data['paid'] = 1;
                    }

                    $result = $orderModel->updateOrder($data, $where);

                    if( empty($result) ) {
                        $retVal['success'] = false;
                        $retVal['errorMessage'] = 'Error updating order';
                    } else {
                        if($status == 2) {
                            $where = array(
                                'order.id' => $order,
                                'order.active' => 1
                            );
                            $items = $orderModel->getOrderItems($where);

                            $productModel = $this->model('Product');

                            foreach ($items as $item) {
                                $data = array(
                                    'stock' => new Expression('stock - ' . $item['quantity'])
                                );

                                $where = array(
                                    'id'    => $item['item_id']
                                );

                                $productModel->updateStock($data, $where);
                            }

                            $retVal['success'] = true;
                            $reVal['message'] = 'Order successful';
                        } else {
                            $retVal['success'] = true;
                            $reVal['message'] = 'Order cancelled successfully';
                        }

                    }
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
}
