export default function ({store, route, redirect}) {
  const isAdmin = store.getters['users/isAdmin'];
  const blockForDefaultUserReg = /\/admin\/*/gi;
  const blockForAdminReg = /\/cart|checkout\/*/gi;

  if(isAdmin) {
    
    if(route.path.match(blockForAdminReg)) {
      redirect({name: 'index', query: { info: 'only_default_user' }});
    }
    
  } else {
    
    if(route.path.match(blockForDefaultUserReg)) {
      redirect({name: 'index', query: { info: 'only_admin' }});
    }
    
  }
}

