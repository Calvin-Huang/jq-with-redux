const middleware = (actionTypes, actions, $) => {
  return store => next => action => {
    const returnValue = next(action);
    const state = store.getState();

    switch (action.type) {
      case actionTypes.FETCH_PUBLIC_REPOS: {
        $.getJSON(`https://api.github.com/search/repositories?q=language:javascript&per_page=10&page=${action.page}`)
          .done((data) => {
            store.dispatch(actions.receivePublicRepos(data.items));
          });

        break;
      }

      case actionTypes.FETCH_REPOS_NEXT_PAGE: {
        store.dispatch(actions.fetchPublicRepos());

        break;
      }

      case actionTypes.FETCH_BOOKMARKS: {
        $.getJSON('/api/v1/bookmarks')
          .done((data) => {
            store.dispatch(actions.receiveBookmarks(data));
          });

        break;
      }

      case actionTypes.RECEIVE_PUBLIC_REPOS:
      case actionTypes.RECEIVE_BOOKMARKS: {
        store.dispatch(actions.setReposAreSaved(state.bookmarks.map(bookmark => bookmark.repo_id)));

        break;
      }

      case actionTypes.TOGGLE_BOOKMARK: {
        if (state.bookmarks.find(bookmark => bookmark.repo_id === action.repoId)) {
          store.dispatch(actions.deleteBookmark(action.repoId));

        } else {
          const repo = state.repos.data.find(repo => repo.id === action.repoId);
          store.dispatch(actions.createBookmark(repo.id, repo.full_name));
        }

        break;
      }

      case actionTypes.CREATE_BOOKMARK: {
        store.dispatch(actions.bookmarkCreated(action.repoId, action.fullName));

        $.ajax({
          method: 'POST',
          contentType: 'application/json',
          url: '/api/v1/bookmarks',
          data: JSON.stringify({ repo_id: action.repoId, full_name: action.fullName }),
          error: (jqXHR, textStatus, error) => {
            store.dispatch(actions.showNotification(`${error}: ${jqXHR.responseJSON.message}`));
            store.dispatch(actions.bookmarkDeleted(action.repoId));
          },
        });

        break;
      }

      case actionTypes.DELETE_BOOKMARK: {
        store.dispatch(actions.bookmarkDeleted(action.repoId));

        $.ajax({
          method: 'DELETE',
          contentType: 'json',
          url: `/api/v1/bookmarks/${action.repoId}`,
          error: (jqXHR, textStatus, error) => {
            const repo = state.repos.data.find(repo => repo.id === action.repoId);

            store.dispatch(actions.showNotification(error));
            store.dispatch(actions.bookmarkCreated(repo.id, repo.full_name));
          },
        });

        break;
      }

      case actionTypes.BOOKMARK_CREATED:
      case actionTypes.BOOKMARK_DELETED: {
        store.dispatch(actions.setReposAreSaved(state.bookmarks.map(bookmark => bookmark.repo_id)));

        break;
      }

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
