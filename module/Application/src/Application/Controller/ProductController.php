<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;

use \Exception;

define('THUMBNAIL_IMAGE_MAX_WIDTH', 150);
define('THUMBNAIL_IMAGE_MAX_HEIGHT', 150);

class ProductController extends Controller
{

    public function indexAction()
    {

        $retVal     = array();
        $request    = $this->getRequest();

        if( $request->isPost() ) {
            $postData = $request->getPost();

            $productsModel = $this->model('Product');

            $whereClause = array(
                'product_sell.product_id IS NULL',
                'product.active' => 1
            );

            $result = $productsModel->getProducts($whereClause);

            /*for( $i = 1; $i <= 50; $i++) {
                $result[] = array(
                    'id'            => $i,
                    'image'         => '2014_03_15_admin2.jpg',
                    'productName'   => 'Canon Digital Camera' . $i,
                    'currentPrice'  => 'Php 16,000.00'
                );
            };*/
            
            $retVal = array(
                'success'   => true,
                'message'   => 'Success',
                'totalRecords'  => count($result),
                'result'    => $result
            );
            
        }

        return new JsonModel($retVal);
    }

    public function saveProductAction() {
        $retVal     = array();
        $request    = $this->getRequest();
        $file       = null;
        $file_name  = null;
        $file_temp  = null;
        $new_path   = null;
        $result     = true;


        if( $request->isPost() ) {
            $postData = $request->getPost();
            $fileData = $request->getFiles();

            try {

                $userId = $this->getUserId();

                if( empty($userId) ) {
                    $retVal = array(
                        'success'       => false,
                        'errorMessage'  => 'You must be logged in to add a new product'
                    );
                } else {

                    $id = (!empty($postData['id']))? $postData['id'] : 0;
                    $name = (!empty($postData['name']))? $postData['name'] : '';
                    $short_desc = (!empty($postData['short_desc']))? $postData['short_desc'] : '';
                    $description = (!empty($postData['description']))? $postData['description'] : '';
                    $category = (!empty($postData['category']))? $postData['category'] : 0;
                    $stock = (!empty($postData['stock']))? $postData['stock'] : 0;
                    $weight = (!empty($postData['weight']))? $postData['weight'] : 0;
                    $min_price = (!empty($postData['min_price']))? $postData['min_price'] : 0;
                    $sell_price = (!empty($postData['sell_price']))? $postData['sell_price'] : 0;

                    $photopath = (!empty($fileData['photopath'])) ? $fileData['photopath'] : array();

                    if(!empty($photopath['size'])) {
                        $file       = $photopath;
                        $file_name  = $file["name"];
                        $file_temp  = $file["tmp_name"];
                        
                        $parts      = explode('.', $file_name);
                        $ext        = $parts[1];
                        $photopath       = date('Y_m_d_his') . '_' . $userId . '_' . str_replace(' ', '', $name) . '.' . $ext;
                    } else {
                        $photopath = '';


                    }

                    if(!empty($photopath)) {
                        $new_path = move_uploaded_file($file_temp,  ROOTH_PATH . "/public/img/product/" . $photopath);

                        $result = $this->generate_image_thumbnail(ROOTH_PATH . "/public/img/product/" . $photopath, ROOTH_PATH . "/public/img/product/thumbnail/" . $photopath);
                    }

                    if(empty($id)) {


                        if (empty($new_path) && !empty($photopath)) {
                            $retVal = array(
                                'success'       => false,
                                'errorMessage' => 'Error uploading photo'
                            );
                        } else if(!empty($new_path) && empty($result)) {

                            unlink(ROOTH_PATH . "/public/img/product/" . $photopath);

                            $retVal = array(
                                'success'       => false,
                                'errorMessage' => 'Error uploading photo thumbnail'
                            );
                        } else {


                            $productModel = $this->model('Product');
                            $itmCode = $productModel->generateItemCode();


                            //add data to product
                            $data = array(
                                'code'          => $itmCode,
                                'name'          => $name,
                                'short_description' => $short_desc,
                                'description'   => $description,
                                'images'        => $photopath,
                                'stock'         => $stock,
                                'weight'        => $weight,
                                'active'        => 1
                            );

                            $productId = $productModel->addProduct($data);
                            
                            //add product to category
                            $data = array(
                                'product_id'    => $productId,
                                'category_id'   => $category
                            );

                            $productModel->addProductCat($data);

                            //add product price
                            $data = array(
                                'product_id'    => $productId,
                                'min_price'     => $min_price,
                                'sell_price'    => $sell_price,
                                'added'         => date('Y-m-d h:i:s')
                            );

                            $productModel->addProductPrice($data);

                            //add product user
                            $data = array(
                                'product_id'    => $productId,
                                'user_id'       => $userId
                            );

                            $productModel->addProductUser($data);
                            $productModel->updateItemCodeCount();

                            $retVal = array(
                                'success'       => true,
                                'message'       => 'Product saved'
                            );
                        }
                    }
                    
                }

            } catch (\Exception $e) {
                $reVal = array(
                    'success'       => false,
                    'errorMessage'  => 'Error processing request. ' . $e->getMessage()
                );
            }
        } else {
            $reVal = array(
                'success'       => false,
                'errorMessage'  => 'Invalid request'
            );
        }

        return new JsonModel($retVal);
    }

    private function generate_image_thumbnail($source_image_path, $thumbnail_image_path) {
        list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);

        switch ($source_image_type) {
            case IMAGETYPE_GIF:
                $source_gd_image = imagecreatefromgif($source_image_path);
                break;
            case IMAGETYPE_JPEG:
                $source_gd_image = imagecreatefromjpeg($source_image_path);
                break;
            case IMAGETYPE_PNG:
                $source_gd_image = imagecreatefrompng($source_image_path);
                break;
        }

        if ($source_gd_image === false) {
            return false;
        }

        $source_aspect_ratio    = $source_image_width / $source_image_height;
        $thumbnail_aspect_ratio = THUMBNAIL_IMAGE_MAX_WIDTH / THUMBNAIL_IMAGE_MAX_HEIGHT;

        if ($source_image_width <= THUMBNAIL_IMAGE_MAX_WIDTH && $source_image_height <= THUMBNAIL_IMAGE_MAX_HEIGHT) {
            $thumbnail_image_width = $source_image_width;
            $thumbnail_image_height = $source_image_height;
        } elseif ($thumbnail_aspect_ratio > $source_aspect_ratio) {
            $thumbnail_image_width = (int) (THUMBNAIL_IMAGE_MAX_HEIGHT * $source_aspect_ratio);
            $thumbnail_image_height = THUMBNAIL_IMAGE_MAX_HEIGHT;
        } else {
            $thumbnail_image_width = THUMBNAIL_IMAGE_MAX_WIDTH;
            $thumbnail_image_height = (int) (THUMBNAIL_IMAGE_MAX_WIDTH / $source_aspect_ratio);
        }

        $thumbnail_gd_image = imagecreatetruecolor($thumbnail_image_width, $thumbnail_image_height);
        
        imagecopyresampled($thumbnail_gd_image, $source_gd_image, 0, 0, 0, 0, $thumbnail_image_width, $thumbnail_image_height, $source_image_width, $source_image_height);
        imagejpeg($thumbnail_gd_image, $thumbnail_image_path, 90);
        imagedestroy($source_gd_image);
        imagedestroy($thumbnail_gd_image);
        
        return true;
    }

    public function getProductAction() {
        $retVal     = array();
        $request    = $this->getRequest();
        $file       = null;
        $file_name  = null;
        $file_temp  = null;
        $new_path   = null;
        $result     = true;


        if( $request->isPost() ) {
            $postData = $request->getPost();

            try {

                $userId = $this->getUserId();
                $id = (!empty($postData['id']))? $postData['id'] : 0;

                if( empty($userId) ) {
                    $retVal = array(
                        'success'       => false,
                        'errorMessage'  => 'You must be logged in to add a new product'
                    );
                } else {
                    $productsModel = $this->model('Product');

                    $whereClause = array(
                        'product_sell.product_id IS NULL',
                        'product.active' => 1,
                        'product.id' => $id
                    );

                    $result = $productsModel->getProducts($whereClause);

                    $retVal = array(
                        'success'   => true,
                        'message'   => 'Success',
                        'totalRecords'  => count($result),
                        'result'    => (count($result)) ? $result[0] : array()
                    );
                }

            } catch (\Exception $e) {
                $reVal = array(
                    'success'       => false,
                    'errorMessage'  => 'Error processing request. ' . $e->getMessage()
                );
            }
        } else {
            $reVal = array(
                'success'       => false,
                'errorMessage'  => 'Invalid request'
            );
        }

        return new JsonModel($retVal);
    }
}
