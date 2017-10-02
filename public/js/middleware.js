(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.middleware = global.middleware || {})));
}(this, (function (exports) {
  'use strict';

  const middleware = (actionTypes, actions, $) => {
    return store => next => action => {
      const returnValue = next(action);
      const state = store.getState();

      switch (action.type) {
        case actionTypes.SET_REPOS_ARE_SAVED: {
          const repoList = $
            .templates(
            'repo-list',
            { markup: '#repo-list', templates: { repo: $.templates('#repo') } },
          );

          $('#app').html(repoList.render({ repos: state.repos.data }));

          break;
        }

        case actionTypes.SHOW_NOTIFICATION: {
          const modal = $('#notification');
          modal.find('.message').text(action.message);
          modal.modal({ show: true });

          break;
        }
      };
    }
  }

  exports.default = middleware;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
