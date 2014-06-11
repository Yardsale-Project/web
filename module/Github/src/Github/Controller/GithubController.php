<?php

namespace Github\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class GithubController extends AbstractActionController
{
    protected $albumTable;

    public function indexAction()
    {
        echo "Fetching changes from git server<br/>";
        echo exec('git pull origin master') . "<br/>";
    }
}