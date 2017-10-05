<?php
    require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
        
    $app_id = '1844851255776979';
    $app_secret = '630b106841ef3869026e3bad967941a7';
    $fb_access_token = 'EAAaN4efDltMBADH1x4CuoiZAZCS8avaiZAFGmg0ZCx6bNtQwOA4wnwmDZCZBlxw1kTWrQalbOaf4F1152U0vmxpZCK4oh2P4ZBRSgnbcC27cDFRlS6cfwIz2u0i0ITvLykccHadAA6RTlZBBVFoBW5WGiNaqPcfk1uOMZD';
    $google_api_key = 'AIzaSyA6G2FFlpbX6PABzGC5jEfSVeAb0mm_JjY';
    $google_url = "https://maps.googleapis.com/maps/api/geocode/json?";
           
    $fb = new Facebook\Facebook([
         'app_id' => $app_id,
         'app_secret' => $app_secret,
         'default_graph_version' => 'v2.5',
    ]);
      
    $fb->setDefaultAccessToken($fb_access_token);
    if(isset($_GET["keyword"])) {
        $keyword = $_GET["keyword"];
        $type =  $_GET["type"];
        if(isset($_GET["latitude"])) {
           $latitude = $_GET["latitude"];
           $longitude = $_GET["longitude"];
        }
        $array = ["user","page","event","place","group"];
        $result = [];

        foreach($array as $i) {

            $params =  array('q' => $keyword,
                         'type' => $i,
                         'fields' => 'id,name,picture.width(700).height(700)');


            if($i == "place" && isset($_GET["latitude"]))
              $params['center'] = $latitude.",".$longitude;

            $request = $fb->request('GET', '/search',$params);
            $response = $fb->getClient()->sendRequest($request);
            $result[$i] = json_decode($response->getBody());
        }
        print_r(json_encode($result));
    } else {
        $id = $_GET["id"];
        $type = $_GET["type"];
        if($type === "event") {
            $params = array('fields' => 'posts.limit(5)');
        } else {
            $params = array('fields' => 'albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5)');
        }
        
        $request = $fb->request('GET', "/$id",$params);
        $response = $fb->getClient()->sendRequest($request);
        print_r($response->getBody());
    }
?>