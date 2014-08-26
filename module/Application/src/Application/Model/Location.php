<?php

namespace Application\Model;

use Zend\Db\Sql\Expression;

class Location extends Table
{

	private $_name = 'country';

	public function getCountries($whereClause) {

		$select = $this->select()
                        ->from( $this->_name)
                        ->order(array('name', 'code'));

        if(!empty($whereClause)) {
        	$select->where($whereClause);
        }

        return $this->fetchAllToArray($select);
	}

	public function getCountry($id) {

		$select = $this->select()
                        ->from( $this->_name)
                        ->where(array('id' => $id))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
	}

	public function getLastCountryId() {

		$select = $this->select()
                        ->from( $this->_name)
                        ->columns( array(
                        	'id' => new Expression('IFNULL(MAX(id), 0)')
                        ))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
	}

	public function isIdExist($id) {
		$select = $this->select()
                        ->from( $this->_name)
                        ->where(array('id' => $id))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
	}

	public function isCodeExist($code) {
		$select = $this->select()
                        ->from( $this->_name)
                        ->where(array('code' => $code))
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
	}

	public function isNameExist($name) {
		$select = $this->select()
                        ->from( $this->_name)
                        ->where(array('name' => $name))
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
	}

	public function updateCountry($data, $id) {
		return $this->update($this->_name, $data, array('id' => $id));
	}

	public function insertCountry($data) {
		return $this->insert($this->_name, $data);
	}

	public function deleteCountry($id) {
		$whereClause = array(
			'id' 	=> $id
		);

        $affected_rows = $this->delete($this->_name, $whereClause);

        return $affected_rows;
	}

	public function getStates($whereClause) {

		$select = $this->select()
                        ->from( 'states')
                        ->order(array('name', 'code'));

        if(!empty($whereClause)) {
        	$select->where($whereClause);
        }

        return $this->fetchAllToArray($select);
	}

	public function getLastStateId() {

		$select = $this->select()
                        ->from( 'states')
                        ->columns( array(
                        	'id' => new Expression('IFNULL(MAX(id), 0)')
                        ))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
	}

	public function isStateIdExist($id) {
		$select = $this->select()
                        ->from( 'states')
                        ->where(array('id' => $id))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
	}

	public function isStateCodeExist($code, $countryId) {
		$select = $this->select()
                        ->from( 'states')
                        ->where(
                            array(
                                'code' => $code,
                                'country_id' => $countryId
                            )
                        )
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
	}

	public function isStateNameExist($name, $countryId) {
		$select = $this->select()
                        ->from( 'states')
                        ->where(
                            array(
                                'name' => $name,
                                'country_id' => $countryId
                            )
                        )
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
	}

	public function updateState($data, $id) {
		return $this->update('states', $data, array('id' => $id));
	}

	public function insertState($data) {
		return $this->insert('states', $data);
	}

    public function deleteState($id) {
        $whereClause = array(
            'id'    => $id
        );

        $affected_rows = $this->delete('states', $whereClause);

        return $affected_rows;
    }

    public function getCities($whereClause) {

        $select = $this->select()
                        ->from( 'city')
                        ->order(array('name', 'code'));

        if(!empty($whereClause)) {
            $select->where($whereClause);
        }

        return $this->fetchAllToArray($select);
    }

    public function getLastCityId() {

        $select = $this->select()
                        ->from( 'city')
                        ->columns( array(
                            'id' => new Expression('IFNULL(MAX(id), 0)')
                        ))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
    }

    public function isCityIdExist($id) {
        $select = $this->select()
                        ->from( 'city')
                        ->where(array('id' => $id))
                        ->order(array('code'));

        return $this->fetchRowToArray($select);
    }

    public function isCityCodeExist($code, $stateId) {
        $select = $this->select()
                        ->from( 'city')
                        ->where(
                            array(
                                'code' => $code,
                                'state_id' => $stateId
                            )
                        )
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
    }

    public function isCityNameExist($name, $stateId) {
        $select = $this->select()
                        ->from( 'city')
                        ->where(
                            array(
                                'name' => $name,
                                'state_id' => $stateId
                            )
                        )
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
    }

    public function updateCity($data, $id) {
        return $this->update('city', $data, array('id' => $id));
    }

    public function insertCity($data) {
        return $this->insert('city', $data);
    }

    public function deleteCity($id) {
        $whereClause = array(
            'id'    => $id
        );

        $affected_rows = $this->delete('city', $whereClause);

        return $affected_rows;
    }

    public function getLocation($where) {

        $statesColumns = array(
            'state_id'  => 'id',
            'state_name'=> 'name'
        );

        $cityColumns = array(
            'city_id'  => 'id',
            'city_name'=> 'name'
        );

        $select = $this->select()
                        ->from( 'country')
                        ->columns(array())
                        ->join('states', 'states.country_id = country.id', $statesColumns, 'LEFT')
                        ->join('city', 'city.state_id = states.id', $cityColumns, 'LEFT')
                        ->where($where)
                        ->order(array('country_id', 'state_id', 'city_id'));

        return $this->fetchAllToArray($select);
    }
}