<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class WarehouseController extends Controller
{

    public function indexAction()
    {
        
    }

    public function getWarehouseListAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $warehouse = $this->model('Warehouse');
        $result = $warehouse->getWarehouseList();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getActiveWarehouseListAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $warehouse = $this->model('Warehouse');
        $result = $warehouse->getActiveWarehouseList();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function saveWarehouseAction()
    {
        $data = array();
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();
            $fileData = $request->getFiles();

            $id = (!empty($postData['id'])) ? $postData['id'] : 0;
            $code = (!empty($postData['code'])) ? $postData['code'] : '';
            $name = (!empty($postData['name'])) ? $postData['name'] : '';
            $deactivate = (!empty($postData['deactivate'])) ? $postData['deactivate'] : '';
            
            //check for duplicate username
            $warehouse = $this->model('Warehouse');

            if(empty($id))
            {
                $data = array(
                    'code' => $code,
                    'name' => $name,
                    'deactivated'=> ($deactivate)? 'Y' :'N',
                    'createDate'=> date('Y-m-d H:i:s'),
                    'createdBy' => $this->_sessionContainer->user_id
                );

                $affected_rows = $warehouse->addStore($data);

                if(empty($affected_rows))
                {
                    $retVal = array(
                        'success'       => false,
                        'errorMessage' => 'Adding new store failed'
                    );
                }
                else
                {
                    $retVal = array(
                        'success'       => true,
                        'message' => 'New store added successfully'
                    );
                }
            }
            else
            {
                $data = array(
                    'code' => $code,
                    'name' => $name,
                    'deactivated'=> ($deactivate)? 'Y' :'N',
                    'updateDate'=> date('Y-m-d H:i:s'),
                    'updatedBy' => $this->_sessionContainer->user_id
                );

                $affected_rows = $warehouse->updateStore($data, $id);

                if(empty($affected_rows))
                {
                     $retVal = array(
                        'success'       => false,
                        'errorMessage' => 'Updating store failed'
                    );
                }
                else
                {
                    $retVal = array(
                        'success'       => true,
                        'message' => 'Store updated successfully'
                    );
                }
            }
        }
        else
        {
            $retVal = array(
                'success'       => false,
                'errorMessage' => 'Invalid request'
            );
        }


        return new JsonModel($retVal);
    }

    public function deleteStoreAction()
    {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $id = isset($postData['id']) ? $postData['id'] : 0;

            if(empty($id))
            {
                $retVal = array(
                    'success'       => false,
                    'errorMessage' => 'Please select a record to delete.'
                );
            }
            else
            {
                $warehouse = $this->model('Warehouse');
                $affected_rows = $warehouse->deleteStore($id);

                if(empty($affected_rows))
                {
                    $retVal = array(
                        'success'       => false,
                        'errorMessage' => 'Delete failed.'
                    );
                }
                else
                {
                    $retVal = array(
                        'success'       => true,
                        'message' => 'Record deleted successfully.'
                    );
                }
            }
        }

        return new JsonModel($retVal);
    }

    public function getTerminalStoresAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $warehouse = $this->model('Warehouse');
        $result = $warehouse->getTerminalStores();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }
}
