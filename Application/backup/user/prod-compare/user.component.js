angular
	.module('userApp',['ngAnimate', 'oc.lazyLoad', 'ngMaterial', 'md.data.table',  'ngSanitize', 'vAccordion',])
	.component('cogUser', {
		templateUrl: '/components/user/user.html',
		bindings:{
		}
	});