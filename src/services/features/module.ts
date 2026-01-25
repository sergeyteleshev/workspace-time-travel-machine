import { ModuleRegistry, proxy } from '@wroud/di';
import { CommandService } from '../base/CommandService.js';
import { ConfigureActiveRepositoriesFeatureService } from './ConfigureActiveRepositoriesFeatureService.js';
import { GitCheckoutFeatureService } from './GitCheckoutFeatureService.js';
import { GitCreateBranchFeatureService } from './GitCreateBranchFeatureService.js';
import { GitCreateTagFeatureService } from './GitCreateTagFeatureService.js';
import { GitDeleteBranchFeatureService } from './GitDeleteBranchFeatureService.js';
import { GitDeleteTagFeatureService } from './GitDeleteTagFeatureService.js';
import { GitDiscardChangesFeaturesService } from './GitDiscardChangesFeaturesService.js';
import { GitFetchFeatureService } from './GitFetchFeatureService.js';
import { GitMergeFeatureService } from './GitMergeFeatureService.js';
import { GitPullFeatureService } from './GitPullFeatureService.js';
import { GitPushFeatureService } from './GitPushFeatureService.js';
import { GitStageChangesFeatureService } from './GitStageChangesFeatureService.js';
import { GitUnstageChangesFeatureService } from './GitUnstageChangesFeatureService.js';
import { SingleServiceImplementation } from '@wroud/di/types';
import { GitCommitFeatureService } from './GitCommitFeatureService.js';
import { CreateRemoteFeatureService } from './CreateRemoteFeatureService.js';
import { DeleteRemoteFeatureService } from './DeleteRemoteFeatureService.js';
import { GitStashChangesFeatureService } from './GitStashChangesFeatureService.js';
import { GitApplyPopStashFeatureService } from './GitApplyPopStashFeatureService.js';
import { GitStashDropFeatureService } from './GitStashDropFeatireService.js';
import { GitRenameBranchFeatureService } from './GitRenameBranchFeatureService.js';

const SERVICES: SingleServiceImplementation<CommandService>[] = [
  GitCheckoutFeatureService,
  GitCommitFeatureService,
  GitCreateBranchFeatureService,
  GitDeleteBranchFeatureService,
  GitRenameBranchFeatureService,
  GitDiscardChangesFeaturesService,
  ConfigureActiveRepositoriesFeatureService,
  GitMergeFeatureService,
  GitPullFeatureService,
  GitPushFeatureService,
  GitStageChangesFeatureService,
  GitUnstageChangesFeatureService,
  GitCreateTagFeatureService,
  GitDeleteTagFeatureService,
  GitFetchFeatureService,
  CreateRemoteFeatureService,
  DeleteRemoteFeatureService,
  GitStashChangesFeatureService,
  GitApplyPopStashFeatureService,
  GitStashDropFeatureService,
];

ModuleRegistry.add({
  name: 'git-workspace-helper-features-services',
  async configure(serviceCollection) {
    SERVICES.forEach((service) => {
      serviceCollection.addTransient(service);
      serviceCollection.addTransient(CommandService, proxy(service));
    });
  },
});
