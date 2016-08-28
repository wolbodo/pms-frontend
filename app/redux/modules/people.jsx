import _ from 'lodash';
import { fromJS, Map, is } from 'immutable';

import { apiAction, API } from 'redux/apiWrapper';
import { CLEAR } from './clearState';

import { push } from 'react-router-redux';

const initialState = fromJS({
  items: {},
  updates: {},
  loaded: false,
  fetching: false,
  pushing: false
});

const FETCH = 'pms/people/FETCH';
const FETCH_SUCCESS = 'pms/people/FETCH_SUCCESS';
const FETCH_FAIL = 'pms/people/FETCH_FAIL';

const PUSH = 'pms/people/PUSH';
const PUSH_SUCCESS = 'pms/people/PUSH_SUCCESS';
const PUSH_FAIL = 'pms/people/PUSH_FAIL';

const UPDATE = 'pms/people/UPDATE';
const REVERT = 'pms/people/REVERT';
const CREATE = 'pms/people/CREATE';

const COMMIT_FINISHED = 'pms/people/COMMIT_FINISHED';

export function fetch() {
  return apiAction({
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    uri: 'people'
  });
}

export function update(id, value, key) {
  const _id = id.toString();
  return (dispatch, getState) =>
    dispatch({
      type: UPDATE,
      data: {
        id: _id,
        gid: getState().getIn(['people', 'items', _id, 'gid']),
        value, key
      }
    });
}

export function create() {
  return (dispatch) => {
    const id = Date.now();
    dispatch({
      type: CREATE,
      data: {
        id: id.toString()
      }
    });
    dispatch(push(`/lid-${id}`));
  };
}

export function revert() {
  return {
    type: REVERT
  };
}

export function commit() {
  return (dispatch, getState) => {
    const token = getState().getIn(['auth', 'token']);

    function post(body) {
      // creates new person.
      // TODO: Check for double post...
      return {
        types: [PUSH, PUSH_SUCCESS, PUSH_FAIL],
        uri: 'people',
        promise:
          // Create new person in api.
          API(token, 'people', {
            body
          })
      };
    }

    function put(id, data) {
      // Updates a person with data.
      // Fetches
      return {
        types: [PUSH, PUSH_SUCCESS, PUSH_FAIL],
        uri: `people/${id}`, // For debugging
        promise:
          // fetch the person first, to see whether it has changed.
          API(token, `people/${id}`)
          // Check whether it has been modified
          .then((result) => {
            if (result.status === 304) {
              // Good
            }
            // Should create trigger conflicts.
            // throw new Error('Fail')))

            return API(token, `people/${id}`, {
              method: 'PUT',
              body: data
            });
          })
      };
    }

    const people = getState().get('people');
    // Save all updates
    people.get('updates', new Map())
          .map((person, i) => (
            // Add or update person, whether gid exists.
            people.hasIn(['items', i])
              // Existing person
            ? dispatch(put(i, person))
            // New person
            : dispatch(post(person))
          ));

    // Clear updates locally
    // FIXME: Clear when all commits were successfull.
    dispatch({
      type: COMMIT_FINISHED
    });
  };
}

const reducers = {
  [FETCH]: (people) =>
    people.merge({ fetching: true }),

  [FETCH_SUCCESS]: (people, { data }) =>
    // Create an indexed object with key = Object id
    people.mergeDeep({
      fetching: false,
      loaded: true, // Only set initially, So the ui know it has data.
      items: data.people
    }),

  [FETCH_FAIL]: (people, { error }) =>
    people.merge({ fetching: false, error }),

  [PUSH]: (people) =>
    people.merge({ pushing: true }),

  [PUSH_SUCCESS]: (people, { data }) =>
    people.mergeDeep({
      pushing: false,
      items: data.people
    }),

  [PUSH_FAIL]: (people, { error }) =>
    people.merge({
      pushing: false,
      error
    }),

  [COMMIT_FINISHED]: (people) =>
    people.set('updates', Map()),

  [REVERT]: (people) =>
    people.set('updates', Map()),

  [UPDATE]: (people, { data }) => {
    if (is(people.getIn(['items', data.id, data.key]), fromJS(data.value))) {
      // Remove value from updates, since it returns state to original.
      // If the updates object becomes empty, filter it from the updates object
      return people.deleteIn(['updates', data.id, data.key])
                   .update('updates',
                      (updates) =>
                       updates.filter((upObj) =>
                          !upObj.filter((value, key) => key !== 'gid')
                               .isEmpty()
                       ) // update should contain more than just gid
                    );
    }

    return people.updateIn(
      ['updates', data.id],
      (person = new Map()) => person.merge({
        [data.key]: data.value,
        gid: data.gid
      })
    );
  },

  [CREATE]: (people, { data }) =>
    people.update('updates', (updates) =>
      updates.merge({ [data.id]: {} })),

  [CLEAR]: () => initialState
};

export default (state = initialState, action) =>
  _.get(
    reducers,
    action.type,   // Get type reducer
    (_state) => _state // Default passtrough
  )(state, action);
