<?php

namespace Application\Model;

use Zend\Db\Sql\Expression;

class Settings extends Table
{

	private $_name = 'settings';

	public function getSettings($settingName) {

        $settings = array();

        $whereClause = array(
            'setting'   => $settingName,
            'active'    => 1
        );
        $select = $this->select()
                        ->from($this->_name)
                        ->where($whereClause);

        $result = $this->fetchAllToArray($select);

        foreach ($result as $value) {
            $settings[$value['name']] = $value['value'];
        }

        return $settings;
	}
}