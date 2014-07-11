<?php

namespace Application\Model;

class Users extends Table
{

	private $_name = 'user';

    public function isEmailExist($email) {
        $whereClause = array(
            'email' => $email
        );

        $select = $this->select()
                        ->from('user_registration')
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
    }

    public function getInfoByValidationCode($hash){
        $whereClause = array(
            'validationCode' => $hash
        );

        $select = $this->select()
                        ->from('user_registration')
                        ->columns(array('id'))
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
    }

    public function addUserRegistration($data)
    {
        $affected_rows = $this->insert('user_registration', $data);

        return $affected_rows;
    }

    public function activateAccount($id) {
        $setClause      = array( 'validated' => 1, 'active' => 1 );
        $whereClause    = array( 'id' => $id);

        $affected_rows  = $this->update('user_registration', $setClause, $whereClause);

        return $affected_rows;
    }

    public function getUserAccount($email)
    {   
        $whereClause = array(
        	'email' => $email
        );

        $select = $this->select()
                        ->from('user_registration')
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
    }

    public function storeValidation($user_id, $loginValidationCode) {
        $data = array(
            'user_id'   => $user_id,
            'validationCode'     => $loginValidationCode
        );

        $affected_rows = $this->insert('user_login', $data);

        return $affected_rows;
    }

    public function getAccoutInfoBySessionCode($validationCode) {
        $whereClause = array(
            'user_login.validationCode'  => $validationCode
        );

        $select = $this->select()
                        ->from('user_registration')
                        ->columns( array( 'id', 'email') )
                        ->join('user_login', 'user_login.user_id = user_registration.id', array())
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
    }




    public function logUserLastLogin($user_id)
    {
    	$setClause 		= array( 'lastLogIn' => date('Y-m-d h:i:s') );
    	$whereClause 	= array( 'user_id' => $user_id);

    	$affected_rows 	= $this->update($this->_name, $setClause, $whereClause);

    	return $affected_rows;
    }

    public function getUsers()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    

    public function updateUser($data, $userId)
    {
        $whereClause    = array( 'user_id' => $userId);

        $affected_rows  = $this->update($this->_name, $data, $whereClause);

        return $affected_rows;
    }

    public function deleteUser($userId)
    {
        $whereClause = array('user_id' => $userId);

        $affected_rows = $this->delete($this->_name, $whereClause);

        return $affected_rows;
    }
}