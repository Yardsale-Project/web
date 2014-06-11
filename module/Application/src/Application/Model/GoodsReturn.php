<?php

namespace Application\Model;

class GoodsReturn extends Table
{

	private $_name = 'goodsreturn';

    public function getGoodsReturns()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getGoodsReturnByDocId($docId)
    {
    	$select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
                        
        return $this->fetchRowToArray($select);
    }
}