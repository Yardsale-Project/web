<?php

namespace Application\Model;

class Barcode extends Table
{

	private $_name = 'barcode';

    public function getBarcodeByItem($itemCode)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('itemCode' => $itemCode));
        return $this->fetchAllToArray($select);
    }

    public function addBarcode($data)
    {
    	$affected_rows = $this->insert($this->_name, $data);
    	return $affected_rows;
    }
}