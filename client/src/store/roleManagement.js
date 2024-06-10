import store from './store';

// Définir la hiérarchie des rôles
const roleHierarchy = {
  'ADMIN': ['ROLE_STORE_KEEPER', 'USER'],
  'ROLE_STORE_KEEPER': ['USER'],
  'USER': []
};

const hasRole = (role) => {
  const user = store.state.user;
  if (!user) return false;

  const userRole = user.role;
  return checkRole(userRole, role);
};

const checkRole = (userRole, role) => {
  if (userRole === role) return true;
  if (!roleHierarchy[userRole]) return false;

  return roleHierarchy[userRole].some(r => checkRole(r, role));
};
const isAdmin = () => hasRole('ADMIN');
const isStoreKeeper = () => hasRole('ROLE_STORE_KEEPER');
const isUser = () => hasRole('USER');

export { isAdmin, isStoreKeeper, isUser };
