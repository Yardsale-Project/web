<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class InventoryTransferController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('InventoryTransfer');
        $result = $model->getInventoryTransfers();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getInventoryTransferByDocIdAction($docId = 0, $fetch = false)
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

        $model = $this->model('InventoryTransfer');
        $result = $model->getInventoryTransferByDocId($docId);

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

    public function getInventoryTransferItemsByDocIdAction($docId)
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $docId = $docId;
        $model = $this->model('InventoryTransferItem');
        $result = $model->getInventoryTransferItem($docId);

        return $result;
    }

    public function printInventoryTransferAction()
    {
        $postData = $this->getRequest()->getQuery('docId');
        $data = array();

        $docId = $this->getRequest()->getQuery('docId');

        $data['inventoryTransfer'] = $this->getInventoryTransferByDocIdAction($docId, true);
        $data['inventoryTransferItems'] = $this->getInventoryTransferItemsByDocIdAction($docId);

        $this->Report()
            ->title('Inventory Transfer')
            ->printInventoryTransfer($data, 'InventoryTransferReport');
    }

}
