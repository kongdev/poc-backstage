import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
  ApiRef,
  createApiRef,
  OpenIdConnectApi,
  ProfileInfoApi,
  BackstageIdentityApi,
  SessionApi,
  discoveryApiRef,
  oauthRequestApiRef
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api';
// `ProfileInfoApi & BackstageIdentityApi & SessionApi` are required for sign-in
export const oidcAuthApiRef: ApiRef<
  OpenIdConnectApi & // The OICD API that will handle authentication
  ProfileInfoApi & // Profile API for requesting user profile info from the auth provider in question
  BackstageIdentityApi & // Backstage identity API to handle and associate the user profile with backstage identity.
  SessionApi // Session API, to handle the session the user will have while logged in.
> = createApiRef({
  id: 'auth.keycloak', // Can be anything as long as it doesn't conflict with other Api ref IDs
});
export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: oidcAuthApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      oauthRequestApi: oauthRequestApiRef,
      configApi: configApiRef,
    },
    factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
      OAuth2.create({
        discoveryApi,
        oauthRequestApi,
        provider: {
          id: 'keycloak',
          title: 'My custom auth provider',
          icon: () => null,
        },
        environment: configApi.getOptionalString('auth.environment'),
        defaultScopes: ['openid','email','profile'],
        popupOptions: {
          size: {
            // fullscreen: true,
            // or specify popup width and height
            width: 600,
            height: 600,
          },
        },
      }),
  }),
  createApiFactory(
  {
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
];
