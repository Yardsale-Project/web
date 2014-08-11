<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class SettingController extends Controller {


    public function indexAction() {
        $retVal = array();
        return new JsonModel($retVal);
    }

    public function getSettingAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {
            $postData = $request->getPost();

            try {

                $setting = (!empty($postData['setting']))? $postData['setting'] : '';
                $name    = (!empty($postData['name']))? $postData['name'] : '';

                $settingsModel = $this->model('Settings');

                $result = $settingsModel->getSetting($setting, $name);                

                $retVal['success'] = true;
                $retVal['result'] = $result;
            } catch (\Exception $e) {

                $retVal['success'] = false;
                $retVal['errorMessage'] = 'Problem getting settings. ' . $e->getMessage();
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request.';
        }

        return new JsonModel($retVal);        
    }
}
