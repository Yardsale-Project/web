<?php

namespace Application\Model;

class SalesInvoice extends Table
{

	private $_name = 'salesinvoice';

    public function getSalesInvoices()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getSalesInvoiceByDocId($docId)
    {
    	$select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
                        
        return $this->fetchRowToArray($select);
    }
}