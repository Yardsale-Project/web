<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\Session\Config\SessionConfig;
use Zend\Session\Container;
use Zend\Session\SessionManager;
use Zend\Session\Validator\HttpUserAgent;
use Zend\Session\Validator\RemoteAddr;

use Application\Model\Users;
use Application\Model\Model;

class Module
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        $this->initSession(array(
          'remember_me_seconds' => 180,
          'use_cookies' => true,
          'cookie_httponly' => true
        ));
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
         );
    }

    public function getServiceConfig()
    {
        return array(
            'factories' => array(
                'Application\Model\Users' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new Users($dbAdapter);
                    return $table;
                },
                'Application\Model\Model' =>  function($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\Adapter');
                    $table = new Model($dbAdapter);
                    return $table;
                },
            ),
        );
    }

    public function initSession($config)
    {
        $sessionConfig = new SessionConfig();
          $sessionConfig->setOptions($config);
          $sessionManager = new SessionManager($sessionConfig);
          $sessionManager->getValidatorChain()->attach('session.validate', array(new HttpUserAgent(), 'isValid'));
          $sessionManager->getValidatorChain()->attach( 'session.validate', array(new RemoteAddr(), 'isValid') );
                 /* ->attach( 'session.validate', array(new RemoteAddr(), 'isValid') );*/
          $sessionManager->start();
          Container::setDefaultManager($sessionManager);
    }
}
