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

	public function isStateCodeExist($code) {
		$select = $this->select()
                        ->from( 'states')
                        ->where(array('code' => $code))
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
	}

	public function isStateNameExist($name) {
		$select = $this->select()
                        ->from( 'states')
                        ->where(array('name' => $name))
                        ->order(array('code'));

        return $this->fetchAllToArray($select);
	}

	public function updateState($data, $id) {
		return $this->update('states', $data, array('id' => $id));
	}

	public function insertState($data) {
		return $this->insert('states', $data);
	}
}