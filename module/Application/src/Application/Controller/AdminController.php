<?php
namespace Application\Controller;

use Application\Controller\Controller;


use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class AdminController extends Controller
{

    public function indexAction()
    {
        $host = $this->getRequest()->getServer('HTTP_HOST');
        
        if($this->MobileDetect()->isMobile())
        {

           $host = str_replace('local.', '', $host);

           $url = 'http://m-' . $host;

           $this->plugin('redirect')->toUrl($url);

           return false;
        }

        $token  = $this->NoCSRF()->generate('token');

        $this->_view->setVariables(
            array(
                'token' => $token
            )
        );

        return $this->_view;
    }
}
