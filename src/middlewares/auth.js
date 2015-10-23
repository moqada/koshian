/**
 * 認証ミドルウェア
 *
 * @param {function} getState getState
 * @return {function}
 */
export default function authMiddleware({getState}) {
  return next => action => {
    const state = getState();
    if (state.auth.authToken === '') {
      console.log('Token is Nothing');
    }
    return next(action);
  };
}
