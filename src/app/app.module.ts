import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ActionComponent } from './modal/action/action.component';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { EditorComponent } from './editor/editor.component';
import { HeaderComponent } from './modal/header/header.component';
import { ModalLoadComponent } from './modal-load/modal-load.component';
import { ModalNewComponent } from './modal-new/modal-new.component';
import { ModalSaveComponent } from './modal-save/modal-save.component';
import { ToolButtonComponent } from './tool-button/tool-button.component';
import { ZoomSelectorComponent } from './zoom-selector/zoom-selector.component';

@NgModule({
  declarations: [
    ActionComponent,
    AppComponent,
    CanvasComponent,
    ColorPickerComponent,
    EditorComponent,
    HeaderComponent,
    ModalLoadComponent,
    ModalNewComponent,
    ModalSaveComponent,
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
