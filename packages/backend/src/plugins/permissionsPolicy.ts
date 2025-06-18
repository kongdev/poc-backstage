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
    console.log('user-info', user?.info);
    console.log('request', request);
    // const isVIP = user?.info.startsWith('user:default/vvip'');

    // const { action } = request.permission.attributes;
    // console.log('action---->', action);

    /* =========================== scaffolder-template ====================== */
    // scaffolder.action.execute
    // if (request.permission.name === 'scaffolder.action.execute') {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }

    // // create task
    // if (isPermission(request.permission, taskCreatePermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }
    // // read task response
    // if (isPermission(request.permission, taskReadPermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     console.log('taskReadPermission', taskReadPermission);
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }
    // // cancel task
    // if (isPermission(request.permission, taskCancelPermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }

    // // read  StepRead
    // if (isPermission(request.permission, templateStepReadPermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }
    // // read ParameterRead
    // if (isPermission(request.permission, templateParameterReadPermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }

    // /* =========================== catalog-template ====================== */

    // // catalogLocationCreatePermission
    // if (isPermission(request.permission, catalogLocationCreatePermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }
    // // catalogLocationAnalyzePermission
    // if (isPermission(request.permission, catalogLocationAnalyzePermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }

    // // delete Entity
    // if (isPermission(request.permission, catalogEntityDeletePermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.DENY,
    //     };
    //   }
    // }
    // // create Entity
    // if (isPermission(request.permission, catalogEntityCreatePermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    // }

    // // read Entity
    // if (isPermission(request.permission, catalogEntityReadPermission)) {
    //   if (user?.info.userEntityRef === 'user:default/vvip') {
    //     return {
    //       result: AuthorizeResult.ALLOW,
    //     };
    //   }
    //   // return createCatalogConditionalDecision(
    //   //   request.permission,
    //   //   catalogConditions.isEntityOwner({
    //   //     claims: user?.info.ownershipEntityRefs ?? [],
    //   //   }),
    //   // );
    // }

    //  default
    return {
      result: AuthorizeResult.ALLOW,
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
