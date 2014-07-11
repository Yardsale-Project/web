<?php

namespace Application\Model;

class Session extends Table
{

	private $_name = 'csrf_session';

	public function storeToken($referer, $token) {

		$data = array(
			'referer'	=> $referer,
			'token'		=> $token
		);

		$affected_rows = $this->insert($this->_name, $data);

        return $affected_rows;
	}

	public function verifyToken($referer, $token) {
		$whereClause = array(
            'referer'	=> $referer,
			'token'		=> $token
        );

        $select = $this->select()
                        ->from($this->_name)
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
	}

	public function getValidationCode($referer) {
		$whereClause = array(
            'csrf_session.referer'	=> $referer
        );

        $select = $this->select()
                        ->from('user_login')
                        ->columns( array( 'id', 'validationCode') )
                        ->join('csrf_session', 'csrf_session.token = user_login.validationCode', array())
                        ->where($whereClause)
                        ->order(array( 'user_login.id DESC'))
                        ->limit(1);

        return $this->fetchRowToArray($select);
	}

	public function destroyValidationCodeSession($validationCode) {
		$whereClause = array(
			'validationCode' 	=> $validationCode
		);

        $affected_rows = $this->delete('user_login', $whereClause);

        return $affected_rows;
	}
}