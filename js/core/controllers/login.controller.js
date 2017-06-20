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

(function () {

    angular
        .module('jwShowcase.core')
        .controller('LoginController', LoginController);

    /**
     * @ngdoc controller
     * @name jwShowcase.core.LoginController
     *
     * @requires popupInstance
     */
    LoginController.$inject = ['auth', 'popupInstance', 'config', 'popup'];
    function LoginController (auth, popupInstance, config, popup) {

        var vm = this;

        vm.providers = config.options.authenticationProviders;
        vm.user = {};
        vm.errors = [];

        vm.logInWithProvider = logInWithProvider;
        vm.logInWithEmail = logInWithEmail;
        vm.signUp = signUp;

        function logInWithProvider(provider) {
            auth.firebaseAuth.$signInWithPopup(provider).then(function (result) {
                popupInstance.close(true);
            }).catch(function (error) {
                vm.errors.push(error);
            });
        }

        function logInWithEmail(email, password) {
            auth.firebaseAuth.$signInWithEmailAndPassword(email, password).then(function (result) {
                popupInstance.close(true);

                if (!result.emailVerified) {
                    popup.alert('You have not verified your email address yet.');
                    auth.firebaseAuth.$signOut();
                }

            }).catch(function () {
                vm.errors = [];
                vm.errors.push({message: 'Your email or password is wrong. Please try again!'});
            });
        }

        function signUp() {
                popup.show({
                    controller: 'SignupController as vm',
                    templateUrl: 'views/core/popups/signup.html',
                    resolve: {
                        config: config
                    }
                });
            popupInstance.close(true);

        }
    }

}());
