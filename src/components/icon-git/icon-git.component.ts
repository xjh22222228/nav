import { Component, OnInit } from '@angular/core';
import { GIT_REPO_URL } from '../../../config';

@Component({
  selector: 'app-icon-git',
  templateUrl: './icon-git.component.html',
  styleUrls: ['./icon-git.component.scss']
})
export class IconGitComponent implements OnInit {

  GIT_REPO_URL: string = GIT_REPO_URL

  constructor() { }

  ngOnInit(): void {
  }

}
