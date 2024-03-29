import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  id;

  constructor(  private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
        this.route.params.subscribe((params) => {this.id = params['id']});
  }

}
