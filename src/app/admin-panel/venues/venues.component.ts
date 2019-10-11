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
  }

  select(item) {
    this.selectedNode = item;
  }

  selected(node: VenueNode) {
    return this.selectedNode === node;
  }

  childSelected(node: VenueNode) {
    if (!node.rooms) {
      return false;
    }
    for (const child of node.rooms) {
      if (this.selectedNode === child) {
        return true;
      }
    }
  }

  hasChild = (_: number, node: VenueNode) => !!node.rooms && node.rooms.length > 0;
}
