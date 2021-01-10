import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { EditorComponent } from './editor/editor.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ToolButtonComponent } from './tool-button/tool-button.component';
import { ZoomSelectorComponent } from './zoom-selector/zoom-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ColorPickerComponent,
    CanvasComponent,
    ToolButtonComponent,
    ZoomSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
