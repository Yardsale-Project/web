<?php

namespace Application\Model;

class Documents extends Table
{

	private $_name = 'documents';

    public function getLastNumberByCode($docCode)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->columns(array('newId' => 'CAST(lastNo+1 AS char(11))'))
                        ->where(array('documentCode' => $docCode));

        return $this->fetchRowToArray($select);
    }
}