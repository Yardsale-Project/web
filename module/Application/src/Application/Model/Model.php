<?php

namespace Application\Model;

use Zend\Db\Adapter\Adapter;

class Model
{

	private $_dbAdapter;

    public function __construct(Adapter $dbAdapter)
    {
        $this->_dbAdapter = $dbAdapter;
    }

    public function get($model)
    {   
        $className = 'Application\Model\\' . $model;
        return new $className($this->_dbAdapter);
    }
}