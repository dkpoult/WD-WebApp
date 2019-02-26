import { NgModule } from '@angular/core';

import { MatDialogRef, MatDialogModule } from '@angular/material';
/**
 * NgModule that includes all Material modules.
 */
const MATERIAL_MODULES = [
  MatDialogModule,
  MatDialogRef
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }