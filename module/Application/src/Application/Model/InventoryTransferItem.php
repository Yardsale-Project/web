<?php

namespace Application\Model;

class InventoryTransferItem extends Table
{

	private $_name = 'inventorytransfer_item';

    public function getInventoryTransferItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getInventoryTransferItem($docId)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
        return $this->fetchAllToArray($select);
    }
}