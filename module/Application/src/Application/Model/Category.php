<?php

namespace Application\Model;

class Category extends Table
{

	private $_name = 'category_tree';

	public function getCategories() {

		$whereClause = array(
            'parent.category_id' 	=> 0
        );

        $category_fields = array(
        	'id',
        	'name'
        );

        $node_fields = array(
        	'lft',
			'rgt'
        );

        $select = $this->select()
                        ->from( array('node' => $this->_name) )
                        ->columns($node_fields)
                        ->join( array( 'parent' => $this->_name), 'node.lft BETWEEN parent.lft AND parent.rgt', array())
                        ->join('category', 'category.id = node.category_id', $category_fields, 'left')
                        ->where($whereClause)
                        ->order(array('node.lft'));

        return $this->fetchAllToArray($select);
	}

	public function verifyToken($referer, $token) {
		$whereClause = array(
            'referer'	=> $referer,
			'token'		=> $token
        );

        $select = $this->select()
                        ->from($this->_name)
                        ->where($whereClause);

        return $this->fetchRowToArray($select);
	}

	public function getValidationCode($referer) {
		$whereClause = array(
            'csrf_session.referer'	=> $referer
        );

        $select = $this->select()
                        ->from('user_login')
                        ->columns( array( 'id', 'validationCode') )
                        ->join('csrf_session', 'csrf_session.token = user_login.validationCode', array())
                        ->where($whereClause)
                        ->order(array( 'user_login.id DESC'))
                        ->limit(1);

        return $this->fetchRowToArray($select);
	}

	public function destroyValidationCodeSession($validationCode) {
		$whereClause = array(
			'validationCode' 	=> $validationCode
		);

        $affected_rows = $this->delete('user_login', $whereClause);

        return $affected_rows;
	}
}