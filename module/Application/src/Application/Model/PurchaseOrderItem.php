<?php

namespace Application\Model;

class PurchaseOrderItem extends Table
{

	private $_name = 'purchaseorder_item';

    public function getPurchaseOrderItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getPurchaseOrderItem($docId)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
        return $this->fetchAllToArray($select);
    }
}