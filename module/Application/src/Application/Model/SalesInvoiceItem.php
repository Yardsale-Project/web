<?php

namespace Application\Model;

class SalesInvoiceItem extends Table
{

	private $_name = 'salesinvoice_item';

    public function getSalesInvoiceItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getSalesInvoiceItem($docId)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
        return $this->fetchAllToArray($select);
    }
}