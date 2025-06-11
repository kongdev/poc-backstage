import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  AuthorizeResult,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

import {
  catalogEntityDeletePermission,
  catalogEntityReadPermission,
} from '@backstage/plugin-catalog-common/alpha';
import {
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
  templateStepReadPermission,
  templateParameterReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import {
  createScaffolderActionConditionalDecision,
  scaffolderActionConditions,
} from '@backstage/plugin-scaffolder-backend/alpha';

class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    console.log('user-info', user?.info);
    console.log('request-permission', request.permission);

    // create scaffolder-template
    if (isPermission(request.permission, taskCreatePermission)) {
      if (user?.info.userEntityRef === 'user:default/kongdev') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    // read scaffolder-template resp
    if (isPermission(request.permission, taskReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/kongdev') {
        console.log('taskReadPermission', taskReadPermission);
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // read scaffolder-template StepRead
    if (isPermission(request.permission, templateStepReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/kongdev') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // read scaffolder-template ParameterRead
    if (isPermission(request.permission, templateParameterReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/kongdev') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    // cancel scaffolder-template
    if (isPermission(request.permission, taskCancelPermission)) {
      if (user?.info.userEntityRef === 'user:default/kongdev') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    if (isPermission(request.permission, catalogEntityReadPermission)) {
      console.log('createCatalogConditionalDecision');
    }

    return { result: AuthorizeResult.ALLOW };
  }
}

export default createBackendModule({
  pluginId: 'permission',
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
