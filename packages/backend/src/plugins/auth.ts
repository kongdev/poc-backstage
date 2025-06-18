import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export default createBackendModule({
  // This ID must be exactly "auth" because that's the plugin it targets
  pluginId: 'auth',
  // This ID must be unique, but can be anything
  moduleId: 'keycloak',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          // This ID must match the actual provider config, e.g. addressing
          // auth.providers.azure means that this must be "azure".
          providerId: 'keycloak',
          // Use createProxyAuthProviderFactory instead if it's one of the proxy
          // based providers rather than an OAuth based one
          factory: createOAuthProviderFactory({
            // For more info about authenticators please see https://backstage.io/docs/auth/add-auth-provider/#adding-an-oauth-based-provider
            authenticator: oidcAuthenticator,
            async signInResolver(info: any, ctx) {
              const userEntityRef = stringifyEntityRef({
                kind: 'User',
                name: info?.result.fullProfile.userinfo
                  .preferred_username as string,
                namespace: DEFAULT_NAMESPACE,
              });

              const groups: string[] =
                info?.result.fullProfile.userinfo?.userGroup || [];
              console.log('userEntityRef:', userEntityRef);
              console.log('userGroup:', groups);

              // Map groups to ownership entity references
              const ownershipRefs: string[] = groups.map(
                (g: string) =>
                  `group:${DEFAULT_NAMESPACE}/${g.replace('/', '')}`,
              );
              console.log('ownershipRefs : ', ownershipRefs);
              console.log('info', info?.result);

              return ctx.issueToken({
                claims: {
                  sub: userEntityRef, // The user's own identity
                  ent: ownershipRefs, // A list of identities that the user claims ownership through
                },
              });
            },
          }),
        });
      },
    });
  },
});
