(function () {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['lockPasswordless', 'authManager', '$q', '$state'];

  function authService(lockPasswordless, authManager, $q, $state) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || null;
    var deferredProfile = $q.defer();

    if (userProfile) {
      deferredProfile.resolve(userProfile);
    }

    function login() {
      lockPasswordless.emailcode(function(error, profile, id_token) {
        if (error) {
          alert("Error: " + error);
          return;
        }
        localStorage.setItem('id_token', id_token);
        authManager.authenticate();
        localStorage.setItem('profile', JSON.stringify(profile));

        deferredProfile.resolve(profile);
        $state.go('home');
        lockPasswordless.close();
      });

      lock.on('authorization_error', function (err) {
        console.log(err);
      });
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      deferredProfile = $q.defer();
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = null;
    }

    function getProfileDeferred() {
      return deferredProfile.promise;
    }

    return {
      login: login,
      logout: logout,
      getProfileDeferred: getProfileDeferred
    }
  }
})();
