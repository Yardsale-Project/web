<?php

namespace Application\Model;

use Zend\Db\Adapter\Adapter;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Insert;
use Zend\Db\Sql\Delete;
use Zend\Db\Expr;

class Table
{
    protected $_dbAdapter;
    protected $_sql;

    public function __construct(Adapter $dbAdapter)
    {
        $this->_dbAdapter = $dbAdapter;
        $this->_sql = new Sql($dbAdapter);
    }

    public function fetchAllToArray($select)
    {
        $results = array();

        if($select instanceof Select)
        {
            $statement = $this->_sql->prepareStatementForSqlObject($select);
        }
        else if($select instanceof \Zend\Db\Adapter\Driver\Pdo\Statement)
        {
            $statement = $select;
        }
        
        foreach ($statement->execute() as $row) {
            $results[] = $row;
        }
        return $results;
    }

    public function fetchRowToArray($select)
    {
        if($select instanceof Select)
        {
            $statement = $this->_sql->prepareStatementForSqlObject($select);
        }
        else if($select instanceof \Zend\Db\Adapter\Driver\Pdo\Statement)
        {
            $statement = $select;
        }
        //var_dump($statement);
        $result = $statement->execute()->current();
        return $result;
    }

    public function select($tableName = null)
    {
        return new Select($tableName);
    }

    public function update($tableName = null, $setClause, $whereClause)
    {
        $update = new Update($tableName);
        
        $update->set($setClause)
                ->where($whereClause);
        $statement = $this->_sql->prepareStatementForSqlObject($update);

        $string = $this->_sql->getSqlStringForSqlObject($update);

        //echo $string;
        $result = $statement->execute();

        return $result->count();
    }

    public function insert($tableName = null, $data)
    {
        $insert = new Insert($tableName);
        $insert->columns(array_keys($data))
                ->values($data);

        $statement = $this->_sql->prepareStatementForSqlObject($insert);
        $string = $this->_sql->getSqlStringForSqlObject($insert);

        //echo $string;
        $result = $statement->execute();

        return $result->count();
    }

    public function delete($tableName = null, $whereClause)
    {
        $delete = new Delete($tableName);
        $delete->where($whereClause);

        $statement = $this->_sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();

        return $result->count();
    }
}