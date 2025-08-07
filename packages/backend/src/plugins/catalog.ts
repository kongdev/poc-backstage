import {
  GroupTransformer,
  keycloakTransformerExtensionPoint,
  UserTransformer,
} from '@backstage-community/plugin-catalog-backend-module-keycloak';
import { createBackendModule } from '@backstage/backend-plugin-api';

const customGroupTransformer: GroupTransformer = async (
  entity,
  realm,
  groups,
) => {
  /* apply transformations */
  console.log('custom-GroupTransformer-entity', entity)
  console.log('custom-GroupTransformer-realm', realm)
  console.log('custom-GroupTransformer-groups',groups)
  return entity;
};
const customUserTransformer: UserTransformer = async (
  entity,
  user,
  realm,
  groups,
) => {
  /* apply transformations */
  console.log('custom-UserTransformer-entity', entity)
  console.log('custom-UserTransformer-user', user)
  console.log('custom-UserTransformer-realm', realm)
  console.log('custom-UserTransformer-groups',groups)
  return entity;
};

export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'keycloak-custom-transformer',
  register(reg) {
    reg.registerInit({
      deps: {
        keycloak: keycloakTransformerExtensionPoint,
      },
      async init({ keycloak }) {
        keycloak.setUserTransformer(customUserTransformer);
        keycloak.setGroupTransformer(customGroupTransformer);
      },
    });
  },
});