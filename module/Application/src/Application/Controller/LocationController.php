<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;

use \Exception;

class LocationController extends Controller {


    public function indexAction() {
        $retVal = array();
        return new JsonModel($retVal);
    }

    public function getCountryAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $filters     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();

                $locationModel = $this->model('Location');

                $whereClause = array();
                foreach ($filters as $filter) {
                    $whereClause[] = 'code LIKE "%' . $filter['search'] . '%" OR name LIKE "%' . $filter['search'] . '%"';
                }

                $result = $locationModel->getCountries($whereClause);                

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

    public function getLastCountryIdAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $locationModel = $this->model('Location');

                $result = $locationModel->getLastCountryId();                

                $retVal['success'] = true;
                $retVal['id'] = $result['id'];

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

    public function saveSingleCountryAction() {
        $retVal = array();

        $error = '';

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $postData = $request->getPost();
                $id     = (!empty($postData['id'])) ? $postData['id'] : 0;
                $code   = (!empty($postData['code'])) ? $postData['code'] : '';
                $name   = (!empty($postData['name'])) ? $postData['name'] : '';

                $locationModel = $this->model('Location');

                $resultId = $locationModel->isIdExist($id);


                if(!empty($resultId) && $code != $resultId['code']) {
                    $result = $locationModel->isCodeExist($code);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isCodeExist($code);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                }

                if(!empty($resultId) && $name != $resultId['name']) {
                    $result = $locationModel->isNameExist($name);

                    if(!empty($result)) {
                        $error .= 'Name already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isNameExist($name);

                    if(!empty($result)) {
                        $error .= 'Name already exist. <br>';
                    }
                }

                if(!empty($error)) {
                    $retVal['success'] = false;
                    $retVal['errorMessage'] = $error;
                } else {

                    $data = array(
                        'code'  => $code,
                        'name'  => $name
                    );
                    if(!empty($resultId)) {
                        //update

                        $locationModel->updateCountry($data, $id);
                    } else {
                        //insert
                        $locationModel->insertCountry($data);

                    }
                    $retVal['success'] = true;
                    $retVal['message'] = 'Data saved';
                }


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

    public function saveMultipleCountryAction() {
        $retVal = array();

        $error = '';

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $postData = $request->getPost();
                $countries     = (!empty($postData['countries'])) ? $postData['countries'] : '';
                $countries     = explode(',', $countries);

                $locationModel = $this->model('Location');

                foreach ($countries as  $country) {

                    $err = '';
                    list($code, $name) = explode('-', trim($country));

                    $result = $locationModel->isCodeExist($code);

                    if(!empty($result)) {
                        $error .= 'Code ' . $code . ' already exist. <br>';
                        $err .= 'Code ' . $code . ' already exist. <br>';
                    }

                    $result = $locationModel->isNameExist($name);

                    if(!empty($result)) {
                        $error .= 'Name ' . $name . ' already exist. <br>';
                        $err .= 'Name ' . $name . ' already exist. <br>';
                    }

                    if(empty($err)) {
                        $data = array(
                            'code'  => $code,
                            'name'  => $name
                        );

                        $locationModel->insertCountry($data);
                    }
                }

                if(!empty($error)) {
                    $retVal['success'] = true;
                    $retVal['message'] = $error;
                } else {
                    $retVal['success'] = true;
                    $retVal['message'] = 'Data saved';
                }


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

    public function deleteCountryAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $id     = (!empty($postData['id'])) ? $postData['id'] : '';

                $locationModel = $this->model('Location');

                $result = $locationModel->deleteCountry($id);                

                $retVal['success'] = true;
                $retVal['message'] = 'Country deleted';

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

    public function getStatesAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $filters     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();

                $locationModel = $this->model('Location');

                $whereClause = array();
                foreach ($filters as $filter) {
                    $whereClause[$filter['field']] = $filter['value'];
                }

                $result = $locationModel->getStates($whereClause);                

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

    public function getLastStateIdAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $locationModel = $this->model('Location');

                $result = $locationModel->getLastStateId();                

                $retVal['success'] = true;
                $retVal['id'] = $result['id'];

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

    public function saveSingleStateAction() {
        $retVal = array();

        $error = '';

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $postData = $request->getPost();
                $id     = (!empty($postData['id'])) ? $postData['id'] : 0;
                $countryId   = (!empty($postData['countryId'])) ? $postData['countryId'] : 0;
                $code   = (!empty($postData['code'])) ? $postData['code'] : '';
                $name   = (!empty($postData['name'])) ? $postData['name'] : '';

                $locationModel = $this->model('Location');

                $resultId = $locationModel->isStateIdExist($id);


                if(!empty($resultId) && $countryId == $resultId['country_id'] && $code != $resultId['code']) {
                    $result = $locationModel->isStateCodeExist($code);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isStateCodeExist($code);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                }

                if(!empty($resultId) && $countryId == $resultId['country_id'] && $name != $resultId['name']) {
                    $result = $locationModel->isStateNameExist($name);

                    if(!empty($result)) {
                        $error .= 'Name already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isStateNameExist($name);

                    if(!empty($result)) {
                        $error .= 'Name already exist. <br>';
                    }
                }

                if(!empty($error)) {
                    $retVal['success'] = false;
                    $retVal['errorMessage'] = $error;
                } else {

                    $data = array(
                        'code'  => $code,
                        'name'  => $name,
                        'country_id' => $countryId
                    );
                    if(!empty($resultId)) {
                        //update

                        $locationModel->updateState($data, $id);
                    } else {
                        //insert
                        $locationModel->insertState($data);

                    }
                    $retVal['success'] = true;
                    $retVal['message'] = 'Data saved';
                }


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
