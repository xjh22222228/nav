// 开源项目，未经作者同意，不得以抄袭/复制代码/修改源代码版权信息。
// Copyright @ 2018-present xiejiahe. All rights reserved.
import config from '../../../nav.config.json'
import { Component, ChangeDetectionStrategy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { settings } from 'src/store'

@Component({
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-icon-git',
  templateUrl: './icon-git.component.html',
  styleUrls: ['./icon-git.component.scss'],
})
export class IconGitComponent {
  gitRepoUrl: string = config.gitRepoUrl.includes('github.com/xjh22222228')
    ? 'https://github.com/xjh22222228/nav'
    : config.gitRepoUrl
  showGithub = settings.showGithub

  constructor() {}
}
