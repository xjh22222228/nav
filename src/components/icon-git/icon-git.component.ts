import { Component, OnInit } from '@angular/core';
import config from '../../../nav.config';

@Component({
  selector: 'app-icon-git',
  templateUrl: './icon-git.component.html',
  styleUrls: ['./icon-git.component.scss']
})
export class IconGitComponent implements OnInit {

  gitRepoUrl: string = config.gitRepoUrl

  constructor() { }

  ngOnInit(): void {
  }

}
