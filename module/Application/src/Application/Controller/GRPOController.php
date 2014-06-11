<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class GRPOController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('GRPO');
        $result = $model->getGRPOs();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getGRPOByDocIdAction($docId = 0, $fetch = false)
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

        $model = $this->model('GRPO');
        $result = $model->getGRPOByDocId($docId);

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

    public function getGRPOItemsByDocIdAction($docId)
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $docId = $docId;
        $model = $this->model('GRPOItem');
        $result = $model->getGRPOItem($docId);

        return $result;
    }

    public function printGRPOAction()
    {
        $postData = $this->getRequest()->getQuery('docId');
        $data = array();

        $docId = $this->getRequest()->getQuery('docId');

        $data['GRPO'] = $this->getGRPOByDocIdAction($docId, true);
        $data['GRPOItems'] = $this->getGRPOItemsByDocIdAction($docId);

        $this->Report()
            ->title('Good Receipt Purchase Order')
            ->printGRPO($data, 'GRPOReport');
    }

}
