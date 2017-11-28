var app = angular.module('myApp', []);
app.controller("PlayerCtrl", PlayerCtrl);



function PlayerCtrl($scope) {
	vm = this;
	vm.newName = "http://dl.mp3party.net/download/8517238";
	vm.tracks = [{ source: "http://dl8.mp3party.net/download/8452931" }, { source: "http://dl11.mp3party.net/download/8503979" }, { source: "http://dl11.mp3party.net/download/8503938" }];
};