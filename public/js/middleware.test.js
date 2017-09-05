import configureMockStore from 'redux-mock-store';

import middleware from './middleware';
import actions, { types } from './actions';

import util from 'util';

describe('test middleware behavior', () => {
  describe('when the network request is fine', () => {

    // Mock jQuery.
    class jQuery {
      constructor(selector, context) {}
      html() {}
    }
    const $ = (selector, context) => new jQuery(selector, context);
    $.ajax = () => {};
    $.templates = () => ({ render: () => {} });

    const mockStore = configureMockStore([middleware(types, actions, $)]);

    it('createBookmark action should triggers bookmarkCreated and setReposAreSaved action', () => {
      const store = mockStore({
        repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
        bookmarks: [],
      });

      const expectedActions = [
        actions.createBookmark(1, 'foo/boo'),
        actions.bookmarkCreated(1, 'foo/boo'),

        // There is no reducer included, so bookmarks array stil is empty.
        actions.setReposAreSaved([]),
      ];
      store.dispatch(expectedActions[0]);

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('deleteBookmark action should triggers bookmarkDeleted and setReposAreSaved action', () => {
      const store = mockStore({
        repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
        bookmarks: [{ repo_id: 1, full_name: 'foo/boo' }],
      });

      const expectedActions = [
        actions.deleteBookmark(1),
        actions.bookmarkDeleted(1),

        // There is no reducer included, so bookmarks array stil is not empty.
        actions.setReposAreSaved([1]),
      ];
      store.dispatch(expectedActions[0]);

      expect(store.getActions()).toEqual(expectedActions);
    });

    describe('toggleBookmark action will trigger bookmarkCreated or bookmarkDeleted action', () => {
      it('when bookmark has been saved, trigger deleteBookmark relatived actions', () => {
        const store = mockStore({
          repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
          bookmarks: [{ repo_id: 1, full_name: 'foo/boo' }],
        });

        const expectedActions = [
          actions.toggleBookmark(1),
          actions.deleteBookmark(1),
          actions.bookmarkDeleted(1),
          actions.setReposAreSaved([1]),
        ];
        store.dispatch(expectedActions[0]);

        expect(store.getActions()).toEqual(expectedActions);
      });

      it('when bookmark is not saved, trigger createBookmark relatived actions', () => {
        const store = mockStore({
          repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
          bookmarks: [],
        });

        const expectedActions = [
          actions.toggleBookmark(1),
          actions.createBookmark(1, 'foo/boo'),
          actions.bookmarkCreated(1, 'foo/boo'),
          actions.setReposAreSaved([]),
        ];
        store.dispatch(expectedActions[0]);

        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
