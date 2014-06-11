<?php
	echo "Fetching changes from git server";
	echo exec('git pull origin master');
	echo "Already up to date for test";
?>