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
    const store = mockStore({
      repos: { page: 1, data: [{ id: 1, full_name: 'foo/boo' }] },
      bookmarks: [],
    });

    it('createBookmark action should triggers bookmarkCreated and setReposAreSaved action', () => {
      const expectedActions = [
        actions.createBookmark(1, 'foo/boo'),
        actions.bookmarkCreated(1, 'foo/boo'),

        // There is no reducer included, so bookmarks array stil is empty.
        actions.setReposAreSaved([]),
      ]
      store.dispatch(expectedActions[0]);

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
