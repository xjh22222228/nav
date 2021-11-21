// Copyright @ 2018-2021 xiejiahe. All rights reserved. MIT license.

import { Component, OnInit } from '@angular/core';
import config from '../../../nav.config';
import { settings } from 'src/store'

@Component({
  selector: 'app-icon-git',
  templateUrl: './icon-git.component.html',
  styleUrls: ['./icon-git.component.scss']
})
export class IconGitComponent implements OnInit {

  gitRepoUrl: string = config.gitRepoUrl
  showGithub = settings.showGithub

  constructor() { }

  ngOnInit(): void {
  }
}
