<?php

namespace Application\Model;

class BusinessPartner extends Table
{

	private $_name = 'businesspartner';

    public function getBusinessPartners()
    {
        $select = $this->select()
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getBusinessPartnersByType($type)
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('BPType' => $type, 'deactivated' => 'N'));
                        
        return $this->fetchAllToArray($select);
    }

    public function isCodeExist($code)
    {
    	$select = $this->select()
    					->from($this->_name)
    					->where(array('code' => $code));

		$result = $this->fetchRowToArray($select);

		return !empty($result);
    }

    public function addBusinessPartner($data)
    {
    	$affected_rows = $this->insert($this->_name, $data);
    	return $affected_rows;
    }

    public function updateBusinessPartner($data, $code)
    {
    	$whereClause    = array( 'code' => $code);
    	$affected_rows = $this->update($this->_name, $data, $whereClause);
    	return $affected_rows;
    }

    public function deleteBusinessPartner($code)
    {
    	$whereClause = array('code' => $code);

        $affected_rows = $this->delete($this->_name, $whereClause);

        return $affected_rows;
    }
}