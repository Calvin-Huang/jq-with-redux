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
      repos: { page: 1, data: [] },
      bookmarks: [],
    });
  });
});
