<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Container;
use Zend\View\Model\ViewModel;
use \Zend\Db\Sql\Where;

class Controller extends AbstractActionController
{
	protected $_sessionContainer;
	protected $_view;

	public function __construct()
	{
		register_shutdown_function('session_write_close');
		$this->_sessionContainer = new Container('Yardsale');
		$this->_view = new ViewModel();
	}

	protected function model($modelName)
	{
		$serviceLocator = $this->getServiceLocator();
        $model = $serviceLocator->get('Application\Model\Model');

        return $model->get($modelName);
	}

	protected function getUserId() {

		$id = 0;

		$host = $this->getRequest()->getServer('HTTP_HOST');
        $referer = $this->getRequest()->getServer('HTTP_REFERER');

        if(stripos($referer, $host) === FALSE) {
            $session = $this->model('Session');
            $result = $session->getValidationCode($referer);

            if(!empty($result)) {
                $validationCode = $result['validationCode'];
            }
        } else {
            $validationCode = $this->_sessionContainer->user_code;
        }

        if( empty($validationCode)) {
            $id = 0;
        } else {
            $user = $this->model('Users');
            $result = $user->getAccoutInfoBySessionCode($validationCode);

            if(!empty($result)) {
                $id = $result['id'];
            } else {
                $id = 0;
            }
        }

        return $id;
	}

    protected function isProduction() {
        if(!empty($_SERVER['APPLICATION_ENV']) && $_SERVER['APPLICATION_ENV'] == 'production') {
            return true;
        }

        return false;
    }

    protected function getClientIP() {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if(getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if(getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if(getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if(getenv('HTTP_FORWARDED'))
            $ipaddress = getenv('HTTP_FORWARDED');
        else if(getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    protected function buildWhereClause($filters, $where = null) {

        if(is_null($where)) {
            $where = new Where();
        }

        if(is_array($filters)) {
            if(!empty($filters['op'])) {
                $op = $filters['op'];

                $filterSet = $filters['set'];

                if(count($filterSet) > 1) {
                    if($op == 'OR') {
                        $where = $where->nest();
                    }
                    
                }

                foreach ($filterSet as $key => $filter) {

                    if(!empty($filter['field'])) {
                        if(count($filterSet) > 1) {
                            if($op == 'AND') {
                                $where = $where->and;    
                            } else if($op == 'OR') {
                                $where = $where->or;
                            }
                            
                        }

                        if($filter['bitOp'] == 'EQ') {
                            $where = $where->equalTo( (!empty($filter['table']))? $filter['table'] . '.' . $filter['field'] : $filter['field'], $filter['value']);
                        } else if($filter['bitOp'] == 'LIKE') {
                            $where = $where->like((!empty($filter['table']))? $filter['table'] . '.' . $filter['field'] : $filter['field'], '%' . $filter['value'] . '%');
                        }
                    } else if(!empty($filter['op'])) {
                        $where = $this->buildWhereClause($filter, $where);
                    }
                }

                if(count($filterSet) > 1) {
                    if($op == 'OR') {
                        $where = $where->unnest();
                    }
                    
                }
            }
        }

        return $where;
    }
}