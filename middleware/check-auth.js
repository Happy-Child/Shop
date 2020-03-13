export default function ({store, redirect}) {
  const isAuth = store.getters['users/isAuth'];
  
  if(!isAuth) {
    redirect({name: 'index', query: { info: 'auth' }});
  }
}

