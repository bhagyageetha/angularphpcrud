app.factory('fileUpload', ['$http','$q','$log', function ($http,$q,$log) {
    return{
        uploadFileToUrl:function(file, uploadUrl, name){
        var d=$q.defer();
        var fd = new FormData();
        fd.append('file', file);
        fd.append('sdata', angular.toJson(name));
            $log.log(fd);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined,'Process-Data': false}
            })
            .then(function(data){
                $log.log(data);
                d.resolve(data);
            },function(errorres){
                d.reject(errorres);
            });
            return d.promise;
    }
    }

}]);