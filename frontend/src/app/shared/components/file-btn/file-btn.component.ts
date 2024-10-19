import { Component, Input, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import { LoadingService } from 'services/global/loading.service';
import Swal from 'sweetalert2';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-file-btn',
  templateUrl: './file-btn.component.html',
  styleUrls: ['./file-btn.component.css'],
})
export class FileBtnComponent implements OnInit {
  @Input() document: { name: string; status: string } = {
    name: '',
    status: 'Pending',
  };
  @Input() isAccepted: boolean = false;
  aspiranteId: string | null = null;
  file?: File;
  typeDocument: string = 'Acta de nacimiento';

  constructor(
    private studentdocService: StudentdocService,
    private _ngxUiLoaderService: NgxUiLoaderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.aspiranteId = localStorage.getItem('aspiranteId')!;

    this.loadingService.loading$.subscribe((isLoading) => {
      if (isLoading) {
        this._ngxUiLoaderService.start();
      } else {
        this._ngxUiLoaderService.stop();
      }
    });
  }

  viewFile() {
    console.log(`Viewing ${this.document.name}`);
  }

  editFile() {
    console.log(`Editing ${this.document.name}`);
  }

  deleteFile() {
    console.log(`Deleting ${this.document.name}`);
  }

  uploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];

      this.loadingService.startLoading();

      this.studentdocService
        .uploadFile(
          this.aspiranteId!,
          this.file,
          this.typeDocument,
          this.file.name
        )
        .subscribe(
          (response) => {
            if (!response.error) {
              this.loadingService.stopLoading();
              setTimeout(() => {
                Swal.fire({
                  title: 'Se ha subido correctamente',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                });
              }, 750);
            } else {
              this.loadingService.stopLoading();
              console.log(response.error + ' ' + response.msg);
              setTimeout(() => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: response.msg,
                });
              }, 750);
            }
          },
          (error) => {
            this.loadingService.stopLoading();
            console.error(error);
          }
        );
    }
  }
}
