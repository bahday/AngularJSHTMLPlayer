(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('playerDirective', playerDirective);

    function playerDirective($window, $templateCache, $compile, $http) {
        var directive = {
            link: link,
            restrict: 'AE',
            replace: true

        };
        return directive;

        function link($scope, element, attrs) {

            var template = '<div  class="panel panel-primary player">' +
                '<div ng-show="ListShowed" class="panel-body body-list">' +
                '<div class="footer"><span ng-click="deleteTrack()" class="delete-btn glyphicon glyphicon-trash"></span><span ng-init="showAdd=false" ng-click="showAdd=true" class="add-btn glyphicon glyphicon-plus"></span>' +
                '<div ng-show="showAdd" class="add-frm"><input ng-model="newName" type="text"/> <button ng-click="addTrack();showAdd=false">OK</button> <button ng-click="showAdd=false">Cancel</button></div></div>' +
                '<div class="list">' +
                '<div ng-repeat="track in tracks" ng-click="setSelected(track);play();" ng-class="track != selectedTrack ? \'track\' : \'selected-track\'" >{{track.source}}</div></div>' +
                '</div><div class="panel-heading">' +
                '<span ng-init="ListShowed=false" ng-click="ListShowed=!ListShowed" class="nav-btn-left glyphicon glyphicon-list"> <label class="duration-value">{{fancyTimeFormat(currentSec)}}/{{fancyTimeFormat(durationSec)}}</label></span>' +
                '<span ng-click="prevTrack()" ng-class="tracks.length>1?\'nav-btn-right glyphicon glyphicon-step-backward\':\'nav-btn-right-disable glyphicon glyphicon-step-backward \'"></span>' +
                '<span   ng-click="played=!played; played ? play() :StopTrack();" ng-class="played?\'nav-btn-play glyphicon glyphicon-pause\':\'nav-btn-play glyphicon glyphicon-play-circle\'" ng-style="{\'color\':tracks.length>0?\'white\':\'grey\'}"></span>' +
                '<span ng-click="nextTrack()" ng-class=" tracks.length>1 ?\'nav-btn-next glyphicon glyphicon-step-forward\':\'nav-btn-next-disable glyphicon glyphicon-step-forward \'"></span>' +
                '<div class="nav-btn-volume "> <div class="slidecontainer-volume">' +
                '<input type="range" min="0" max="100" ng-model="currentVolume" ng-change="changeVolume(currentVolume)" class="slider" >' +
                '<input type="range" min="0" max="100" ng-model="currentVolume" ng-change="changeVolume(currentVolume)" class="slider" ></div><span  ng-click="currentVolume>0?currentVolume=0:currentVolume=100;changeVolume(currentVolume)" ng-class="currentVolume>0 ? currentVolume<60 ? \'nav-vol-btn glyphicon glyphicon-volume-down\':\'nav-vol-btn glyphicon glyphicon-volume-up\':\'nav-vol-btn glyphicon glyphicon-volume-off\'"></span></div>' +
                '<div class="slidecontainer"><input type="range" min="0" max="{{durationSec}}" ng-model="currentSec" ng-change="changeCurrentTime()" class="slider" ></div></div>' +
                '</div></div><audio autobuffer preload="metadata" src="" id="radio" class="hidden" preload="none"></audio>';
            element.html(template);
            $compile(element.contents())($scope);
            var elem = element[0];

            $scope.newName = "http://dl8.mp3party.net/download/8452931";
            $scope.tracks = JSON.parse(attrs.playlist);
            $scope.selectedTrack = $scope.tracks[0];
            $scope.durationSec = 0;
            $scope.currentSec = 0;
            $scope.currentVolume = 100;
            $scope.played = false;
            $scope.fancyTimeFormat = function (time) {
                var hrs = ~~(time / 3600);
                var mins = ~~((time % 3600) / 60);
                var secs = time % 60;
                var ret = "";
                if (hrs > 0) {
                    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
                }
                ret += "" + mins + ":" + (secs < 10 ? "0" : "");
                ret += "" + Math.round(secs);
                return ret;
            }

            $scope.setSelected = function (track) {

                $scope.selectedTrack = track;

            }

            $scope.setDuration = function (value) {

                if (value != $scope.durationSec) {
                    $scope.durationSec = value;
                    $scope.$apply();
                }
            }
            $scope.setCurrent = function (value) {
                if (value != $scope.currentSec) {
                    $scope.currentSec = value;
                    $scope.$apply();
                    if (value == $scope.durationSec) $scope.nextTrack();
                }
            }


            $scope.changeCurrentTime = function () {
                $scope.changeCurrentTime(currentSec);
            }





            $scope.deleteTrack = function () {
                if ($scope.tracks.length > 0) {
                    $scope.StopTrack();
                    $scope.currentSec = 0;
                    $scope.durationSec = 0;


                    let indx = $scope.tracks.indexOf($scope.selectedTrack);
                    $scope.tracks.splice(indx, 1);
                    indx > 0 ? $scope.selectedTrack = $scope.tracks[indx - 1] : $scope.selectedTrack = $scope.tracks[0];

                }
            }
            $scope.addTrack = function () {
                $scope.tracks.push({ source: $scope.newName });
                if ($scope.tracks.length == 1) $scope.selectedTrack = $scope.tracks[0];

            }



            $scope.changeCurrentTime = function () {
                var player = elem.childNodes[1];
                player.currentTime = $scope.currentSec;
            }

            $scope.changeVolume = function (value) {
                var player = elem.childNodes[1];
                player.volume = value * 0.01;
            }

            $scope.PlayTrack = function (source) {
                var player = elem.childNodes[1];
                player.addEventListener("loadeddata", function () {
                    $scope.setDuration(Math.round(player.duration));
                });

                player.addEventListener("timeupdate", function () {

                    $scope.setCurrent(Math.round(player.currentTime));
                });
                if (source != $(player).attr("src")) $(player).attr("src", source);
                player.play();
            }

            $scope.play = function () {
                if ($scope.tracks.length > 0) {
                    $scope.PlayTrack($scope.selectedTrack.source);
                    $scope.played = true;
                } else {
                    $scope.played = false;
                }
            }
            $scope.StopTrack = function () {

                var player = elem.childNodes[1];
                $scope.played = false;
                player.pause();
            }
            $scope.prevTrack = function () {
                if ($scope.tracks.length > 1) {
                    let indx = $scope.tracks.indexOf($scope.selectedTrack) - 1;
                    indx >= 0 ? $scope.selectedTrack = $scope.tracks[indx] : $scope.selectedTrack = $scope.tracks[$scope.tracks.length - 1];
                    $scope.play();
                    $scope.played = true;
                }
            }
            $scope.nextTrack = function () {
                if ($scope.tracks.length > 1) {
                    let indx = $scope.tracks.indexOf($scope.selectedTrack) + 1;
                    indx < $scope.tracks.length ? $scope.selectedTrack = $scope.tracks[indx] : $scope.selectedTrack = $scope.tracks[0];
                    $scope.play();
                    $scope.played = true;
                }
            }
        }
    }
})();