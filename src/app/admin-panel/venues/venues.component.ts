import {Component, OnInit} from '@angular/core';
import {VenueNode, VenueService} from '../../shared/services/venue.service';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  treeControl = new NestedTreeControl<VenueNode>(node => node.rooms);
  dataSource = new MatTreeNestedDataSource<VenueNode>();

  TREE_DATA = this.venueService.venueTree$;
  selectedNode: VenueNode;

  constructor(
    private venueService: VenueService
  ) {
  }

  ngOnInit() {
    this.TREE_DATA.subscribe(t => {
      if (!this.selectedNode) {
        return;
      }
      console.log(t);
      this.selectedNode = t.find(e => e.code === this.selectedNode.code);
    });
  }

  newBuilding(building) {
    console.log(building);
    this.select(building);
  }

  select(node) {
    this.selectedNode = node;
  }

  selected(node: VenueNode) {
    return this.selectedNode === node;
  }

  hasChild = (_: number, node: VenueNode) => !!node.rooms && node.rooms.length > 0;
}
