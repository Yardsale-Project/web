<?php

namespace Application\Model;

class InventoryTransfer extends Table
{

	private $_name = 'inventorytransfer';

    public function getInventoryTransfers()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getInventoryTransferByDocId($docId)
    {
    	$select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
                        
        return $this->fetchRowToArray($select);
    }
}