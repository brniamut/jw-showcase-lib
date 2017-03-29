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

    /**
     * @ngdoc overview
     * @name jwShowcase.core
     *
     * @description
     * Application's core module
     */
    angular
        .module('jwShowcase.core', [])
        .run(run)
        .config(config);

    config.$inject = ['$stateProvider', '$urlMatcherFactoryProvider', 'seoProvider', 'historyProvider'];
    function config ($stateProvider, $urlMatcherFactoryProvider, seoProvider, historyProvider) {

        $urlMatcherFactoryProvider
            .strictMode(false);

        historyProvider
            .setDefaultState('root.dashboard');

        $stateProvider
            .state('root', {
                abstract:    true,
                resolve:     {
                    preload: 'preload'
                },
                templateUrl: 'views/core/root.html'
            });

        seoProvider
            .otherwise(['$location', 'config', function ($location, config) {
                return {
                    title:       config.siteName,
                    description: config.description,
                    canonical:   $location.absUrl()
                };
            }]);
    }

    run.$inject = ['history'];
    function run (history) {
        history.attach();
    }

    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
        angular.element(document.body).addClass('platform-touch');
    }

}());
