<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\Session\Container;
use Zend\Session\Config\StandardConfig;
use Zend\Session\SessionManager;
use Zend\View\Model\ViewModel;

class Controller extends AbstractActionController
{
	protected $_sessionContainer;
	protected $_view;

	public function __construct()
	{
		$config = new StandardConfig();
		$config->setOptions(array(
		    'save_path' => ROOTH_PATH . '/sessions'
		));
		$manager = new SessionManager($config);
		Container::setDefaultManager($manager);

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