const reducers = (actionTypes, redux) => {

  /**
   * Reducers
   */
  function repos(state = { page: 1, data: [] }, action) {
    switch (action.type) {
      case actionTypes.NEXT_PAGE:
        return Object.assign(state, { page: state.page + 1 });

      case actionTypes.RECEIVE_PUBLIC_REPOS:
        return Object.assign(state, { data: state.data.concat(action.repos) });

      case actionTypes.SET_REPOS_ARE_SAVED:
        return Object.assign(
          state,
          {
            data: state.data.map(repo => (
              Object.assign(repo, { is_saved: action.bookmarkIds.includes(repo.id) })
            ))
          }
        );

      default:
        return state;
    }
  }

  function bookmarks(state = [], action) {
    switch (action.type) {
      case actionTypes.RECEIVE_BOOKMARKS:
        return state.concat(action.bookmarks);

      case actionTypes.BOOKMARK_CREATED:
        return state.concat({ repo_id: action.repoId, full_name: action.fullName });

      case actionTypes.BOOKMARK_DELETED:
        return state.filter(bookmark => bookmark.repo_id !== action.repoId);

      default:
        return state;
    }
  }

  function lastAction(state = null, action) {
    return action;
  }

  return Redux.combineReducers({
    repos: repos,
    bookmarks: bookmarks,
    lastAction: lastAction,
  });
}