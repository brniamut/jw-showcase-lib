/**
 * Copyright 2015 Longtail Ad Solutions Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 **/

(function () {

    angular
        .module('jwShowcase.core')
        .controller('ShareController', ShareController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.ShareController
     *
     * @requires $timeout
     * @requires $location
     * @requires jwShowcase.core.utils
     */
    ShareController.$inject = ['$timeout', '$location', 'utils', 'item', 'config'];
    function ShareController ($timeout, $location, utils, item, config) {

        var vm = this;

        // Determine which base-url to use based on if this is run in the app or in the browser
        var inBrowser = !window.cordova;
        var shareBaseUrl = inBrowser ? $location.host() + ':' + $location.port() : config.appName + '.jwpapp.com';
        var shareUrl = $location.protocol() + '://' + shareBaseUrl + $location.path();

        var providerConfig = {
            facebook: {
                url: utils.composeFacebookLink(shareUrl),
                targetBrowser: '_blank'
            },
            twitter: {
                url: utils.composeTwitterLink(shareUrl, item.title),
                targetBrowser: '_blank'
            },
            email: {
                url: utils.composeEmailLink(shareUrl, item.title),
                targetBrowser: '_self'
            }
        };

        vm.copyResult        = null;
        vm.clickHandler      = clickHandler;

        vm.copyUrl = copyUrl;

        ////////////////

        /**
         * @ngdoc method
         * @name jwShowcase.core.ShareController#copyUrl
         * @methodOf jwShowcase.core.ShareController
         *
         * @description
         * Copies current absolute URL to user's clipboard.
         */
        function copyUrl () {

            if (utils.copyToClipboard($location.absUrl())) {
                vm.copyResult = {text: 'Link copied', success: true};
            }
            else {
                vm.copyResult = {text: 'Failed to copy', success: false};
            }

            $timeout(function () {
                vm.copyResult = null;
            }, 2000);
        }

        function clickHandler(provider) {
            var providerData = providerConfig[provider];
            window.open(providerData.url, inBrowser ? providerData.browserTarget : '_system');
        }
    }

}());
