<?php

namespace Application\Model;

class ItemMasterData extends Table
{

	private $_name = 'itemmasterdata';

    public function getItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function addItem($data)
    {
    	$affected_rows = $this->insert($this->_name, $data);
    	return $affected_rows;
    }
}