<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Console\Request as ConsoleRequest;
use Zend\Math\Rand;

use \Exception;

class SMSController extends Controller{

public $sms_message; 

public function indexAction(){
	
	$words=explode(' ', getSMSMessage());

	$paymentType=$words[0];
	$email=$words[1];
	$itemNum=$words[2];

	$isValidPayment=isValidPaymentType($paymentType);
	$isValidEmail=isValidEmail($email);
	$isItemNumValid=isItemNumValid($itemNum);

	$value=($isValidEmail && $isValidEmail && $isItemNumValid) ? true: false;
	
	//$data= array('return_val' => , $value);
	$smsModel=$this->model('SMSModel');
	$payer_id=$smsModel->getPayerId($email);

	if($value){
		$data=array('item_id'=>$itemNum,'payer_id'=>,$payer_id,'paid'=>'0',date('Y-m-d h:i:s'));
		$smsModel->addData($data);
	}

	//return new JsonModel($data);
}


public function setSMSMessage($val){
 $this->$sms_message=$val;
}

private function getSMSMessage(){
	return $sms_message;
}
private function isItemNumValid($x){
	$isValid=true;
	$numItems=explode(',', $x);	
	$regExRules='/^(ITM)\-([0-9])+$/';

   foreach ($numItems as $value) {
   				
	  if(preg_match($regExRules, $value) == false) {  	
	  	$isValid=false; break;

	  }	
   }
 
   return $isValid;
}

private function isValidPaymentType($pp){
	return (strlen($pp)==2)? TRUE:FALSE;
}

private function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) && preg_match('/@.+\./', $email);
}

}