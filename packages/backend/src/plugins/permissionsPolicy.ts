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

// catalog
import {
  catalogEntityCreatePermission,
  catalogEntityDeletePermission,
  catalogEntityReadPermission,
  catalogPermissions,
} from '@backstage/plugin-catalog-common/alpha';
import {
  catalogConditions,
  createCatalogConditionalDecision,
} from '@backstage/plugin-catalog-backend/alpha';

// scaffolder
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
    console.log('request', request);
    // const isVIP = user?.info.startsWith('user:default/vvip'');

    /* =========================== scaffolder-template ====================== */
    // create task
    if (isPermission(request.permission, taskCreatePermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // read task response
    if (isPermission(request.permission, taskReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        console.log('taskReadPermission', taskReadPermission);
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // cancel task
    if (isPermission(request.permission, taskCancelPermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    // read  StepRead
    if (isPermission(request.permission, templateStepReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // read ParameterRead
    if (isPermission(request.permission, templateParameterReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    /* =========================== catalog-template ====================== */
    // delete Entity
    if (isPermission(request.permission, catalogEntityDeletePermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // create Entity
    if (isPermission(request.permission, catalogEntityCreatePermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    // read Entity
    if (isPermission(request.permission, catalogEntityReadPermission)) {
      if (user?.info.userEntityRef === 'user:default/vvip') {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }

    return {
      result: AuthorizeResult.DENY,
    };
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
