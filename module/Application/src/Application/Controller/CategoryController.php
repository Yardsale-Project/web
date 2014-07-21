<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;

use \Exception;

class CategoryController extends Controller
{

    /**
    * filter = [
    *    { property : 'active', value : 1},
    * ];
    */
    public function indexAction()
    {

        $retVal     = array();
        $request    = $this->getRequest();


        if( $request->isPost() ) {
            $postData = $request->getPost();

            $isTree = ( !empty($postData['isTree']) )? $postData['isTree'] : false;

            $model = $this->model('Category');
            $result = $model->getCategories();

            if( $isTree === 'true' ) {

                $retVal = array(
                    'text'   => '.',
                    'children'   => $this->_createTree($result),
                    'totalRecords'  => '3'
                );
            } else {
                $retVal = array(
                    'success'   => true,
                    'message'   => 'Success',
                    'totalRecords'  => '6',
                    'result'    => $result
                );
            }
            
        }

        return new JsonModel($retVal);
    }

    private function _createTree(&$list) {
        $shiftedVal = array_shift($list);

        $retVal = array();
        $nodeVal = array();

        foreach ($list as $key => $node) {
            $nodeVal = array();

            if( 
                $node['lft'] < $node['rgt'] &&
                $node['lft'] > $shiftedVal['lft'] &&
                $node['rgt'] < $shiftedVal['rgt']
            ) {
                $nodeVal['text'] = $node['name'];
                $nodeVal['id'] = $node['id'];
                $nodeVal['description'] = $node['description'];

                if( $node['lft'] + 1 == $node['rgt']) {
                    $nodeVal['leaf'] = 'true';

                    unset($list[$key]);
                }else if( $node['lft'] + 1 < $node['rgt'] ) {

                    //$list = array_slice($list, $key);
                    $nodeVal['leaf'] = 'false';
                    $nodeVal['children'] = $this->_createTree( $list );

                    prev($list);
                }

                $retVal[] = $nodeVal;

            } else {
                break;
            }

        }

        return $retVal;
    }

    public function addCategoryAction() {
        $retVal     = array();
        $request    = $this->getRequest();


        if( $request->isPost() ) {
            $postData = $request->getPost();

            $name           = ( !empty($postData['name']) )? $postData['name'] : '';
            $description    = ( !empty($postData['description']) )? $postData['description'] : '';
            $catId          = ( !empty($postData['cat_id']) )? $postData['cat_id'] : 0;
            $parentId       = ( !empty($postData['parent_id']) )? $postData['parent_id'] : 0;

            $model = $this->model('Category');
            if(empty($catId)) {
                //add
                $data = array(
                    'name' => $name,
                    'description' => $description
                );
                $lastInsertId = $model->addCategory($data);

                $catId = $lastInsertId;

                $result = $model->getLftRgt($parentId);
                $rgt = $result['rgt'];

                $model->updateLftRgt( $rgt-1 , ' + 2');

                $data = array(
                    'category_id' => $catId,
                    'lft' => $rgt,
                    'rgt' => $rgt + 1
                );
                $model->insertNode($data);

                $retVal['success'] = true;
                $retVal['message'] = 'Category Added';
            } else {
                //update
                $data = array(
                    'name' => $name,
                    'description' => $description
                );

                $where = array( 'id' => $catId);
                $model->updateCategory($data, $where);

                $retVal['success'] = true;
                $retVal['message'] = 'Category Updated';
            }

        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request';
        }

        return new JsonModel($retVal);
    }

    public function deleteCategoryAction() {
        $retVal     = array();
        $request    = $this->getRequest();


        if( $request->isPost() ) {
            $postData = $request->getPost();

            $catId = ( !empty($postData['cat_id']) )? $postData['cat_id'] : 0;

            $model = $this->model('Category');

            if(!empty($catId)) {
                $model->deleteCategoryById($catId);

                $result = $model->getLftRgt($catId);

                $lft = $result['lft'];
                $rgt = $result['rgt'];
                $id  = $result['id'];

                $diff = $rgt - $lft + 1;

                $model->deleteFromCatTree($lft, $rgt);
                $model->updateLftRgt( $rgt , ' - ' . $diff);

                $retVal['success'] = true;
                $retVal['message'] = 'Category deleted';
            } else {
                $retVal['success'] = false;
                $retVal['errorMessage'] = 'No category selected';
            }
        } else {
            $retVal['success'] = false;
            $retVal['errorMessage'] = 'Invalid request';
        }

        return new JsonModel($retVal);
    }
}
