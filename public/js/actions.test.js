import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import actionCreators, { types } from './actions';

describe('test action behavior', () => {
  // Mock jQuery.
  class jQuery {
    constructor(selector, context) { }
    html() { }
    find() { return this; }
    modal() { return this; }
    text() {}
  }

  describe('when the network request is fine', () => {
    const $ = (selector, context) => new jQuery(selector, context);
    $.templates = () => ({ render: () => { } });
    $.ajax = () => { };
    const mockStore = configureMockStore([thunk]);
    const actions = actionCreators($);

    it('createBookmark action should triggers bookmarkCreated and setReposAreSaved action', () => {
      const store = mockStore({
        repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
        bookmarks: [],
      });

      const expectedActions = [
        { "fullName": "foo/boo", "repoId": 1, "type": "BOOKMARK_CREATED" },

        // There is no reducer included, so bookmarks array stil is empty.
        { "bookmarkIds": [], "type": "SET_REPOS_ARE_SAVED" },
      ];
      store.dispatch(actions.bookmarkCreated(1, 'foo/boo'));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('deleteBookmark action should triggers bookmarkDeleted and setReposAreSaved action', () => {
      const store = mockStore({
        repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
        bookmarks: [{ repo_id: 1, full_name: 'foo/boo' }],
      });

      const expectedActions = [
        { "repoId": 1, "type": "BOOKMARK_DELETED" },

        // There is no reducer included, so bookmarks array stil is not empty.
        { "bookmarkIds": [1], "type": "SET_REPOS_ARE_SAVED" },
      ];
      store.dispatch(actions.deleteBookmark(1));

      expect(store.getActions()).toEqual(expectedActions);
    });

    describe('toggleBookmark action will trigger bookmarkCreated or bookmarkDeleted action', () => {
      it('when bookmark has been saved, trigger deleteBookmark relatived actions', () => {
        const store = mockStore({
          repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
          bookmarks: [{ repo_id: 1, full_name: 'foo/boo' }],
        });

        const expectedActions = [
          { "repoId": 1, "type": "BOOKMARK_DELETED" },
          { "bookmarkIds": [1], "type": "SET_REPOS_ARE_SAVED" },
        ];
        store.dispatch(actions.toggleBookmark(1));

        expect(store.getActions()).toEqual(expectedActions);
      });

      it('when bookmark is not saved, trigger createBookmark relatived actions', () => {
        const store = mockStore({
          repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
          bookmarks: [],
        });

        const expectedActions = [
          { "fullName": "foo/boo", "repoId": 1, "type": "BOOKMARK_CREATED" },
          { "bookmarkIds": [], "type": "SET_REPOS_ARE_SAVED" },
        ];
        store.dispatch(actions.toggleBookmark(1));

        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('when network request failed', () => {
    const errorText = 'Request error';
    const message = 'Failed';
    const $ = (selector, context) => new jQuery(selector, context);
    $.templates = () => ({ render: () => { } });
    $.ajax = ({ error }) => error({ responseJSON: { message: message } }, null, errorText);
    const mockStore = configureMockStore([thunk]);
    const actions = actionCreators($);

    it('createBookmark action should triggers bookmarkCreated, then invoke deleteBookmark because request failed', () => {
      const store = mockStore({
        repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
        bookmarks: [],
      });

      const expectedActions = [
        { "fullName": "foo/boo", "repoId": 1, "type": "BOOKMARK_CREATED" },
        { "bookmarkIds": [], "type": "SET_REPOS_ARE_SAVED" },
        { "message": "Request error: Failed", "type": "SHOW_NOTIFICATION" },
        { "repoId": 1, "type": "BOOKMARK_DELETED" },
        { "bookmarkIds": [], "type": "SET_REPOS_ARE_SAVED" },
      ];
      store.dispatch(actions.createBookmark(1, 'foo/boo'));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('deketeBookmark action should triggers bookmarkDeleted, then invoke createBookmark because request failed', () => {
      const store = mockStore({
        repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
        bookmarks: [{ repo_id: 1, full_name: 'foo/boo' }],
      });

      const expectedActions = [
        { "repoId": 1, "type": "BOOKMARK_DELETED" },
        { "bookmarkIds": [1], "type": "SET_REPOS_ARE_SAVED" },
        { "message": "Request error", "type": "SHOW_NOTIFICATION" },
        { "fullName": "foo/boo", "repoId": 1, "type": "BOOKMARK_CREATED" },
        { "bookmarkIds": [1], "type": "SET_REPOS_ARE_SAVED" },
      ];
      store.dispatch(actions.deleteBookmark(1));

      expect(store.getActions()).toEqual(expectedActions);
    });
  })
});
