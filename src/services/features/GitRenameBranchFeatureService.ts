import { injectable } from '@wroud/di';
import { GitRepositoriesService } from '../git/GitRepositoriesService.js';
import { SimpleGitRepositoriesService } from '../git/SimpleGitRepositoriesService.js';
import vscode from 'vscode';
import { getRepositoryName } from '../../helpers/getRepositoryName.js';
import { CommandService } from '../base/CommandService.js';
import { isValidBranchName } from '../../helpers/isValidBranchName.js';

@injectable(() => [GitRepositoriesService, SimpleGitRepositoriesService])
export class GitRenameBranchFeatureService extends CommandService {
  constructor(
    private readonly gitRepositoriesService: GitRepositoriesService,
    private readonly simpleGitRepositoriesService: SimpleGitRepositoriesService
  ) {
    super();
    this.renameBranch = this.renameBranch.bind(this);
  }

  async activate(): Promise<void> {
    vscode.commands.registerCommand(
      'git-workspace-helper.renameBranch',
      this.renameBranch
    );
  }

  private async getBranchNames(): Promise<string[]> {
    return this.gitRepositoriesService.getBranchesNames();
  }

  async renameBranch(): Promise<void> {
    const branchesNames = await this.getBranchNames();
    const oldBranchName = (
      await vscode.window.showQuickPick(branchesNames, {
        title: 'Rename Branch',
        placeHolder: 'Select the branch to rename',
      })
    )?.trim();

    if (!oldBranchName) {
      return;
    }

    if (!isValidBranchName(oldBranchName)) {
      vscode.window.showErrorMessage('Invalid old branch name format.');
      return;
    }

    const newBranchName = (
      await vscode.window.showInputBox({
        title: 'Rename Branch',
        placeHolder: 'Enter new branch name',
        prompt: `Renaming "${oldBranchName}"`,
      })
    )?.trim();

    if (!newBranchName) {
      return;
    }

    if (oldBranchName === newBranchName) {
      vscode.window.showErrorMessage(
        'New branch name must be different from the old name.'
      );
      return;
    }

    if (!isValidBranchName(newBranchName)) {
      vscode.window.showErrorMessage(
        'Invalid branch name format. Branch names can only contain letters, numbers, and ._/- characters.'
      );
      return;
    }

    for (const vscodeRepo of this.gitRepositoriesService.activeRepositories) {
      const repoName = getRepositoryName(vscodeRepo);
      if (!repoName) {
        continue;
      }

      const repo = await this.simpleGitRepositoriesService['getSimpleGitRepository'](
        vscodeRepo.rootUri.fsPath
      );

      const branches = await repo.branchLocal();
      if (!branches.all.includes(oldBranchName)) {
        continue;
      }

      if (branches.all.includes(newBranchName)) {
        vscode.window.showErrorMessage(
          `Branch "${newBranchName}" already exists in ${repoName}`
        );
        continue;
      }

      try {
        await repo.raw(['branch', '-m', oldBranchName, newBranchName]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(
          `Failed to rename branch in ${repoName}: ${errorMessage}`
        );
      }
    }
  }
}
