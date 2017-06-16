/**
 * Copyright 2017 Longtail Ad Solutions Inc.
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

(function() {
    angular
        .module('jwShowcase.core')
        .service('auth', AuthService);

    AuthService.$inject = ['$firebaseAuth', 'config'];

    function AuthService($firebaseAuth, config) {
        if (!config.options.useAuthentication) {
            return;
        }

        var auth = $firebaseAuth();
        this.firebaseAuth = auth;

        this.getIdentity = function() {
            return auth.$waitForSignIn().then(function() {
                return auth.$getAuth();
            });
        };

        this.hasIdentity = function() {
            return this.getIdentity().then(function(identity) {
                return !!identity;
            });
        };

        this.logout = function() {
            auth.$signOut();
        };

        this.getToken = function() {
            return this.getIdentity().then(function(identity) {
                if (!identity) {
                    return null;
                }

                return identity.getToken();
            });
        };
    }
}());
