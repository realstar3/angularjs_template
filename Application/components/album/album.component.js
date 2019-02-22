angular
	.module('albumApp',['ngAnimate', 'oc.lazyLoad', 'ngMaterial', 'md.data.table',  'ngSanitize', 'vAccordion',])
	.component('cogAlbum', {
		templateUrl: '/components/album/album.html',
		bindings:{
		}
	});