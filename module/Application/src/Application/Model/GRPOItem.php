<?php

namespace Application\Model;

class GRPOItem extends Table
{

	private $_name = 'grpo_item';

    public function getGRPOItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getGRPOItem($docId)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
        return $this->fetchAllToArray($select);
    }
}