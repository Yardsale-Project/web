<?php

namespace Application\Model;

class GRPO extends Table
{

	private $_name = 'grpo';

    public function getGRPOs()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getGRPOByDocId($docId)
    {
    	$select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
                        
        return $this->fetchRowToArray($select);
    }
}