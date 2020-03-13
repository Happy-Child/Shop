import JWTDecode from 'jwt-decode';
import cookieparser from 'cookieparser';

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    const blockProcesses = process.server && process.static;
    if(blockProcesses) return;

    const cookie = req.headers.cookie;
    if(!cookie) return;

    const cookies = cookieparser.parse(cookie);
    const access_token = cookies[process.env.access_token];
    if(!access_token) return;

    const { user_id } = JWTDecode(access_token);

    await dispatch(`users/getUserDataOnDB`, user_id);
  }
};
