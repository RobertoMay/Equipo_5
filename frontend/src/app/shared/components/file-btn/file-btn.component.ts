import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-btn',
  templateUrl: './file-btn.component.html',
  styleUrls: ['./file-btn.component.css'],
})
export class FileBtnComponent {
  @Input() document: { name: string; status: string } = {
    name: '',
    status: 'Pending',
  };
  @Input() isAccepted: boolean = false;

  viewFile() {
    console.log(`Viewing ${this.document.name}`);
  }

  editFile() {
    console.log(`Editing ${this.document.name}`);
  }

  deleteFile() {
    console.log(`Deleting ${this.document.name}`);
  }

  uploadFile() {
    console.log(`Uploading ${this.document.name}`);
  }
}
