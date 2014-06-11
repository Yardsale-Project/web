<?php 
namespace Application\Controller\Plugin\Service;

use Application\Controller\Plugin\Service\PDF;
use Zend\Mvc\Controller\Plugin\AbstractPlugin;

/**
 * Handles Report Abstraction
 * 
 * @author Egee Boy Gutierrez
 * @version 1
 * @package Checkup
 */
abstract class Report extends AbstractPlugin
{	
	private $_adapter;
	
	private $_translate;
	
	private $_title;
	private $_logo;
	
	public function __construct($title = '', $logo = '')
	{
		$this->_title = !empty($title) ? $title : 'Checkup Motor Parts Report';
		$this->_logo = !empty($logo) ? $logo : ROOTH_PATH . '/public/img/zf2-logo.png';
		
		$adapter = $this->_initAdapter();
			
		$this->setAdapter($adapter);
	}

	public function title($title)
	{
		$this->_title = $title;

		$adapter = $this->_initAdapter();
			
		$this->setAdapter($adapter);

		return $this;
	}

	public function logo($logo)
	{
		$this->_logo = $logo;

		$adapter = $this->_initAdapter();
			
		$this->setAdapter($adapter);

		return $this;
	}
	
	public function setTranslate(Zend_Translate $translate)
	{
		$this->_translate = $translate;
		
		return $this;
	}
	
	public function getTranslate()
	{
		return $this->_translate;
	}
	
	public function setAdapter($adapter)
	{
		$this->_adapter = $adapter;
		
		return $this;
	}
	
	public function getAdapter()
	{
		if (!isset($this->_adapter))
		{	
			$adapter = $this->_initAdapter();
			
			$this->setAdapter($adapter);
		}
		
		return $this->_adapter;
	}
	
	private function _initAdapter()
	{
		$adapter = new PDF($this->_title, $this->_logo);
		
		return $adapter;
	}
}
