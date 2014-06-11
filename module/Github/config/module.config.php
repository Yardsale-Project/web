<?php

return array(
    'controllers' => array(
        'invokables' => array(
            'Github\Controller\Github' => 'Github\Controller\GithubController',
        ),
    ),

    'router' => array(
        'routes' => array(
            'github' => array(
                'type'    => 'segment',
                'options' => array(
                    'route'    => '/github[/:action][/:id]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'Github\Controller\Github',
                        'action'     => 'index',
                    ),
                ),
            ),
        ),
    )
);