<?php

namespace Application\Model;

class Commission extends Table
{

	private $_name = 'user_commission';

	public function addCommission($data) {

		$affected_rows = $this->insert($this->_name, $data);

        return $affected_rows;
	}
}