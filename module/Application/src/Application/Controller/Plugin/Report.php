<?php

namespace Application\Controller\Plugin;



class Report extends Service\Report
{
	public function printSalesARInvoice($data, $fileName)
	{	

		$headers = array(
			array(
				"label" => "Item Code",
				"width" => 25,
				"align" => "C"
			),
			array(
				"label" => "Description",
				"width" => 64,
				"align" => "L"
			),
			array(
				"label" => "Qty",
				"width" => 15,
				"align" => "R"
			),
			array(
				"label" => "UoM",
				"width" => 20,
				"align" => "L"
			),
			array(
				"label" => "Qty/UoM",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "% Dscnt",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "Gross Total",
				"width" => 30,
				"align" => "R"
			)
		);

		$salesInvoice = $data['salesInvoice'];
		$salesItems = $data['salesInvoiceItems'];

		$adapter = $this->getAdapter();

		$adapter->AliasNbPages();
		$adapter->AddPage();

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Code:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $salesInvoice['customerCode'], 0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Posting Date:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $salesInvoice['postingDate'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Name:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $salesInvoice['customerName'],0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Doc. No.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $salesInvoice['docId'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);

	   	$adapter->Ln();

	   	foreach ($headers as $header) {
	   		$adapter->Cell($header['width'],5 , $header['label'], 0,0, $header['align']);
	   	}

	   	$adapter->Ln();
	   	$adapter->SetFont('Helvetica','',9);
	   	foreach ($salesItems as  $salesItem) {
	   		$adapter->Cell($headers[0]['width'],5 , $salesItem['itemCode'], 0,0, $headers[0]['align']);
	   		$adapter->Cell($headers[1]['width'],5 , $salesItem['description'], 0,0, $headers[1]['align']);
	   		$adapter->Cell($headers[2]['width'],5 , number_format($salesItem['qty']), 0,0, $headers[2]['align']);
	   		$adapter->Cell($headers[3]['width'],5 , $salesItem['saleUoM'], 0,0, $headers[3]['align']);
	   		$adapter->Cell($headers[4]['width'],5 , number_format($salesItem['qtyPrSaleUoM']), 0,0, $headers[4]['align']);
	   		$adapter->Cell($headers[5]['width'],5 , number_format($salesItem['prcntDscnt'],2), 0,0, $headers[5]['align']);
	   		$adapter->Cell($headers[6]['width'],5 , number_format($salesItem['rowGrossTotal'],2), 0,1, $headers[6]['align']);
	   		
	   	}

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->Line(10, $y, 80, $y);
	   	$adapter->Line(135, $y, 205, $y);

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->MultiCell(70, 5, $salesInvoice['remarks2'], 0, 'L');

	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total % Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesInvoice['totalPrcntDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total Amt Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesInvoice['totalAmtDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Net Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesInvoice['netTotal'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Gross Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesInvoice['grossTotal'], 2), 0,1, 'R');
	   	

	    $adapter->Output( $fileName.'.pdf', 'I');
	}

	public function printSalesReturn($data, $fileName)
	{	

		$headers = array(
			array(
				"label" => "Item Code",
				"width" => 25,
				"align" => "C"
			),
			array(
				"label" => "Description",
				"width" => 64,
				"align" => "L"
			),
			array(
				"label" => "Qty",
				"width" => 15,
				"align" => "R"
			),
			array(
				"label" => "UoM",
				"width" => 20,
				"align" => "L"
			),
			array(
				"label" => "Qty/UoM",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "% Dscnt",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "Gross Total",
				"width" => 30,
				"align" => "R"
			)
		);

		$salesReturn = $data['salesReturn'];
		$salesItems = $data['salesReturnItems'];

		$adapter = $this->getAdapter();

		$adapter->AliasNbPages();
		$adapter->AddPage();

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Code:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $salesReturn['customerCode'], 0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Posting Date:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $salesReturn['postingDate'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Name:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $salesReturn['customerName'],0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Doc. No.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $salesReturn['docId'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);

	   	$adapter->Ln();

	   	foreach ($headers as $header) {
	   		$adapter->Cell($header['width'],5 , $header['label'], 0,0, $header['align']);
	   	}

	   	$adapter->Ln();
	   	$adapter->SetFont('Helvetica','',9);
	   	foreach ($salesItems as  $salesItem) {
	   		$adapter->Cell($headers[0]['width'],5 , $salesItem['itemCode'], 0,0, $headers[0]['align']);
	   		$adapter->Cell($headers[1]['width'],5 , $salesItem['description'], 0,0, $headers[1]['align']);
	   		$adapter->Cell($headers[2]['width'],5 , number_format($salesItem['qty']), 0,0, $headers[2]['align']);
	   		$adapter->Cell($headers[3]['width'],5 , $salesItem['saleUoM'], 0,0, $headers[3]['align']);
	   		$adapter->Cell($headers[4]['width'],5 , number_format($salesItem['qtyPrSaleUoM']), 0,0, $headers[4]['align']);
	   		$adapter->Cell($headers[5]['width'],5 , number_format($salesItem['prcntDscnt'],2), 0,0, $headers[5]['align']);
	   		$adapter->Cell($headers[6]['width'],5 , number_format($salesItem['rowGrossTotal'],2), 0,1, $headers[6]['align']);
	   		
	   	}

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->Line(10, $y, 80, $y);
	   	$adapter->Line(135, $y, 205, $y);

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->MultiCell(70, 5, $salesReturn['remarks2'], 0, 'L');

	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total % Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesReturn['totalPrcntDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total Amt Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesReturn['totalAmtDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Net Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesReturn['netTotal'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Gross Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($salesReturn['grossTotal'], 2), 0,1, 'R');
	   	

	    $adapter->Output( $fileName.'.pdf', 'I');
	}

	public function printPurchaseOrder($data, $fileName)
	{	

		$headers = array(
			array(
				"label" => "Item Code",
				"width" => 25,
				"align" => "C"
			),
			array(
				"label" => "Description",
				"width" => 64,
				"align" => "L"
			),
			array(
				"label" => "Qty",
				"width" => 15,
				"align" => "R"
			),
			array(
				"label" => "Base UoM",
				"width" => 20,
				"align" => "L"
			),
			array(
				"label" => "Qty/UoM",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "% Dscnt",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "Gross Total",
				"width" => 30,
				"align" => "R"
			)
		);

		$purchaseOrder = $data['purchaseOrder'];
		$purchaseOrderItems = $data['purchaseOrderItems'];

		$adapter = $this->getAdapter();

		$adapter->AliasNbPages();
		$adapter->AddPage();

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Code:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $purchaseOrder['vendorCode'], 0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Posting Date:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $purchaseOrder['postingDate'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Name:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $purchaseOrder['vendorName'],0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Doc. No.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $purchaseOrder['docId'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);

	   	$adapter->Ln();

	   	foreach ($headers as $header) {
	   		$adapter->Cell($header['width'],5 , $header['label'], 0,0, $header['align']);
	   	}

	   	$adapter->Ln();
	   	$adapter->SetFont('Helvetica','',9);
	   	foreach ($purchaseOrderItems as  $purchaseOrderItem) {
	   		$adapter->Cell($headers[0]['width'],5 , $purchaseOrderItem['itemCode'], 0,0, $headers[0]['align']);
	   		$adapter->Cell($headers[1]['width'],5 , $purchaseOrderItem['description'], 0,0, $headers[1]['align']);
	   		$adapter->Cell($headers[2]['width'],5 , number_format($purchaseOrderItem['qty']), 0,0, $headers[2]['align']);
	   		$adapter->Cell($headers[3]['width'],5 , $purchaseOrderItem['baseUoM'], 0,0, $headers[3]['align']);
	   		$adapter->Cell($headers[4]['width'],5 , number_format($purchaseOrderItem['qtyPrPrchsUoM']), 0,0, $headers[4]['align']);
	   		$adapter->Cell($headers[5]['width'],5 , number_format($purchaseOrderItem['prcntDscnt'],2), 0,0, $headers[5]['align']);
	   		$adapter->Cell($headers[6]['width'],5 , number_format($purchaseOrderItem['rowGrossTotal'],2), 0,1, $headers[6]['align']);
	   		
	   	}

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->Line(10, $y, 80, $y);
	   	$adapter->Line(135, $y, 205, $y);

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->MultiCell(70, 5, $purchaseOrder['remarks2'], 0, 'L');

	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total % Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($purchaseOrder['totalPrcntDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total Amt Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($purchaseOrder['totalAmtDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Net Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($purchaseOrder['netTotal'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Gross Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($purchaseOrder['grossTotal'], 2), 0,1, 'R');
	   	
	   	$adapter->Ln();
	   	$adapter->Ln();

	   	$adapter->SetFont('Helvetica','I',9);
	   	$adapter->Cell(70,5 , 'Prepared By:', 0,0);
	   	$adapter->Cell(70,5 , 'Received By:', 0,1);

	   	$adapter->Ln();
	   	$adapter->Ln();
	   	$adapter->Ln();

	   	$adapter->Line(10, $adapter->GetY(), 60, $adapter->GetY());
	   	$adapter->Line(80, $adapter->GetY(), 130, $adapter->GetY());

	   	$adapter->SetFont('Helvetica','',8);
	   	$adapter->Cell(70,5 , '(Signature over Printed Name/Date)', 0,0);
	   	$adapter->Cell(70,5 , '(Signature over Printed Name/Date)', 0,1);

	    $adapter->Output( $fileName.'.pdf', 'I');
	}

	public function printGRPO($data, $fileName)
	{	

		$headers = array(
			array(
				"label" => "Item Code",
				"width" => 25,
				"align" => "C"
			),
			array(
				"label" => "Description",
				"width" => 64,
				"align" => "L"
			),
			array(
				"label" => "Qty",
				"width" => 15,
				"align" => "R"
			),
			array(
				"label" => "Base UoM",
				"width" => 20,
				"align" => "L"
			),
			array(
				"label" => "Qty/UoM",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "% Dscnt",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "Gross Total",
				"width" => 30,
				"align" => "R"
			)
		);

		$GRPO = $data['GRPO'];
		$GRPOItems = $data['GRPOItems'];

		$adapter = $this->getAdapter();

		$adapter->AliasNbPages();
		$adapter->AddPage();

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Code:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $GRPO['vendorCode'], 0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Posting Date:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $GRPO['postingDate'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(28,5 , 'Customer Name:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $GRPO['vendorName'],0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Doc. No.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $GRPO['docId'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);

	   	$adapter->Ln();

	   	foreach ($headers as $header) {
	   		$adapter->Cell($header['width'],5 , $header['label'], 0,0, $header['align']);
	   	}

	   	$adapter->Ln();
	   	$adapter->SetFont('Helvetica','',9);
	   	foreach ($GRPOItems as  $GRPOItem) {
	   		$adapter->Cell($headers[0]['width'],5 , $GRPOItem['itemCode'], 0,0, $headers[0]['align']);
	   		$adapter->Cell($headers[1]['width'],5 , $GRPOItem['description'], 0,0, $headers[1]['align']);
	   		$adapter->Cell($headers[2]['width'],5 , number_format($GRPOItem['qty']), 0,0, $headers[2]['align']);
	   		$adapter->Cell($headers[3]['width'],5 , $GRPOItem['baseUoM'], 0,0, $headers[3]['align']);
	   		$adapter->Cell($headers[4]['width'],5 , number_format($GRPOItem['qtyPrPrchsUoM']), 0,0, $headers[4]['align']);
	   		$adapter->Cell($headers[5]['width'],5 , number_format($GRPOItem['prcntDscnt'],2), 0,0, $headers[5]['align']);
	   		$adapter->Cell($headers[6]['width'],5 , number_format($GRPOItem['rowGrossTotal'],2), 0,1, $headers[6]['align']);
	   		
	   	}

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->Line(10, $y, 80, $y);
	   	$adapter->Line(135, $y, 205, $y);

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->MultiCell(70, 5, $GRPO['remarks2'], 0, 'L');

	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total % Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($GRPO['totalPrcntDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total Amt Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($GRPO['totalAmtDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Net Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($GRPO['netTotal'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Gross Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($GRPO['grossTotal'], 2), 0,1, 'R');
	   	

	   	$adapter->Ln();
	   	$adapter->Ln();

	   	$adapter->SetFont('Helvetica','I',9);
	   	$adapter->Cell(70,5 , 'Delivered By:', 0,0);
	   	$adapter->Cell(70,5 , 'Checked & Received By:', 0,1);

	   	$adapter->Ln();
	   	$adapter->Ln();
	   	$adapter->Ln();

	   	$adapter->Line(10, $adapter->GetY(), 60, $adapter->GetY());
	   	$adapter->Line(80, $adapter->GetY(), 130, $adapter->GetY());

	   	$adapter->SetFont('Helvetica','',8);
	   	$adapter->Cell(70,5 , '(Signature over Printed Name/Date)', 0,0);
	   	$adapter->Cell(70,5 , '(Signature over Printed Name/Date)', 0,1);

	    $adapter->Output( $fileName.'.pdf', 'I');
	}
	public function printInventoryTransfer($data, $fileName)
	{	

		$headers = array(
			array(
				"label" => "Item Code",
				"width" => 25,
				"align" => "C"
			),
			array(
				"label" => "Description",
				"width" => 64,
				"align" => "L"
			),
			array(
				"label" => "Qty",
				"width" => 15,
				"align" => "R"
			),
			array(
				"label" => "Base UoM",
				"width" => 20,
				"align" => "L"
			),
			array(
				"label" => "Qty/UoM",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "% Dscnt",
				"width" => 20,
				"align" => "R"
			),
			array(
				"label" => "Gross Total",
				"width" => 30,
				"align" => "R"
			)
		);

		$inventoryTransfer = $data['inventoryTransfer'];
		$inventoryTransferItems = $data['inventoryTransferItems'];

		$adapter = $this->getAdapter();

		$adapter->AliasNbPages();
		$adapter->AddPage();

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(10,5 , 'From:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $inventoryTransfer['frmWHouse'], 0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Posting Date:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $inventoryTransfer['postingDate'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(10,5 , 'To:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(118,5 , $inventoryTransfer['toWHouse'],0,0);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(23,5 , 'Doc. No.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , $inventoryTransfer['docId'], 0,1);

	   	$adapter->SetFont('Helvetica','B',9);

	   	$adapter->Ln();

	   	foreach ($headers as $header) {
	   		$adapter->Cell($header['width'],5 , $header['label'], 0,0, $header['align']);
	   	}

	   	$adapter->Ln();
	   	$adapter->SetFont('Helvetica','',9);
	   	foreach ($inventoryTransferItems as  $inventoryTransferItem) {
	   		$adapter->Cell($headers[0]['width'],5 , $inventoryTransferItem['itemCode'], 0,0, $headers[0]['align']);
	   		$adapter->Cell($headers[1]['width'],5 , $inventoryTransferItem['description'], 0,0, $headers[1]['align']);
	   		$adapter->Cell($headers[2]['width'],5 , number_format($inventoryTransferItem['qty']), 0,0, $headers[2]['align']);
	   		$adapter->Cell($headers[3]['width'],5 , $inventoryTransferItem['baseUoM'], 0,0, $headers[3]['align']);
	   		$adapter->Cell($headers[4]['width'],5 , number_format($inventoryTransferItem['qtyPrPrchsUoM']), 0,0, $headers[4]['align']);
	   		$adapter->Cell($headers[5]['width'],5 , number_format($inventoryTransferItem['prcntDscnt'],2), 0,0, $headers[5]['align']);
	   		$adapter->Cell($headers[6]['width'],5 , number_format($inventoryTransferItem['rowGrossTotal'],2), 0,1, $headers[6]['align']);
	   		
	   	}

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->Line(10, $y, 80, $y);
	   	$adapter->Line(135, $y, 205, $y);

	   	$adapter->Ln();

	   	$y = $adapter->GetY();

	   	$adapter->MultiCell(70, 5, $inventoryTransfer['remarks2'], 0, 'L');

	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total % Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($inventoryTransfer['totalPrcntDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Total Amt Disc.:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($inventoryTransfer['totalAmtDscnt'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Net Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($inventoryTransfer['netTotal'], 2), 0,1, 'R');

	   	$y = $adapter->GetY();
	   	$adapter->SetXY(155, $y);

	   	$adapter->SetFont('Helvetica','B',9);
	   	$adapter->Cell(25,5 , 'Gross Total:', 0,0);
	   	$adapter->SetFont('Helvetica','',9);
	   	$adapter->Cell(25,5 , number_format($inventoryTransfer['grossTotal'], 2), 0,1, 'R');
	   	
	   	$adapter->Ln();
	   	$adapter->Ln();

	   	$adapter->SetFont('Helvetica','I',9);
	   	$adapter->Cell(70,5 , 'Delivered By:', 0,0);
	   	$adapter->Cell(70,5 , 'Checked & Received By:', 0,1);

	   	$adapter->Ln();
	   	$adapter->Ln();
	   	$adapter->Ln();

	   	$adapter->Line(10, $adapter->GetY(), 60, $adapter->GetY());
	   	$adapter->Line(80, $adapter->GetY(), 130, $adapter->GetY());

	   	$adapter->SetFont('Helvetica','',8);
	   	$adapter->Cell(70,5 , '(Signature over Printed Name/Date)', 0,0);
	   	$adapter->Cell(70,5 , '(Signature over Printed Name/Date)', 0,1);

	    $adapter->Output( $fileName.'.pdf', 'I');
	}
}