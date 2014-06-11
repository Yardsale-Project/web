<?php

namespace Application\Model;

class SalesReturn extends Table
{

	private $_name = 'salesreturn';

    public function getSalesReturn()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getSalesReturnByDocId($docId)
    {
    	$select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
                        
        return $this->fetchRowToArray($select);
    }
}