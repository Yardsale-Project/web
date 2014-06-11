<?php

namespace Application\Model;

class GoodsReturnItem extends Table
{

	private $_name = 'goodsreturn_item';

    public function getGoodsReturnItems()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getGoodsReturnItem($docId)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('docId' => $docId));
        return $this->fetchAllToArray($select);
    }
}