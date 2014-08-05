<?php

namespace Application\Model;

use Zend\Db\Sql\Expression;

class Product extends Table
{

	private $_name = 'product';

	public function generateItemCode() {

        $select = $this->select()
                        ->from('product_code');

        $code = $this->fetchRowToArray($select);

        return $code['prefix'] . '-' . str_replace('-', '', $code['mid']) . ($code['count']++);
	}

	public function updateItemCodeCount() {
		$setClause 		= array( 'count' => new Expression('count + 1'));
		$whereClause 	= array( 'prefix' => 'ITM');

		$affected_rows  = $this->update('product_code', $setClause, $whereClause);

		return $affected_rows;
	}

	public function addProduct($data) {
        $affected_rows = $this->insert($this->_name, $data);

        $lastInsertId = $this->_dbAdapter->getDriver()->getLastGeneratedValue();

        return $lastInsertId;
    }

    public function addProductCat($data) {
        $affected_rows = $this->insert('product_category', $data);

        return $affected_rows;
    }

    public function addProductPrice($data) {
        $affected_rows = $this->insert('product_price', $data);

        return $affected_rows;
    }

    public function addProductUser($data) {
        $affected_rows = $this->insert('product_user', $data);

        return $affected_rows;
    }

    public function getProducts($where) {

    	$product_fields = array(
    		'id',
			'code',
			'productName'	=> 'name',
			'image' 		=>'images',
            'description'
    	);

    	$product_price_fields = array(
    		'sell_price',
			'currentPrice' => new Expression('FORMAT(IFNULL(updated_sell_price, sell_price), 2)') 
    	);

    	$select = $this->select()
    					->from($this->_name)
    					->columns($product_fields)
    					->join('product_sell', 'product_sell.product_id = product.id', array(), 'LEFT')
    					->join('product_price', 'product_price.product_id = product.id', $product_price_fields)
    					->join('product_category', 'product_category.product_id = product.id', array())
    					->join('product_user', 'product_user.product_id = product.id', array())
    					->where($where);

    	return $this->fetchAllToArray($select);
    }
}