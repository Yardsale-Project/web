<?php

namespace Application\Model;

class SalesReturnItem extends Table
{

    private $_name = 'salesreturn_item';

    public function getSalesReturnItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getSalesReturnItem($docId)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
        return $this->fetchAllToArray($select);
    }
}