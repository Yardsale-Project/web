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

    public function getInvites($setting) {

        $whereClause = array(
            'sms_access_token.setting'  => $setting,
            'sms_access_token.active'   => 1,
            'sms_invite.invite_sent'    => 0
        );

        $smsInviteCols = array(
            'sms_id',
            'sms_username'
        );

        $smsAccessTokeCols = array('token');

        $select = $this->select()
                        ->from($this->_name)
                        ->columns($smsInviteCols)
                        ->join('sms_access_token', 'sms_access_token.user_id = sms_invite.user_id', $smsAccessTokeCols)
                        ->where($whereClause)
                        ->order( array('sms_username') );

        return $this->fetchAllToArray($select);
    }

    public function getSnsRequest($requestId) {
        $whereClause = array(
            'sms_request_id'    => $requestId,
            'invite_sent'       => 1,
            'invite_accepted'   => 0
        );

        $select = $this->select()
                        ->from($this->_name)
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
    }

    public function acceptInvite($data, $id) {

        $whereClause = array(
            'id'        => $id
        );

        $this->update($this->_name, $data, $whereClause);
    }
}