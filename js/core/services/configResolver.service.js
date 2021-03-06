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
        .service('configResolver', configResolverService);

    /**
     * @ngdoc service
     * @name jwShowcase.core.configResolver
     *
     * @requires $http
     * @required $q
     */
    configResolverService.$inject = ['$http', '$q'];
    function configResolverService ($http, $q) {

        var isDefined     = angular.isDefined,
            isArray       = angular.isArray,
            isString      = angular.isString,
            configPromise = null;

        this.getConfig = getConfig;

        ////////////////////////

        /**
         * Request config.json once. Returns previous promise if request is already in progress.
         * @returns {$q.promise}
         */
        function getConfig () {

            if (!configPromise) {

                if (angular.isObject(window.config)) {
                    return $q.resolve(getConfigComplete({
                        data: window.config
                    }));
                }

                configPromise = $http
                    .get(window.configLocation)
                    .then(getConfigComplete, getConfigFailed);
            }

            return configPromise;
        }

        /**
         * Called after loading config is complete.
         *
         * @param {Object} response
         * @returns {$q.promise|jwShowcase.config}
         */
        function getConfigComplete (response) {

            var config = response.data;

            try {
                // message from hosted container
                if (angular.isString(config.message)) {
                    return $q.reject(new Error(config.message));
                }

                return validateConfig(config);
            }
            catch (error) {
                return $q.reject(error);
            }
        }

        /**
         * Called when loading config fails
         * @returns {$q.Promise}
         */
        function getConfigFailed () {

            return $q.reject(new Error('Failed to load config file'));
        }

        /**
         * Validate config properties
         *
         * @param {Object} config
         * @throws {Error}
         * @returns {jwShowcase.config} config
         */
        function validateConfig (config) {

            var required = ['player', 'theme', 'siteName', 'description'],
                missing;

            missing = required
                .filter(function (value) {
                    return !angular.isString(config[value]);
                });

            if (missing.length > 0) {
                throw new Error('The config file is missing the following properties: ' + missing.join(', '));
            }

            if ('2' !== config.version) {

                // validate as deprecated config
                validateDeprecatedConfig(config);

                // serialize to v2 config
                return serializeDeprecatedConfig(config);
            }

            if (isDefined(config.content) && !isArray(config.content)) {
                throw new Error('The config file content property should be an array');
            }

            return config;
        }

        /**
         * Validate deprecated config properties
         *
         * @param {Object} config
         * @throws {Error}
         * @returns {jwShowcase.config}
         */
        function validateDeprecatedConfig (config) {

            if (isDefined(config.playlists) && !isArray(config.playlists)) {
                throw new Error('The config file playlists property should be an array');
            }

            if (isDefined(config.featuredPlaylist) && !isString(config.featuredPlaylist)) {
                throw new Error('The config file featuredPlaylist property should be a string');
            }
        }

        /**
         * Serialize deprecated config to v2 config
         * @param {Object} config
         * @returns {jwShowcase.config}
         */
        function serializeDeprecatedConfig (config) {

            var fields    = [
                    'player', 'theme', 'siteName', 'description', 'searchPlaylist', 'recommendationsPlaylist',
                    'contentService', 'footerText'
                ],
                options   = [
                    'backgroundColor', 'enableCookieNotice', 'enableContinueWatching', 'enablePlayerAutoFocus',
                    'enableHeader'
                ],
                newConfig = {
                    version: '2',
                    content: [],
                    assets:  {
                        banner: config.bannerImage
                    },
                    options: {}
                },
                featured;

            if (isArray(config.playlists)) {

                newConfig.content = config.playlists.map(function (id) {
                    return {
                        playlistId: id
                    };
                });
            }

            // add featured playlist to content
            if (config.featuredPlaylist) {

                featured = {
                    playlistId: config.featuredPlaylist,
                    featured:   true
                };

                if (isDefined(config.enableFeaturedText)) {
                    featured.enableText = config.enableFeaturedText;
                }

                newConfig.content.unshift(featured);
            }

            // copy root fields
            copyValues(fields, config, newConfig);

            // copy options
            copyValues(options, config, newConfig.options);

            return newConfig;
        }

        /**
         * Copy defined keys from source to target
         * @param {string[]} keys
         * @param {Object} source
         * @param {Object} target
         */
        function copyValues (keys, source, target) {

            angular.forEach(keys, function (key) {
                if (angular.isDefined(source[key])) {
                    target[key] = source[key];
                }
            });
        }
    }

}());
