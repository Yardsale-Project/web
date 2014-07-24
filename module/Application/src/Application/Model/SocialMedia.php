<?php

namespace Application\Model;

class SocialMedia extends Table
{

	private $_name = 'sms_invite';

	public function addInvite($data) {

		$affected_rows = $this->insert($this->_name, $data);

        return $affected_rows;
	}
}