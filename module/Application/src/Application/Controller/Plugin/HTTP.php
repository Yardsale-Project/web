<?php

namespace Application\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;
use \Exception;

class HTTP extends AbstractPlugin {
	/**
	 * Represents our cURL handle.
	 * @param resource $http
	 */
	private $http = null;

	/**
	 * Represents our response array.
	 * @deprecated
	 * @param array $response
	 */
	private $response = null;

	/**
     * @var int Maximum number of times to retry a failed http request
     */
    protected $_maxAttempts = 1;

    /**
     * @var int Time (in seconds) to wait in between retry attempts.
     */
    protected $_retryTimeout = 1;

    /**
     * @var int response http code returned by an http request
     */
    protected $_responseCode = 0;

    private $headers = null;

    /**
	 * Add a curl option
	 *
	 * @param string $url
	 * @param string $request_body
	 * @return array
	 */
	public function addOption($option, $value) {
		curl_setopt($this->http, $option, $value);
	}

	public function init($url) {
		$this->http = curl_init($url);

		return $this;
	}

	/**
	 * Prepares an HTTP POST on the given URL with the provided request body
	 * and content-type, then executes it.
	 *
	 * @param string $url
	 * @param string $request_body
	 * @return array
	 */
	public function executePost( $request_body = null, $displayHeader = TRUE) {
		

		if(isset($request_body)) {
			curl_setopt($this->http, CURLOPT_POSTFIELDS, $request_body);
		}

		$this->executeHttpRequest('POST', $displayHeader);
	}

	/**
	 * Prepares an HTTP PUT on the given URL with the provided request body
	 * and content-type, then executes it.
	 *
	 * @param string $url
	 * @param string $request_body
	 * @return array
	 */
	public function executePut( $request_body = null) {
		

		if(isset($request_body)) {
			curl_setopt($this->http, CURLOPT_POSTFIELDS, $request_body);
		}

		$this->executeHttpRequest('PUT');
	}
        
        /**
	 * Prepares an HTTP PUT on the given URL with the provided request body
	 * and content-type, then executes it.
	 * Currently used for LinkedIn PUT calls only
	 * @param string $url
	 * @param string $request_body
	 * @return array
        */
        public function executePut2( $request_body = null) {
		

		if(isset($request_body)) {
			curl_setopt($this->http, CURLOPT_POSTFIELDS, $request_body);
		}

		$this->executeHttpRequest2('PUT');
	}

   
	/**
	 * Prepares an HTTP GET on the given URL with the provided request body
	 * and content-type, then executes it.
	 *
	 * @param string $url
	 * @param string $request_body
	 * @return array
	 */
	public function executeGet( $request_body = null) {
		

		$this->executeHttpRequest('GET');
	}

	/**
	 * Prepares an HTTP DELETE on the given URL with the provided request body
	 * and content-type, then executes it.
	 *
	 * @param string $url
	 * @param string $request_body
	 * @return array
	 */
	public function executeDelete( $request_body = null, $content_type = null) {
		

		$this->executeHttpRequest('DELETE');
	}

	/**
	 * Prepares an HTTP header on the given URL with the provided header fields.
	 * $headerFields must be an array containing the header fields to set.
	 *  Example: array('Content-type: text/plain', 'Content-length: 100')
	 *
	 * @param string $url
	 * @param array $headerFields
	 */
	public function setHeaders( $headerFields = null) {
		

		if(isset($headerFields)) {
			curl_setopt($this->http, CURLOPT_HTTPHEADER, $headerFields);
		}
	}

	/**
	 * Sets the CURL option for HTTP Basic Authentication
	 *
	 * @param string $url
	 * @param string $username
	 * @param string $password
	 */
	public function setAuthentication( $username = null, $password = null) {
		

		if(isset($username) && isset($password)) {
			curl_setopt($this->http, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
			curl_setopt($this->http, CURLOPT_USERPWD, $username . ":" . $password);
		}
	}

    /**
     * Sets the http variable back to null
     *
     */
    public function resetHttpUrl() {
        $this->http = null;
    }

	/**
	 * Performs the actual HTTP request and returns transaction details.
	 */
	private function executeHttpRequest($verb, $displayHeader = TRUE) {
		$numAttempts = 0;
		$this->_responseCode = 0;

        while (!$this->_responseCode && $numAttempts < $this->_maxAttempts) {
            $numAttempts++;
            switch($verb) {
            	case 'GET':
            		curl_setopt($this->http, CURLOPT_HTTPGET, TRUE);
            		break;
            	case 'POST':
            		curl_setopt($this->http, CURLOPT_POST, TRUE);
            		break;
            	case 'PUT':
            		curl_setopt($this->http, CURLOPT_PUT, TRUE);
            		break;
            	default:
            		curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, $verb);
            		break;
            }
			curl_setopt($this->http, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($this->http, CURLOPT_SSL_VERIFYPEER, FALSE);
			curl_setopt($this->http, CURLOPT_HEADER, $displayHeader);

			$responseBody = curl_exec($this->http);
			$this->_responseCode = curl_getinfo($this->http, CURLINFO_HTTP_CODE);
			$this->response = array('code' => $this->_responseCode, 'body' => $responseBody);

			$header_size = curl_getinfo($this->http, CURLINFO_HEADER_SIZE);
            $header = substr($responseBody, 0, $header_size);
            $body = substr($responseBody, $header_size);

            $this->headers = explode("\r\n", $header);

            if (!$this->_responseCode) {
                sleep($this->_retryTimeout);
            }
        }
	}

    /**
    * Performs the actual HTTP request and returns transaction details.
    * Currently only LinkedIn 'PUT' requests call this function
    */
    private function executeHttpRequest2($verb) {
	$numAttempts = 0;
	$this->_responseCode = 0;

        while (!$this->_responseCode && $numAttempts < $this->_maxAttempts) {
            $numAttempts++;
            switch($verb) {
            	case 'GET':
            		curl_setopt($this->http, CURLOPT_HTTPGET, TRUE);
            		break;
            	case 'POST':
            		curl_setopt($this->http, CURLOPT_POST, TRUE);
            		break;
            	case 'PUT':
            		curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, 'PUT');
            		break;
            	default:
            		curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, $verb);
            		break;
            }
            curl_setopt($this->http, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($this->http, CURLOPT_SSL_VERIFYPEER, FALSE);

            $responseBody = curl_exec($this->http);
            $this->_responseCode = curl_getinfo($this->http, CURLINFO_HTTP_CODE);
            $this->response = array('code' => $this->_responseCode, 'body' => $responseBody);

            if (!$this->_responseCode) {
                sleep($this->_retryTimeout);
            }
        }
    }


	/**
	 * Executes an HTTP POST on the given URL with the provided request body.
	 * @deprecated
	 * @param string $url
	 * @param string $requestBody
	 * @return void
	 */
	public function post($url = '', $requestBody = '') {
		$numAttempts = 0;
		$this->_responseCode = 0;

        while (!$this->_responseCode && $numAttempts < $this->_maxAttempts) {
            $numAttempts++;
            $this->http = curl_init($url);
			curl_setopt($this->http, CURLOPT_POSTFIELDS, $requestBody);
			curl_setopt($this->http, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, 'POST');
			curl_setopt($this->http, CURLOPT_SSL_VERIFYPEER, FALSE);

			$responseBody = curl_exec($this->http);
			$this->_responseCode = curl_getinfo($this->http, CURLINFO_HTTP_CODE);
			$this->response = array('code' => $this->_responseCode, 'body' => $responseBody);

            if (!$this->_responseCode) {
                sleep($this->_retryTimeout);
            }
        }
	}

	/**
	 * Executes an HTTP PUT on the given URL with the provided request body.
	 * @deprecated
	 * @param string $url
	 * @param string $requestBody
	 * @return void
	 */
	public function put($url = '', $requestBody = '') {
		$numAttempts = 0;
		$this->_responseCode = 0;

        while (!$this->_responseCode && $numAttempts < $this->_maxAttempts) {
            $numAttempts++;
            $this->http = curl_init($url);
			curl_setopt($this->http, CURLOPT_POSTFIELDS, $requestBody);
			curl_setopt($this->http, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, "PUT");
			curl_setopt($this->http, CURLOPT_SSL_VERIFYPEER, FALSE);

			$responseBody = curl_exec($this->http);
			$this->_responseCode = curl_getinfo($this->http, CURLINFO_HTTP_CODE);
			$this->response =  array('code' => $this->_responseCode, 'body' => $responseBody);

            if (!$this->_responseCode) {
                sleep($this->_retryTimeout);
            }
        }
	}

	/**
	 * Executes an HTTP GET on the given URL with the provided request body. I'm pretty
	 * sure doing a GET to submit data is a bad practice, but I've seen it done, so the
	 * $requestBody is optional here.
	 * @deprecated
	 * @param string $url
	 * @param string $requestBody
	 * @return void
	 */
	public function get($url = '', $requestBody = '') {
		$numAttempts = 0;
		$this->_responseCode = 0;

        while (!$this->_responseCode && $numAttempts < $this->_maxAttempts) {
            $numAttempts++;
            $this->http = curl_init($url);
			if(strlen($requestBody)) {
				curl_setopt($this->http, CURLOPT_POSTFIELDS, $requestBody);
			}
			curl_setopt($this->http, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, "GET");
			curl_setopt($this->http, CURLOPT_SSL_VERIFYPEER, FALSE);

			$responseBody = curl_exec($this->http);
			$this->_responseCode = curl_getinfo($this->http, CURLINFO_HTTP_CODE);
			$this->response =  array('code' => $this->_responseCode, 'body' => $responseBody);

            if (!$this->_responseCode) {
                sleep($this->_retryTimeout);
            }
        }
	}

	/**
	 * Executes an HTTP DELETE on the given URL with the (optionally) provided request body.
	 * @deprecated
	 * @param string $url
	 * @param string $requestBody
	 * @return void
	 */
	public function delete($url = '', $requestBody = '') {
		$numAttempts = 0;
		$this->_responseCode = 0;

        while (!$this->_responseCode && $numAttempts < $this->_maxAttempts) {
            $numAttempts++;
            $this->http = curl_init($url);
			if(strlen($requestBody)) {
				curl_setopt($this->http, CURLOPT_POSTFIELDS, $requestBody);
			}
			curl_setopt($this->http, CURLOPT_RETURNTRANSFER, TRUE);
			curl_setopt($this->http, CURLOPT_CUSTOMREQUEST, "DELETE");
			curl_setopt($this->http, CURLOPT_SSL_VERIFYPEER, FALSE);

			$responseBody = curl_exec($this->http);
			$this->_responseCode = curl_getinfo($this->http, CURLINFO_HTTP_CODE);
			$this->response =  array('code' => $this->_responseCode, 'body' => $responseBody);

            if (!$this->_responseCode) {
                sleep($this->_retryTimeout);
            }
        }
	}

	/**
	 * Returns the recorded response. This was necessary to make this thing
	 * more easily testable.
	 * @deprecated
	 * @return array
	 */
	 public function getResponse() {
		return $this->response;
	 }

	 public function getHeaders() {
	 	return $this->headers;
	 }

	 public function close() {
	 	curl_close($this->http);
	 }

	public function __destruct() {
		$this->http = null;
		$this->response = null;
		$this->headers = null;
	}
}