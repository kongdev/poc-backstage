import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  AuthorizeResult,
  isPermission,
  isResourcePermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

// catalog
import {
  catalogEntityCreatePermission,
  catalogEntityDeletePermission,
  catalogEntityReadPermission,
  catalogLocationReadPermission,
  catalogLocationCreatePermission,
  catalogLocationAnalyzePermission,
  catalogLocationDeletePermission,
  catalogPermissions,
} from '@backstage/plugin-catalog-common/alpha';
import {
  catalogConditions,
  createCatalogConditionalDecision,
  createCatalogPermissionRule,
} from '@backstage/plugin-catalog-backend/alpha';

// scaffolder
import {
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
  templateStepReadPermission,
  templateParameterReadPermission,
  scaffolderTemplatePermissions,
  scaffolderActionPermissions,
  scaffolderTaskPermissions,
} from '@backstage/plugin-scaffolder-common/alpha';
import {
  scaffolderActionConditions,
  createScaffolderActionConditionalDecision,
} from '@backstage/plugin-scaffolder-backend/alpha';

class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    // Log for debugging
    console.log('Permission request:', request.permission.name);
    console.log('User:', user?.info.userEntityRef);
    
    // Allow all permissions - RBAC plugin will handle the actual authorization
    // This policy acts as a fallback when RBAC doesn't have specific rules
    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

export default createBackendModule({
  pluginId: 'permission',
  // moduleId: 'permission-policy',
  moduleId: 'allow-all-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CustomPermissionPolicy());
      },
    });
  },
});
