import {Component, OnInit} from '@angular/core';
import {VenueNode, VenueService} from '../../shared/services/venue.service';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {map} from 'rxjs/operators';
import {Building} from '../../shared/services/models';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss']
})
export class VenuesComponent implements OnInit {
  treeControl = new NestedTreeControl<VenueNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VenueNode>();

  TREE_DATA = this.venueService.newVenues$.pipe(
    map(value => {
      return value.map(building => {
        let i = 0;

        const a = {
          nodeType: 'building',
          name: building.buildingName,
          code: building.buildingCode,
          coordinates: !!building.coordinates ? building.coordinates : undefined,
          children: building.floors ? building.floors.map(floor => {
            const b: any = {
              level: i++,
              nodeType: 'floor',
              name: floor.floorName,
              hasImage: floor.hasImage,
              children: floor.venues ? floor.venues.map(venue => {
                return {
                  nodeType: 'venue',
                  name: venue.venueName,
                  code: venue.venueCode,
                  hasImage: venue.hasImage,
                  coordinates: venue.coordinates ? venue.coordinates : undefined,
                  attributes: venue.attributes,
                };
              }) : [],
            };
            // b.children.push({nodeType: 'new', parent: b});
            return b;
          }) : [],
        };
        a.children.push({nodeType: 'new'});
        for (const child of a.children) {
          child.parent = a;
        }
        return a;
      });
    })
  );
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
      this.selectedNode = t.find(e => this.getFullCode(e) === this.getFullCode(this.selectedNode));
    });
  }

  getFullCode(node: VenueNode) {
    let code = '';
    while (node.parent) {
      code = node.code + code;
      node = node.parent;
    }
    return code;
  }

  newBuilding(building) {
    this.select(building);
  }

  addFloor(node: VenueNode, floorName: string) {
    const building: Building = this.venueService.venues.find((e: Building) => e.buildingCode === node.code);
    building.floors.push({hasImage: false, venues: [], floorName});
    this.venueService.updateBuilding(node.code, building);
  }

  addVenue(node: VenueNode, venueName: string) {
    console.log(node, venueName);
  }

  select(node) {
    if (node && node.nodeType === 'venue') {
      node = node.parent;
    }
    this.selectedNode = node;
    event.stopPropagation();
  }

  selected(node: VenueNode) {
    return this.selectedNode === node;
  }

  canExpand = (_: number, node: VenueNode) => !!node && (node.nodeType === 'building' || node.nodeType === 'floor');
  isNew = (_: number, node: VenueNode) => !!node && node.nodeType === 'new';
}
