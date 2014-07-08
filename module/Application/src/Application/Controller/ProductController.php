<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;

use \Exception;

class ProductController extends Controller
{

    public function indexAction()
    {

        $retVal     = array();
        $request    = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            $result = array();

            for( $i = 1; $i <= 50; $i++) {
                $result[] = array(
                    'id'            => $i,
                    'image'         => '2014_03_15_admin2.jpg',
                    'productName'   => 'Canon Digital Camera' . $i,
                    'currentPrice'  => 'Php 16,000.00'
                );
            };
            
            $retVal = array(
                'success'   => true,
                'message'   => 'Success',
                'totalRecords'  => count($result),
                'result'    => $result
            );
            
        }

        return new JsonModel($retVal);   
    }
}
