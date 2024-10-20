import { Component, Input, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { StudentdocService } from 'services/api/studentdoc/studentdoc.service';
import { LoadingService } from 'services/global/loading.service';
import { StudentDocument } from 'models/istudentdoc.metadata';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-btn',
  templateUrl: './file-btn.component.html',
  styleUrls: ['./file-btn.component.css'],
})
export class FileBtnComponent implements OnInit {
  @Input() document!: StudentDocument;
  @Input() isAccepted: boolean = false;
  @Input() typeDocument: string = '';
  aspiranteId: string | null = null;
  file?: File;

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
    if (this.document && this.document.link) {
      window.open(this.document.link, '_blank');
    } else {
      console.log('Document is not available');
    }
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
