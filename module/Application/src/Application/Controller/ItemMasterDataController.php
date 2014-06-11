<?php
namespace Application\Controller;

use Application\Controller\Controller;

use Zend\View\Model\JsonModel;
use Zend\Crypt\Password\Bcrypt;

use \Exception;

class ItemMasterDataController extends Controller
{

    public function indexAction()
    {
        $retVal = array(
            'success'       => false,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $model = $this->model('ItemMasterData');
        $result = $model->getItems();

        if(!empty($result))
        {
            $retVal['success'] = true;
            $retVal['rows'] = $result;
            $retVal['totalRecords'] = count($result);
        }


        return new JsonModel($retVal);
    }

    public function getBarcodesByItemAction()
    {
        $retVal = array(
            'success'       => true,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $itemCode = $postData['itemCode'];

            $model = $this->model('Barcode');
            $result = $model->getBarcodeByItem($itemCode);

            if(!empty($result))
            {
                $retVal['success'] = true;
                $retVal['rows'] = $result;
                $retVal['totalRecords'] = count($result);
            }
        }

        return new JsonModel($retVal);
    }

    public function getPriceListByItemAction()
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

            $itemCode = $postData['itemCode'];

            $model = $this->model('Pricelist');
            $result = $model->getPriceListByItem($itemCode);

            if(!empty($result))
            {
                foreach ($result as &$value) {
                    if($value['priceListCode'] == '0')
                    {
                        $value['priceListName'] = 'Purchase price';
                    }
                    else if($value['priceListCode'] == '1')
                    {
                        $value['priceListName'] = 'Retail price';
                    }
                }
                $retVal['success'] = true;
                $retVal['rows'] = $result;
                $retVal['totalRecords'] = count($result);
            }
            else
            {
                $result = array(
                    array(
                        'itemCode'  => $itemCode,
                        'priceListCode' => '0',
                        'priceListName' => 'Purchase price',
                        'netPrice'  => '0'
                    ),
                    array(
                        'itemCode'  => $itemCode,
                        'priceListCode' => '1',
                        'priceListName' => 'Retail price',
                        'netPrice'  => '0'
                    )
                );
            }
        }

        return new JsonModel($retVal);
    }

    public function saveItemAction()
    {
        $retVal = array(
            'success'       => true,
            'rows'          => array(),
            'totalRecords'  => 0
        );

        $request = $this->getRequest();

        if ($request->isPost()) 
        {
            $postData = $request->getPost();

            $itemCode       = (array_key_exists('itemCode', $postData) && !empty($postData['itemCode']))? $postData['itemCode'] : 0;
            $description    = (array_key_exists('description', $postData) && !empty($postData['description']))? $postData['description'] : "";
            $shortName      = (array_key_exists('shortName', $postData) && !empty($postData['shortName']))? $postData['shortName'] : "";
            $vendor         = (array_key_exists('vendor', $postData) && !empty($postData['vendor']))? $postData['vendor'] : "";
            $barcodes       = (array_key_exists('barcodes', $postData) && !empty($postData['barcodes']))? json_decode(stripslashes($postData['barcodes'])) : "";
            $priceList      = (array_key_exists('priceList', $postData) && !empty($postData['priceList']))? json_decode(stripslashes($postData['priceList'])) : "";
            $remarks        = (array_key_exists('remarks', $postData) && !empty($postData['remarks']))? $postData['remarks'] : "";
            $deactivate     = (array_key_exists('deactivate', $postData) && !empty($postData['deactivate']))? $postData['deactivate'] : "";
            $purchaseUoM    = (array_key_exists('purchaseUoM', $postData) && !empty($postData['purchaseUoM']))? $postData['purchaseUoM'] : "";
            $qtyPerPurchaseUoM = (array_key_exists('qtyPerPurchaseUoM', $postData) && !empty($postData['qtyPerPurchaseUoM']))? $postData['qtyPerPurchaseUoM'] : "";
            $saleUoM        = (array_key_exists('saleUoM', $postData) && !empty($postData['saleUoM']))? $postData['saleUoM'] : "";
            $qtyPerSaleUoM  = (array_key_exists('qtyPerSaleUoM', $postData) && !empty($postData['qtyPerSaleUoM']))? $postData['qtyPerSaleUoM'] : "";
            $minStock       = (array_key_exists('minStock', $postData) && !empty($postData['minStock']))? $postData['minStock'] : "";
            $maxStock       = (array_key_exists('maxStock', $postData) && !empty($postData['maxStock']))? $postData['maxStock'] : "";
            $vatable        = (array_key_exists('vatable', $postData) && !empty($postData['vatable']))? $postData['vatable'] : "";
            $variableWeightItem = (array_key_exists('variableWeightItem', $postData) && !empty($postData['variableWeightItem']))? $postData['variableWeightItem'] : "";

            $newId = "";


            if(empty($itemCode))
            {
                $modelDoc = $this->model('Documents');
                $result = $modelDoc->getLastNumberByCode('IMD');
                $newId = $result['newId'];

                $itemCode = $this->_sessionContainer->terminal_id . 'ITM' . $newId;

                $dataToInsert = array(
                    'itemCode'      => $itemCode,
                    'description'   => $description,
                    'shortName'     => $shortName,
                    'vatable'       => (!empty($vatable))? 'Y' : 'N',
                    'vendor'        => $vendor,
                    'deactivated'   => (!empty($deactivate))? 'Y' : 'N',
                    'qtyPrPrchsUoM' => $qtyPerPurchaseUoM,
                    'qtyPrSaleUoM'  => $qtyPerSaleUoM,
                    'prchsUoM'      => $purchaseUoM,
                    'saleUoM'       => $saleUoM,
                    'varWeightItm'  => $variableWeightItem,
                    'remarks'       => $remarks,
                    'minStock'      => $minStock,
                    'maxStock'      => $maxStock,
                    'createDate'    => date('Y-m-d h:i:s'),
                    'createdBy'     => $this->_sessionContainer->user_id
                );

                $modelItem = $this->model('ItemMasterData');
                $result = $modelItem->addItem($data);

                if(!empty($priceList))
                {
                    $modelPriceList = $this->model('Pricelist');

                    foreach ($priceList as $price) {
                        $dataToInsert = array(
                            'itemCode'      => $itemCode,
                            'priceListCode' => $price->code,
                            'netPrice'      => $price->netPrice,
                            'createdBy'     => $this->_sessionContainer->user_id
                        );

                        $result = $modelItem->addPrice($data);
                    }
                }

                if(!empty($barcodes))
                {
                    $model = $this->model('Barcode');

                    foreach ($barcodes as $barcode) {
                        $dataToInsert = array(
                            'itemCode'      => $itemCode,
                            'barcode'       => $barcode,
                            'createDate'    => date('Y-m-d h:i:s'),
                            'createdBy'     => $this->_sessionContainer->user_id
                        );

                        $result = $modelItem->addBarcode($data);
                    }
                }
            }

            /*$itemCode = $postData['itemCode'];

            $model = $this->model('Barcode');
            $result = $model->getBarcodeByItem($itemCode);

            if(!empty($result))
            {
                $retVal['success'] = true;
                $retVal['rows'] = $result;
                $retVal['totalRecords'] = count($result);
            }*/
        }

    }

}
