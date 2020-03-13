export default function ({store, route, redirect}) {
  const isAdmin = store.getters['users/isAdmin'];
  const isAdminReg = /\/admin\/*/g;

  if(!isAdmin && route.path.match(isAdminReg)) {
    redirect({name: 'index', query: { info: 'only_admin' }});
  }
}

