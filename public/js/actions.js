(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.actions = global.actions || {})));
}(this, (function (exports) {
  'use strict';

  /**
   * Action types
   */
  const actionTypes = {
    FETCH_PUBLIC_REPOS: 'FETCH_PUBLIC_REPOS',
    RECEIVE_PUBLIC_REPOS: 'RECEIVE_PUBLIC_REPOS',

    FETCH_REPOS_NEXT_PAGE: 'FETCH_REPOS_NEXT_PAGE',

    SET_REPOS_ARE_SAVED: 'SET_REPOS_ARE_SAVED',

    FETCH_BOOKMARKS: 'FETCH_BOOKMARKS',
    RECEIVE_BOOKMARKS: 'RECEIVE_BOOKMARKS',

    TOGGLE_BOOKMARK: 'TOGGLE_BOOKMARK',

    CREATE_BOOKMARK: 'CREATE_BOOKMARK',
    BOOKMARK_CREATED: 'BOOKMARK_CREATED',

    DELETE_BOOKMARK: 'DELETE_BOOKMARK',
    BOOKMARK_DELETED: 'BOOKMARK_DELETED',

    SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  }

  exports.types = actionTypes;
  exports.default = ($) => {

    /**
    * Action creators
    */
    const actions = {
      fetchPublicRepos() {
        return (dispatch, getState) => {
          const state = getState();

          $.getJSON(`https://api.github.com/search/repositories?q=language:javascript&per_page=10&page=${state.page}`)
            .done((data) => {
              dispatch(this.receivePublicRepos(data.items));
            });

          dispatch({ type: actionTypes.FETCH_PUBLIC_REPOS });
        };
      },

      fetchReposNextPage() {
        return dispatch => {
          dispatch({ type: actionTypes.FETCH_PUBLIC_REPOS });
        };
      },

      receivePublicRepos(repos) {
        return (dispatch, getState) => {
          const state = getState();
          dispatch({
            type: actionTypes.RECEIVE_PUBLIC_REPOS,
            repos: repos,
          });
          dispatch(this.setReposAreSaved(state.bookmarks.map(bookmark => bookmark.repo_id)));
        };
      },

      setReposAreSaved(bookmarkIds) {
        return {
          type: actionTypes.SET_REPOS_ARE_SAVED,
          bookmarkIds: bookmarkIds,
        };
      },

      fetchBookmarks() {
        return dispatch => {
          $.getJSON('/api/v1/bookmarks')
            .done((data) => {
              dispatch(this.receiveBookmarks(data));
            });
        };
      },

      receiveBookmarks(bookmarks) {
        return dispatch => {
          dispatch({
            type: actionTypes.RECEIVE_BOOKMARKS,
            bookmarks: bookmarks,
          });
          dispatch(this.setReposAreSaved(bookmarks.map(bookmark => bookmark.repo_id)));
        };
      },

      toggleBookmark(repoId) {
        return (dispatch, getState) => {
          const state = getState();

          if (state.bookmarks.find(bookmark => bookmark.repo_id === repoId)) {
            dispatch(actions.deleteBookmark(repoId));

          } else {
            const repo = state.repos.data.find(repo => repo.id === repoId);
            dispatch(actions.createBookmark(repo.id, repo.full_name));
          }
        };
      },

      createBookmark(repoId, fullName) {
        return (dispatch, getState) => {
          const state = getState();

          dispatch(this.bookmarkCreated(repoId, fullName));

          $.ajax({
            method: 'POST',
            contentType: 'application/json',
            url: '/api/v1/bookmarks',
            data: JSON.stringify({ repo_id: repoId, full_name: fullName }),
            error: (jqXHR, textStatus, error) => {
              dispatch(this.showNotification(`${error}: ${jqXHR.responseJSON.message}`));
              dispatch(this.bookmarkDeleted(repoId));
            },
          });
        }
      },

      bookmarkCreated(repoId, fullName) {
        return (dispatch, getState) => {
          dispatch({
            type: actionTypes.BOOKMARK_CREATED,
            repoId: repoId,
            fullName: fullName,
          });

          const state = getState();

          dispatch(this.setReposAreSaved(state.bookmarks.map(bookmark => bookmark.repo_id)));
        }
      },

      deleteBookmark(repoId) {
        return (dispatch, getState) => {
          const state = getState();

          dispatch(this.bookmarkDeleted(repoId));

          $.ajax({
            method: 'DELETE',
            contentType: 'json',
            url: `/api/v1/bookmarks/${repoId}`,
            error: (jqXHR, textStatus, error) => {
              const repo = state.repos.data.find(repo => repo.id === repoId);

              dispatch(this.showNotification(error));
              dispatch(this.bookmarkCreated(repo.id, repo.full_name));
            },
          });
        }
      },

      bookmarkDeleted(repoId) {
        return (dispatch, getState) => {
          dispatch({
            type: actionTypes.BOOKMARK_DELETED,
            repoId: repoId,
          });

          const state = getState();

          dispatch(this.setReposAreSaved(state.bookmarks.map(bookmark => bookmark.repo_id)));
        }
      },

      showNotification(message) {
        return {
          type: actionTypes.SHOW_NOTIFICATION,
          message: message,
        };
      },
    }

    return Object.assign(actions, { types: actionTypes });
  };

  Object.defineProperty(exports, '__esModule', { value: true });

})));
