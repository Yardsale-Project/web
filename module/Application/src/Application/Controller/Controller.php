<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Container;
use Zend\View\Model\ViewModel;

class Controller extends AbstractActionController
{
	protected $_sessionContainer;
	protected $_view;

	public function __construct()
	{
		$this->_sessionContainer = new Container('Yardsale');
		$this->_view = new ViewModel();
	}

	protected function model($modelName)
	{
		$serviceLocator = $this->getServiceLocator();
        $model = $serviceLocator->get('Application\Model\Model');

        return $model->get($modelName);
	}
}