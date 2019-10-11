import { NgModule } from '@angular/core';

import {
  MatDialogModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatTabsModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatChipsModule,
  MatSnackBarModule,
  MatTableModule,
  MatPaginatorModule, MatTreeModule,
} from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';
/**
 * NgModule that includes all Material modules.
 */
const MATERIAL_MODULES = [
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  ScrollingModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatGridListModule,
  MatTabsModule,
  MatRadioModule,
  MatAutocompleteModule,
  MatExpansionModule,
  MatChipsModule,
  MatSnackBarModule,
  MatTableModule,
  MatPaginatorModule,
  MatTreeModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }
