<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class SalesInvoiceItemController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('SalesInvoiceItem');
        $result = $model->getSalesInvoiceItems();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getSalesItemsByDocIdAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $docId = $postData['docId'];
            $model = $this->model('SalesInvoiceItem');
            $result = $model->getSalesInvoiceItem($docId);

            if(!empty($result))
            {
                $retVal['success'] = true;
                $retVal['rows'] = $result;
                $retVal['totalRecords'] = count($result);
            }
        }

        return new JsonModel($retVal);
    }

}
