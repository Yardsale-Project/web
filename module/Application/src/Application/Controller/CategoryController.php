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

            /*$result = array(
                array(
                    'id'        => '1',
                    'text'      => 'Category 1',
                    'parentId'  => '0'
                ),
                array(
                    'id'        => '4',
                    'text'      => 'Sub Category 1, 1',
                    'parentId'  => '1'
                ),
                array(
                    'id'        => '2',
                    'text'      => 'Category 2',
                    'parentId'  => '0'
                ),
                array(
                    'id'        => '3',
                    'text'      => 'Category 3',
                    'parentId'  => '0'
                ),
                array(
                    'id'        => '5',
                    'text'      => 'Sub Category 1, 3',
                    'parentId'  => 3
                ),
                array(
                    'id'        => '6',
                    'text'      => 'Sub Category 2, 3',
                    'parentId'  => '3'
                )
            );*/
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

    /*private function _createTree($list, $parentId = 0) {
        $tree = array();

        $treeCtr = 0;

        foreach ($list as $key => &$value) {

            if( $value['parentId'] == $parentId) {
                $value['children'] = $this->_createTree($list, $value['id']);
                $tree[] = $value;
            }
        }

        return $tree;
    }*/

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
}
