<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class SalesInvoiceController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('SalesInvoice');
        $result = $model->getSalesInvoices();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getSalesInvoiceByDocIdAction($docId = 0, $fetch = false)
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
        }

        $model = $this->model('SalesInvoice');
        $result = $model->getSalesInvoiceByDocId($docId);

        if($fetch)
        {
            return $result;
        }
        else
        {
            if(!empty($result))
            {
                $retVal['success'] = true;
                $retVal['rows'] = $result;
                $retVal['totalRecords'] = count($result);
            }


            return new JsonModel($retVal);
        }
    }

    public function getSalesItemsByDocIdAction($docId)
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $docId = $docId;
        $model = $this->model('SalesInvoiceItem');
        $result = $model->getSalesInvoiceItem($docId);

        return $result;
    }

    public function printSalesARInvoiceAction()
    {
        $postData = $this->getRequest()->getQuery('docId');
        $data = array();

        $docId = $this->getRequest()->getQuery('docId');

        $data['salesInvoice'] = $this->getSalesInvoiceByDocIdAction($docId, true);
        $data['salesInvoiceItems'] = $this->getSalesItemsByDocIdAction($docId);

        $this->Report()
            ->title('Sales Report')
            ->printSalesARInvoice($data, 'ARInvoiceReport');
    }

}
