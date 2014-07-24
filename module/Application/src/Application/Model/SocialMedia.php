<?php

namespace Application\Model;

class SocialMedia extends Table
{

	private $_name = 'sms_invite';

	public function addInvite($data) {

		$affected_rows = $this->insert($this->_name, $data);

        return $affected_rows;
	}

	public function saveAccessToken($user_id, $setting, $token) {
		$affected_rows= 0;

		$whereClause = array(
            'user_id'	=> $user_id,
			'setting'	=> $setting,
			'token'		=> $token,
			'active'		=> 1
        );

        $select = $this->select()
                        ->from('sms_access_token')
                        ->where($whereClause);

        $tokenResult = $this->fetchRowToArray($select);

        if(!empty($tokenResult)) {
        	$data = array(
        		'token'		=> $token
        	);

        	$affected_rows  = $this->update('sms_access_token', $data, $whereClause);
        } else {
        	$affected_rows = $this->insert('sms_access_token', $whereClause);
        }

        return $affected_rows;
	}
}