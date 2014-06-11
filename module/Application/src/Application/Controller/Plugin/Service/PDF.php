<?php 

namespace Application\Controller\Plugin\Service;
/**
 * Handles child FPDF class
 * 
 * @author Egee Boy Gutierrez
 * @version 1
 * @package Check up
 */

use Application\Controller\Plugin\FPDF\FPDF;

class PDF extends FPDF
{	
	public $title;
	public $logo;
	
	public function __construct($title, $logo='')
	{
		parent::FPDF();
		
		$this->title = $title;
		
		$this->logo  = $logo;
	}	
	
	public function Header()
	{	
	    $lncolstart = 10;
		
		//Logo
		$this->Image($this->logo,10,8,33, 11);
		
		//Helvetica bold 15
		$this->SetFont('Helvetica','B',12);
		
		//Move to the right
		$this->Cell(40);
		
		//Title		
		$this->Cell(0, 10, $this->title, 0, 0, 'R');
		
		//Line break
		$this->Ln(20);
	    $this->Line($lncolstart, 20, 205, 20);
	}
	
	public function Footer()
	{
		//Position at 1.5 cm from bottom
		$this->SetY(-15);
		
		//Helvetica italic 8
		$this->SetFont('Helvetica','I',8);
		
		//Page number
		$this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
	}
}
