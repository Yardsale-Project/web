<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class GoodsReturnController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('GoodsReturn');
        $result = $model->getGoodsReturns();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getGoodsReturnByDocIdAction($docId = 0, $fetch = false)
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

        $model = $this->model('GoodsReturn');
        $result = $model->getGoodsReturnByDocId($docId);

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

    public function getGoodsReturnItemsByDocIdAction($docId)
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $docId = $docId;
        $model = $this->model('GoodsReturnItem');
        $result = $model->getGoodsReturnItem($docId);

        return $result;
    }

    public function printGoodsReturnAction()
    {
        $postData = $this->getRequest()->getQuery('docId');
        $data = array();

        $docId = $this->getRequest()->getQuery('docId');

        $data['purchaseOrder'] = $this->getGoodsReturnByDocIdAction($docId, true);
        $data['purchaseOrderItems'] = $this->getGoodsReturnItemsByDocIdAction($docId);

        $this->Report()
            ->title('Purchase Order')
            ->printGoodsReturn($data, 'GoodsReturnReport');
    }

}
