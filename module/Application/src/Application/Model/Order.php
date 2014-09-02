<?php

namespace Application\Model;

use Zend\Db\Sql\Expression;

class Order extends Table
{

	private $_name = 'order';

    public function addOrder($data) {
        $affected_rows = $this->insert( $this->_name, $data);

        $lastInsertId = $this->_dbAdapter->getDriver()->getLastGeneratedValue();

        return $lastInsertId;
    }

    public function addOrderItem($data) {
        $affected_rows = $this->insert( 'order_items', $data);

        return $affected_rows;
    }

    public function addOrderPayment($data) {
        $affected_rows = $this->insert( 'order_payment', $data);

        return $affected_rows;
    }

    public function updateOrder($data, $whereClause) {
        $affected_rows  = $this->update( $this->_name , $data, $whereClause);

        return $affected_rows;
    }

    public function getOrderItems($where) {

        $order_fields = array(
            'order_id'  => 'id',
            'user_id',
            'added',
            'updated',
            'removed'
        );

        $order_items_fields = array(
            'item_id',
            'quantity',
            'price'
        );

        $order_payment_fields = array(
            'order_payment'
        );

        $order_status_fields = array(
            'status' => 'name'
        );

        $select = $this->select()
                        ->from( $this->_name)
                        ->columns($order_fields)
                        ->join('order_items', 'order_items.order_id = order.id', $order_items_fields)
                        ->join('order_payment', 'order_payment.order_id = order.id', $order_payment_fields)
                        ->join('order_status', 'order_status.id = order.status', $order_status_fields)
                        ->where($where);

        return $this->fetchAllToArray($select);
    }
}