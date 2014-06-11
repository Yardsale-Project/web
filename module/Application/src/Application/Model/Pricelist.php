<?php

namespace Application\Model;

class Pricelist extends Table
{

	private $_name = 'pricelist';

    public function getPriceListByItem($itemCode)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('itemCode' => $itemCode));
        return $this->fetchAllToArray($select);
    }

    public function addPrice($data)
    {
    	$affected_rows = $this->insert($this->_name, $data);
    	return $affected_rows;
    }
}