<?php

namespace Application\Model;

use Zend\Db\Sql\Expression;

class SMSModel extends Table{

	private $_table="test";

	public function addData($data){
		$affected_rows = $this->insert($_table, $data);

        return $affected_rows;
	}


	public function getPayerId($email){

		$select = $this->select()
						->columns(array('id'))
                        ->from('user_registration')
                        ->where(array('email'=>$email));

        return $this->fetchRowToArray($select);  
           
	}
}

?> 