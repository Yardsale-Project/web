<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;

use \Exception;

class LocationController extends Controller {


    public function  indexAction() {
        $retVal     = array();
        $request    = $this->getRequest();
        $stateChildKey = 0;
        $prevStateId = 0;


        if( $request->isPost() ) {
            $postData = $request->getPost();

            $filter     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();
            $where = $this->buildWhereClause($filter);

            $model = $this->model('Location');
            $result = $model->getLocation($where);

            $retVal = array(
                'text'          => '.',
                'children'      => array(),
                'totalRecords'  => count($result)
            );

            
            foreach ($result as $key => $states) {
                $id = $states['state_id'];

                $child = array(
                    'text'  => $states['state_name'],
                    'id'    => $id
                );

                if( !empty($states['city_id'])) {
                    
                    $cityChild = array(
                        'text'  => $states['city_name'],
                        'id'    => $states['city_id'],
                        'leaf'  => true
                    );

                    if( $id != $prevStateId) {
                        $child['children'] = array($cityChild);
                        $stateChildKey = $key;

                        $retVal['children'][] = $child;
                    } else {
                        $retVal['children'][$stateChildKey]['children'][] = $cityChild;
                    }

                    
                } else {
                    $child['leaf'] = true;
                    $retVal['children'][] = $child;
                }

                $prevStateId = $id;
            }
        }

        return new JsonModel($retVal);
    }

   /* public function  indexAction() {
        $retVal     = array();
        $request    = $this->getRequest();


        if( $request->isPost() ) {
            $postData = $request->getPost();

            $filter     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();
            $searchFilter     = (!empty($postData['searchFilter'])) ? json_decode(stripslashes($postData['searchFilter']), true) : array();
            $where = $this->buildWhereClause($filter);

            $model = $this->model('Location');
            $result = $model->getStates($where);

            $retVal = array(
                'text'   => '.',
                'children'   => array()
            );

            foreach ($result as $states) {
                $id = $states['id'];

                $child = array(
                    'text'  => $states['name'],
                    'id'    => $id
                );

                $where = $this->buildWhereClause($searchFilter);
                $where = $where->and->equalTo('state_id', $id);

                $children = $model->getCities( $where );

                if(!empty($children)) {
                    $child['children'] = array();

                    foreach ($children as $cities) {
                        $cityChild = array(
                            'text'  => $cities['name'],
                            'id'    => $cities['id'],
                            'leaf'  => true 
                        );

                        $child['children'][] = $cityChild;
                    }
                } else {
                    $child['leaf'] = true;
                }

                $retVal['children'][] = $child;
            }
        }

        return new JsonModel($retVal);
    }*/

    public function getCountryAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $filter     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();

                $locationModel = $this->model('Location');

                $where = $this->buildWhereClause($filter);

                $result = $locationModel->getCountries($where);                

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
                $filter     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();

                $locationModel = $this->model('Location');

                $where = $this->buildWhereClause($filter);

                $result = $locationModel->getStates($where);                

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
                    $result = $locationModel->isStateCodeExist($code, $countryId);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isStateCodeExist($code, $countryId);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                }

                if(!empty($resultId) && $countryId == $resultId['country_id'] && $name != $resultId['name']) {
                    $result = $locationModel->isStateNameExist($name, $countryId);

                    if(!empty($result)) {
                        $error .= 'Name already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isStateNameExist($name, $countryId);

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

    public function saveMultipleStateAction() {
        $retVal = array();

        $error = '';

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $postData = $request->getPost();
                $countryId   = (!empty($postData['countryId'])) ? $postData['countryId'] : 0;
                $states     = (!empty($postData['states'])) ? $postData['states'] : '';
                $states     = explode(',', $states);

                $locationModel = $this->model('Location');

                foreach ($states as  $state) {

                    $err = '';
                    list($code, $name) = explode('-', trim($state));

                    $result = $locationModel->isStateCodeExist($code, $countryId);

                    if(!empty($result)) {
                        $error .= 'Code ' . $code . ' already exist. <br>';
                        $err .= 'Code ' . $code . ' already exist. <br>';
                    }

                    $result = $locationModel->isStateNameExist($name, $countryId);

                    if(!empty($result)) {
                        $error .= 'Name ' . $name . ' already exist. <br>';
                        $err .= 'Name ' . $name . ' already exist. <br>';
                    }

                    if(empty($err)) {
                        $data = array(
                            'code'  => $code,
                            'name'  => $name,
                            'country_id' => $countryId
                        );

                        $locationModel->insertState($data);
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

    public function deleteStateAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $id     = (!empty($postData['id'])) ? $postData['id'] : '';

                $locationModel = $this->model('Location');

                $result = $locationModel->deleteState($id);                

                $retVal['success'] = true;
                $retVal['message'] = 'State deleted';

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

    public function getCitiesAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $filter     = (!empty($postData['filter'])) ? json_decode(stripslashes($postData['filter']), true) : array();

                $locationModel = $this->model('Location');

                $where = $this->buildWhereClause($filter);

                $result = $locationModel->getCities($where);                

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

    public function getLastCityIdAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $locationModel = $this->model('Location');

                $result = $locationModel->getLastCityId();                

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

    public function saveSingleCityAction() {
        $retVal = array();

        $error = '';

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $postData = $request->getPost();
                $id     = (!empty($postData['id'])) ? $postData['id'] : 0;
                $stateId   = (!empty($postData['stateId'])) ? $postData['stateId'] : 0;
                $code   = (!empty($postData['code'])) ? $postData['code'] : '';
                $name   = (!empty($postData['name'])) ? $postData['name'] : '';

                $locationModel = $this->model('Location');

                $resultId = $locationModel->isCityIdExist($id);


                if(!empty($resultId) && !empty($code) && $stateId == $resultId['state_id'] && $code != $resultId['code']) {
                    $result = $locationModel->isCityCodeExist($code, $stateId);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                } else if(empty($resultId) && !empty($code)) {
                    $result = $locationModel->isCityCodeExist($code, $stateId);

                    if(!empty($result)) {
                        $error .= 'Code already exist. <br>';
                    }
                }

                if(!empty($resultId) && $stateId == $resultId['state_id'] && $name != $resultId['name']) {
                    $result = $locationModel->isCityNameExist($name, $stateId);

                    if(!empty($result)) {
                        $error .= 'Name already exist. <br>';
                    }
                } else if(empty($resultId)) {
                    $result = $locationModel->isCityNameExist($name, $stateId);

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
                        'state_id' => $stateId
                    );
                    if(!empty($resultId)) {
                        //update

                        $locationModel->updateCity($data, $id);
                    } else {
                        //insert
                        $locationModel->insertCity($data);

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

    public function saveMultipleCityAction() {
        $retVal = array();

        $error = '';

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {

                $postData = $request->getPost();
                $stateId   = (!empty($postData['stateId'])) ? $postData['stateId'] : 0;
                $cities     = (!empty($postData['cities'])) ? $postData['cities'] : '';
                $cities     = explode(',', $cities);

                $locationModel = $this->model('Location');

                foreach ($cities as  $city) {

                    $err = '';
                    list($code, $name) = explode('-', trim($city));

                    if(!empty($code)) {
                        $result = $locationModel->isCityCodeExist($code, $stateId);

                        if(!empty($result)) {
                            $error .= 'Code ' . $code . ' already exist. <br>';
                            $err .= 'Code ' . $code . ' already exist. <br>';
                        }
                    }
                    

                    $result = $locationModel->isCityNameExist($name, $stateId);

                    if(!empty($result)) {
                        $error .= 'Name ' . $name . ' already exist. <br>';
                        $err .= 'Name ' . $name . ' already exist. <br>';
                    }

                    if(empty($err)) {
                        $data = array(
                            'code'  => $code,
                            'name'  => $name,
                            'state_id' => $stateId
                        );

                        $locationModel->insertCity($data);
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

    public function deleteCityAction() {
        $retVal = array();

        $request = $this->getRequest();

        if ($request->isPost())  {

            try {
                $postData = $request->getPost();
                $id     = (!empty($postData['id'])) ? $postData['id'] : '';

                $locationModel = $this->model('Location');

                $result = $locationModel->deleteCity($id);                

                $retVal['success'] = true;
                $retVal['message'] = 'City deleted';

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
