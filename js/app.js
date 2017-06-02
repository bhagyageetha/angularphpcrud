var app=angular.module('myApp',['ngRoute']);
app.config(function($routeProvider,$locationProvider) {
	$routeProvider
			.when("/students", {
				templateUrl : "index1.html"
			})
			.when("/insert", {
				templateUrl : "insert.html"
			})
			.when("/update/:id", {
				templateUrl : "update.html",
				controller:"myCtrl1"
				/*resolve:
				{
					getStudentData:function($http,$log,$route,$q)
					{
						var data={};
						var deferred=$q.defer();
						data.id=$route.current.params.id;
						data.action="get_student_data";
						console.log(data);
						$http.post('student.php',data).then(function(response){
							//$log.info(response);
							deferred.resolve(response.data);
						},function(errorresponse){
							deferred.reject(errorresponse);
						});
						return deferred.promise;
					}
				}*/
			})
			.otherwise({
				redirectTo : "/students"
			});
	$locationProvider.html5Mode(true);
});
app.controller('myCtrl',function($scope,$rootScope,$http,$log,$routeParams,baseFactory,$location,fileUpload){
	 $scope.isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    };
	$scope.title="AJ & PHP Testing";
	$rootScope.SUCCESS="success";
	$rootScope.FAILED="failed";
	$rootScope.EMPTY="empty";
		$scope.studentList=function()
		{
			var send={};
			send.action="get_student_list";
			baseFactory.studentCtrl(send)
			.then(function(response1){
				var response = response1.data;
				$log.error(response1);
				if(response.response==$rootScope.SUCCESS)
				{
					$scope.student_lists=response.list;
				}
				else{
					$scope.student_lists=response.list;
				}
			},
			function(errorresponse)
			{
				$log.error('failure Loading',errorresponse);
			});
			
		};
		$scope.studentList();
	$scope.student_files=[];
		$scope.addStudent=function(add_student)
		{
			console.log($scope.student_files);
			add_student.action="add_student_list";
			fileUpload.uploadFileToUrl($scope.student_files,'image_upload.php',add_student)
			.then(function(response1)
			{
				var response = response1.data;
				if(response.response==$rootScope.SUCCESS)
				{
					$scope.msg=response.msg+" and "+response.fileupload;
					alert($scope.msg);
					$location.path("/students");
				}
				else
				{
					$scope.msg=response.msg;
					alert($scope.msg);
				}
			},
				function(errorresponse)
				{
					$log.error('failure Loading',errorresponse);
				});
			
		
		};
		$scope.editStudent=function()
		{
			var id=$routeParams.id;
			edit_student.action="update_student_list";
			baseFactory.studentCtrl(edit_student,{id:$routeParams.id})
			.then(function(response){
				if(response.response==$rootScope.SUCCESS)
				{
					$scope.msg="Student List Updated Successfully";
				}
				else
				{
					$scope.msg="No Student Updated";
				}
				},
			function(errorresponse)
			{
				$log.error('failure Loading',errorresponse);
			});

		};
	$scope.deleteStudent=function(id){
		$log.error('This is Delete Function');
		var data={};
		data.id=id;
		data.action="delete_student_data";
		baseFactory.studentCtrl(data)
				.then(function(res)
				{
					var response=res.data;
					$log.warn(response);
					if(response.response==$rootScope.SUCCESS)
					{
						$scope.msg=response.msg;
						$scope.studentList();
					}
					else
					{
						$scope.msg=response.msg;
					}
					alert($scope.msg);
				},function(err){
					$log.error(err);
				});
	}
});
app.factory('baseFactory',function($http,$log,$q)
{
	return {
				studentCtrl: function (input_data)
				{
					$log.error(input_data);
					var deferred = $q.defer();
					$http.post('student.php', input_data)
							.then(function (data) {
										$log.log(data);
										deferred.resolve(data);
									},
									function (error) {
										deferred.reject(error);
									});
					return deferred.promise;
				}
		}

});
app.controller('myCtrl1',function($scope,$rootScope,$http,$log,$routeParams,baseFactory,$location,fileUpload){
	$log.error("This is Controller");
	$scope.isEmpty = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	};
	$scope.getStudentData=function(id)
	{
		var data={};
		data.id=id;
		data.action="get_student_data";
		baseFactory.studentCtrl(data)
		.then(function(res)
		{
			var response=res.data;
			$log.warn(response);
			if(response.response=="success")
			{
				$scope.edit_student=response.list;
				console.log($scope.edit_student);
			}
		},function(err){
			$log.error(err);
		});
	};
	$scope.student_files1=[];
	$scope.getStudentData($routeParams.id);
	$scope.updateStudent=function(edit_student)
	{
		console.log($scope.student_files1);
		edit_student.action="update_student_list";
		fileUpload.uploadFileToUrl($scope.student_files1,'image_upload.php',edit_student)
				.then(function(response1)
				{
					var response = response1.data;
					$log.info(response);
					$log.error($rootScope.SUCCESS);
				if(response.response==$rootScope.SUCCESS)
				{
					$scope.msg=response.msg+" and "+response.fileupload;
					$location.path("/students");
				}
				else
				{
					$scope.msg=response.msg;
				}
				alert($scope.msg);
			},
			function(errorresponse)
			{
				$log.error('failure Loading',errorresponse);
			});

	};

});
app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

app.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var isMultiple = attrs.multiple;
			var modelSetter = model.assign;
			element.bind('change', function () {
				var values = [];
				angular.forEach(element[0].files, function (item) {
					var value = {
						// File Name
						name: item.name,
						//File Size
						size: item.size,
						//File URL to view
						url: URL.createObjectURL(item),
						// File Input Value
						_file: item
					};
					values.push(value);
				});
				scope.$apply(function () {
					if (isMultiple) {
						modelSetter(scope, values);
					} else {
						modelSetter(scope, element[0].files[0]);
					}
				});
			});
		}
	};
}]);
