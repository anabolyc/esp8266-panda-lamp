(function ($) {
    var app = angular.module("default-app", []); 
    app.controller("data-controller", ['$q', '$http', '$scope', function($q, $http, $scope) {

        var self = $scope;

        var consts = {
            OFFLINE: "offline",
            OFF: "off",
            SWITCHING_ON: "switching-on",
            ON: "on",
            SWITCHING_OFF: "switching-off"
        }

        var config = {
            refreshInterval: 2000,
            failInterval: 3000
        };

        self.pub = {
            state: consts.OFFLINE,
        };

        self.bulbClick = function() {
            console.log("Click!");
            switch (self.pub.state) {
                case consts.OFFLINE:
                    break;
                case consts.ON:
                    off();
                    break;
                case consts.OFF:
                    on();
                    break;
            }
        };
        
        var on = function() {
            self.pub.state = consts.SWITCHING_ON;
            $http({
                method: 'POST',
                url: '/on'
            }).then(function successCallback(response) {
                self.pub.state = consts.ON;
            }, function errorCallback(response) {
                self.pub.state = consts.OFFLINE;
            });
        };

        var off = function() {
            self.pub.state = consts.SWITCHING_OFF;
            $http({
                method: 'POST',
                url: '/off'
            }).then(function successCallback(response) {
                self.pub.state = consts.OFF;
            }, function errorCallback(response) {
                self.pub.state = consts.OFFLINE;
            });
        };

        (updateStatus = function() {
            console.log("Updating status");
            $http({
                method: 'GET',
                url: '/state'
            }).then(function successCallback(response) {
                console.log("...got response", response);
                if (self.pub.state !== consts.SWITCHING_ON && self.pub.state !== consts.SWITCHING_OFF && response.data.hasOwnProperty('state'))
                {
                    if (response.data.state)
                        self.pub.state = consts.ON;
                    else
                        self.pub.state = consts.OFF;
                }
                window.setTimeout(updateStatus, config.refreshInterval);
            }, function errorCallback(response) {
                console.log("...request failed", response);
                self.pub.state = consts.OFFLINE;
                window.setTimeout(updateStatus, config.failInterval);
            });
        })();

    }]);
})(jQuery);