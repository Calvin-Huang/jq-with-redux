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

/**
 * Action creators
 */
const actions = {
  fetchPublicRepos: () => ({
    type: actionTypes.FETCH_PUBLIC_REPOS,
  }),

  receivePublicRepos: (repos) => ({
    type: actionTypes.RECEIVE_PUBLIC_REPOS,
    repos: repos,
  }),

  fetchReposNextPage: () => ({
    type: actionTypes.FETCH_REPOS_NEXT_PAGE,
  }),

  setReposAreSaved: (bookmarkIds) => ({
    type: actionTypes.SET_REPOS_ARE_SAVED,
    bookmarkIds: bookmarkIds,
  }),

  fetchBookmarks: () => ({
    type: actionTypes.FETCH_BOOKMARKS,
  }),

  receiveBookmarks: (bookmarks) => ({
    type: actionTypes.RECEIVE_BOOKMARKS,
    bookmarks: bookmarks,
  }),

  toggleBookmark: (repoId) => ({
    type: actionTypes.TOGGLE_BOOKMARK,
    repoId: repoId,
  }),

  createBookmark: (repoId, fullName) => ({
    type: actionTypes.CREATE_BOOKMARK,
    repoId: repoId,
    fullName: fullName,
  }),

  bookmarkCreated: (repoId, fullName) => ({
    type: actionTypes.BOOKMARK_CREATED,
    repoId: repoId,
    fullName: fullName,
  }),

  deleteBookmark: (repoId) => ({
    type: actionTypes.DELETE_BOOKMARK,
    repoId: repoId,
  }),

  bookmarkDeleted: (repoId) => ({
    type: actionTypes.BOOKMARK_DELETED,
    repoId: repoId,
  }),

  showNotification: (message) => ({
    type: actionTypes.SHOW_NOTIFICATION,
    message: message,
  }),
}