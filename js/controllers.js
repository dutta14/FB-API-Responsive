var myApp = angular.module('myApp', ['ngAnimate']);
var fb_access_token = 'EAAaN4efDltMBADH1x4CuoiZAZCS8avaiZAFGmg0ZCx6bNtQwOA4wnwmDZCZBlxw1kTWrQalbOaf4F1152U0vmxpZCK4oh2P4ZBRSgnbcC27cDFRlS6cfwIz2u0i0ITvLykccHadAA6RTlZBBVFoBW5WGiNaqPcfk1uOMZD';

myApp.controller('MyController', function MyController($http, $scope) {
    
    function showPosition(position) {
        $scope.latitude  = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
    }
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    getLocation();
                 
    function httpreq(inpurl, inpparams) {
        $("#progress").show();
        $http({
            method: 'GET',
            url: inpurl,
            params: inpparams
        }).
            then(function success(response) {
                var data = response.data;
                var type = $("li.active").attr("value");
                if (inpurl === "fbapi.php") {
                    console.log(data);
                    $scope.user = data.user;
                    $scope.page = data.page;
                    $scope.event = data.event;
                    $scope.place = data.place;
                    $scope.group = data.group;
                    if (type !== "fav") {
                        $scope.artists = $scope[type].data;
                        $scope.paging =  $scope[type].paging;
                    } else {
                        var key = "dani",
                            obj = localStorage.getItem(key);
        
                        obj = (obj === null) ? {} : JSON.parse(obj);
                        $scope.artists = obj;
                    }
                } else {
                    //pagination for next and previous.
                    $scope[type] = data;
                    $scope.artists = data.data;
                    console.log($scope[type]);
                    $scope.paging =  data.paging;
                }
            
                if ($scope.paging) {
                    $("#prev").css("display", $scope.paging.previous ? "" : "none");
                    $("#next").css("display", $scope.paging.next ? "" : "none");
                }
            
                $("#progress").hide();
                $("table").show();
               
            }, function error(response) {});
    }
    
    $(".table-responsive, #progress, #prev, #next").hide();
    
    $scope.firstpage = function () {
        
        $("#itempage").show();
        $("#detailpage").hide();
        $scope.myValue=true;
        $scope.myValue2=false;
        
        if ($('#searchbox').val() === "") {
            $('#searchbox').tooltip('show');
        } else {
            $(".clearable").show();
            $("#itempage").show();
            $(".table-responsive").show();
            $scope.back = 0;

            $("table, #next, #prev").hide();
            $scope.word = $('#searchbox').val();
            
            var type = $("li.active").attr("value"),
                params = { keyword: $scope.word,
                            type: type,
                            latitude: $scope.latitude,
                            longitude: $scope.longitude};

            $scope.user = $scope.page = $scope.event = $scope.place = $scope.group = $scope.artists = $scope.paging = [];
            httpreq('fbapi.php', params);
        }
    };
    
    $scope.loadtab = function () {
        
        $("#itempage").show();
        $("#detailpage").hide();
        var type = $("li.active").attr("value");
        
        $scope.myValue=true;
        $scope.myValue2=false;
        
        if (type !== 'fav') {
            if ($scope[type] && $scope[type].data && $scope[type].data.length > 0) {
                if ($scope.word !== "") {
                    $(".clearable, table").show();
                    $scope.artists = $scope[type].data;
                    $scope.paging =  $scope[type].paging;
                    if ($scope.paging) {
                        $("#prev").css("display", $scope.paging.previous ? "" : "none");
                        $("#next").css("display", $scope.paging.next ? "" : "none");
                    } else {
                        $("#prev, #next").hide();
                    }
                } else {
                    $("table").hide();
                }
            } else  {
                $("table").hide();
            }
        } else {
            $(".clearable, table").show();
            $("#prev, #next, #progress").hide();
            
            var key = "dani",
                obj = localStorage.getItem(key);
            obj = (obj === null) ? {} : JSON.parse(obj);
            $scope.artists = obj;
        }
    };
    
    function getprofile(id) {
        
       $("#no_album, .album, #no_post, .post").hide();
       $(".detprog").show();
        $http({
            method: 'GET',
            url: 'fbapi.php',
            params: {id: id,
                    type: $("li.active").attr("value")}
        }).
            then(function success(response) {
                console.log(response.data);
                $(".detprog").hide();
                $(".share").show();
                var data = response.data;
                $scope.albums = $scope.posts = [];
                if (data.albums) {
                    $scope.albums = data.albums.data;
                    $("#albums").show();
                    $("#no_album").hide();
                    $("#link0").removeClass("collapsed");
                } else {
                    $("#no_album").show();
                    $("#albums").hide();
                }
            
                if(data.posts) {
                    $scope.posts = data.posts.data;
                    $(".post").show();
                    $("#no_post").hide();
                } else {
                    $("#no_post").show();
                    $(".post").hide();
                }
            }, function error(response) {
                console.log(response);
            });
    }
    
    $scope.showdetails = function (item) {
        $("#itempage").hide();
        $("#detailpage").show();
        $scope.myValue=false;
        $scope.myValue2=true;
        $scope.currentitem = item;
        var id = item.id;
        $scope.currentid = id;
        $scope.findclass(id);
        getprofile(id);
    };
    
    $scope.goback = function () {
        $scope.myValue=true;
        $scope.myValue2=false;
        $("#itempage").show();
        $("#detailpage").hide();
        $scope.loadtab();
    };
    
    $scope.prevpage = function () {
        httpreq($scope.paging.previous, "");
    };
    
    $scope.nextpage = function () {
        httpreq($scope.paging.next, "");
    };
    
    $scope.favorites = function (item) {
        var key = "dani",
            obj = localStorage.getItem(key),
            type = $("li.active").attr("value");
        
        obj = (obj === null) ? {} : JSON.parse(obj);
        
        var star =  $("." + item.id);
        
        star.removeClass();
      
        if (item.id in obj || (type === "fav" && $('.table-responsive').css('display') !== 'block')) {
            delete obj[item.id];
            if (type === "fav") {
                $scope.artists = obj;
            }
            
            star.addClass(item.id + " glyphicon glyphicon-star-empty");
        } else {
            if (!item.type) {
                item.type = type + "s";
            }
            obj[item.id] = item;
            star.addClass(item.id + " glyphicon glyphicon-star yellow");
        }
        var value = JSON.stringify(obj);
        localStorage.setItem(key, value);
            
    };
    
    $scope.findclass = function (id) {
        var key = "dani",
            obj = localStorage.getItem(key),
            type = $("li.active").attr("value"),
            str = id + " glyphicon glyphicon-";
        
        obj = (obj === null) ? {} : JSON.parse(obj);
        if (type === "fav" && $scope.myValue) {
            return str + "trash";
        }
        return (id in obj) ? str + "star yellow" : str + "star-empty";
    };
    
    $scope.clear = function () {
        $("#searchbox").val("");
        $(".clearable").hide();
        $scope.user = $scope.page = $scope.event = $scope.place = $scope.group = $scope.artists = $scope.paging = [];
        $("li").removeClass("active");
        $("li[value='user']").addClass('active');

    };
    
    $scope.notfav = function () {
        var type = $("li.active").attr("value");
        return (type === 'fav') ? "" : "hide";
    };
    
    $scope.getpicture = function (id) {
        var url = "https://graph.facebook.com/v2.8/" + id + "/picture?access_token=" + fb_access_token;
        return url;
    };
    
    $scope.share = function () {
        FB.ui({
            method: 'feed',
            link: "http://cs-server.usc.edu:25447/",
            picture: $scope.currentitem.picture.data.url,
            name: $scope.currentitem.name,
            caption: 'FB SEARCH FROM USC CSCI571'
        }, function (response) {
            if (response && !response.error_message) {
                alert("Posted Successfully");
            } else {
                alert("Not Posted");
            }
        });
    };

    $scope.clear();
    
    $scope.makevisible = function () {
        if ($scope.back === 1) {
            $(".table-hover, .table-responsive").show();
            $("#progress").hide();
        }
    };
    
    $scope.formattime = function (time) {
        return moment(time).format('YYYY-MM-DD hh:mm:ss');
    };
    
    $("#detailpage").hide();
    $scope.myValue=true;
    $scope.myValue2=false;  
    
    $("ul li").click(function() {
        $("ul li").removeClass("active");
        $(this).addClass("active");
    });
    
    $scope.removett = function() {
        $('#searchbox').tooltip('destroy');
    }
});


