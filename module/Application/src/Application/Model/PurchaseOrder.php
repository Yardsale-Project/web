<?php

namespace Application\Model;

class PurchaseOrder extends Table
{

	private $_name = 'purchaseorder';

    public function getPurchaseOrders()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getPurchaseOrderByDocId($docId)
    {
    	$select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
                        
        return $this->fetchRowToArray($select);
    }
}