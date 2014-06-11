<?php

namespace Application\Model;

class Warehouse extends Table
{

	private $_name = 'warehouse';

    public function getWarehouseList()
    {
        $select = $this->select()
                        ->quantifier('DISTINCT')
                        ->join('grpo_item', 'grpo_item.warehouse = warehouse.code', array('warehouse'), 'left')
                        ->from($this->_name);
        return $this->fetchAllToArray($select);
    }

    public function getActiveWarehouseList()
    {
        $select = $this->select()
                        ->from($this->_name)
                        ->where(array('deactivated' => 'N'));
        return $this->fetchAllToArray($select);
    }

    public function addStore($data)
    {
        $affected_rows = $this->insert($this->_name, $data);

        return $affected_rows;
    }

    public function updateStore($data, $id)
    {
        $whereClause    = array( 'id' => $id);

        $affected_rows  = $this->update($this->_name, $data, $whereClause);

        return $affected_rows;
    }

    public function deleteStore($id)
    {
        $whereClause = array('id' => $id);

        $affected_rows = $this->delete($this->_name, $whereClause);

        return $affected_rows;
    }

    public function getTerminalStores()
    {
        $statement = $this->_dbAdapter->createStatement('SELECT terminalId
            FROM terminal

            UNION

            SELECT code
            FROM warehouse'
        );

        $result = $this->fetchAllToArray($statement);

        return $result;
    }
}