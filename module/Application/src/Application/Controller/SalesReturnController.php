<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class SalesReturnController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('SalesReturn');
        $result = $model->getSalesReturn();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getSalesReturnByDocIdAction($docId = 0, $fetch = false)
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

        $model = $this->model('SalesReturn');
        $result = $model->getSalesReturnByDocId($docId);

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
        $model = $this->model('SalesReturnItem');
        $result = $model->getSalesReturnItem($docId);

        return $result;
    }

    public function printSalesReturnAction()
    {
        $postData = $this->getRequest()->getQuery('docId');
        $data = array();

        $docId = $this->getRequest()->getQuery('docId');

        $data['salesReturn'] = $this->getSalesReturnByDocIdAction($docId, true);
        $data['salesReturnItems'] = $this->getSalesItemsByDocIdAction($docId);

        $this->Report()
            ->title('Sales Return Report')
            ->printSalesReturn($data, 'SalesReturnReport');
    }

}
