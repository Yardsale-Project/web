<?php

namespace Application\Model;

class Terminal extends Table
{
	private $_name = 'terminal';

	public function getTerminalId()
	{
		$select = $this->select()
						->columns(array('terminalId'))
						->from($this->_name)
						->limit(1);

		return $this->fetchRowToArray($select);
	}
}