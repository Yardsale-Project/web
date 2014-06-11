<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class BusinessPartnerController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('BusinessPartner');
        $result = $model->getBusinessPartners();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getBusinessPartnersByTypeAction()
    {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $type   = isset($postData['type'])?  $postData['type'] : '';
            
            $user = $this->model('BusinessPartner');
            $result = $user->getBusinessPartnersByType($type);

            if(!empty($result))
            {
                $retVal['success'] = true;
                $retVal['rows'] = $result;
                $retVal['totalRecords'] = count($result);
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

    public function saveBusinessPartnerAction()
    {
        $data = array();
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $action   = isset($postData['action'])?  $postData['action'] : 'add';
            $code   = isset($postData['code'])?  $postData['code'] : '';
            $name   = isset($postData['name'])?  $postData['name'] : '';
            $type   = isset($postData['type'])?  $postData['type'] : '';
            $address    = isset($postData['address'])?  $postData['address'] : '';
            $tel1   = isset($postData['tel1'])? $postData['tel1'] : '';
            $tel2   = isset($postData['tel2'])?  $postData['tel2'] : '';
            $fax    = isset($postData['fax'])?  $postData['fax'] : '';
            $email  = isset($postData['email'])?  $postData['email'] : '';
            $website    = isset($postData['website'])?  $postData['website'] : '';
            $contactperson  = isset($postData['contactperson'])?  $postData['contactperson'] : '';
            $remarks    = isset($postData['remarks'])?  $postData['remarks'] : '';
            $deactivated    = isset($postData['deactivated'])?  'Y' : 'N';
            
            //check for duplicate username
            $businessPartner = $this->model('BusinessPartner');

            if(strcasecmp($action, 'add') == 0)
            {
                if($businessPartner->isCodeExist($code))
                {
                    $retVal = array(
                        'success'       => false,
                        'errorMessage' => 'Adding new business partner failed. BP Code already exist!'
                    );
                }
                else
                {
                    $data = array(
                        'code'  => $code,
                        'BPType'    => $type,
                        'BPname'    => $name,
                        'address'   => $address,
                        'tel1'  => $tel1,
                        'tel2'  => $tel2,
                        'fax'   => $fax,
                        'email'     => $email,
                        'website'   => $website,
                        'contactP'  => $contactperson,
                        'deactivated'   => ($deactivated)? 'Y' :'N',
                        'remarks'   => $remarks,
                        'createDate'    => date('Y-m-d h:i:s'),
                        'createdBy' => $this->_sessionContainer->user_id
                    );

                    $affected_rows = $businessPartner->addBusinessPartner($data);

                    if(empty($affected_rows))
                    {
                        $retVal = array(
                            'success'       => false,
                            'errorMessage' => 'Adding new business partner failed'
                        );
                    }
                    else
                    {
                        $retVal = array(
                            'success'       => true,
                            'message' => 'New business partner added successfully'
                        );
                    }
                }
            }
            else if(strcasecmp($action, 'edit') == 0)
            {
                $data = array(
                    'BPname' => $name,
                    'address' => $address,
                    'tel1' => $tel1,
                    'tel2' => $tel2,
                    'fax' => $fax,
                    'email' => $email,
                    'website' => $website,
                    'contactP' => $contactperson,
                    'remarks' => $remarks,
                    'deactivated' => ($deactivated)? 'Y' :'N',
                    'updateDate' => date('Y-m-d h:i:s'),
                    'updatedBy' => $this->_sessionContainer->user_id
                );

                $businessPartner->updateBusinessPartner($data, $code);

                $retVal = array(
                    'success'       => true,
                    'message' => 'Business Partner updated successfully'
                );
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

    public function deleteBusinessPartnerAction()
    {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $code   = isset($postData['code'])?  $postData['code'] : '';
            
            if(empty($code))
            {
                $retVal = array(
                    'success'       => false,
                    'errorMessage' => 'Please select a record to delete.'
                );
            }
            else
            {
                $user = $this->model('BusinessPartner');
                $affected_rows = $user->deleteBusinessPartner($code);

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
        else
        {
            $retVal = array(
                'success'       => false,
                'errorMessage' => 'Invalid request'
            );
        }


        return new JsonModel($retVal);
    }

}
