import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from '../upload.service';
import { forkJoin } from 'rxjs';
import { DayService } from '../day.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('file') file;
  public files: Set<File> = new Set();

  form: FormGroup;
  description: string;
  upload_for;

  progress;
  canBeClosed = true;
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  all_days = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data, private uploadService: UploadService,
    private dayService: DayService) {

    this.description = data.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
      description: [this.description, []],
      upload_for: [this.upload_for, []]
    });

    this.dayService.get_all_days().subscribe((x) => {
      this.all_days = x as any[];
    })
  }

  save() {
    if (this.form.invalid) { return; }
    if (this.files == undefined) { return; }
    // if everything was uploaded already, just close the dialog
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }
    if (this.all_days.length == 0 && this.form.value.upload_for != 0) { return; }

    // set the component state to "uploading"

    let date = new Date();
    let curDate = date;
    date.setDate(date.getDate() + this.form.value.upload_for);

    let latest_day = 1;



    if (date != curDate) {
      let allowed = false;
      let ac_date = date;
      ac_date.setDate(ac_date.getDate() - 1);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.all_days.length; i++) {
        if (this.all_days[i].day > latest_day) {
          latest_day = this.all_days[i].day;
        }

        if (ac_date == this.all_days[i].creationDate) {
          allowed = true;
        }
      }
      if (allowed == false) { return; }
    }

    this.dayService.create_day(latest_day, this.form.value.description, curDate.toString(), date.toString()).subscribe((x) => {
      // start the upload and save the progress map
      this.uploading = true;
      this.progress = this.uploadService.upload(this.files);

      // convert the progress map into an array
      let allProgressObservables = [];
      // tslint:disable-next-line: forin
      for (let key in this.progress) {
        allProgressObservables.push(this.progress[key].progress);
      }

      // Adjust the state variables

      // The dialog should not be closed while uploading
      this.canBeClosed = false;
      this.dialogRef.disableClose = true;

      // Hide the cancel-button
      this.showCancelButton = false;

      // When all progress-observables are completed...
      forkJoin(allProgressObservables).subscribe(end => {
        // ... the dialog can be closed again...
        this.canBeClosed = true;
        this.dialogRef.disableClose = false;

        // ... the upload was successful...
        this.uploadSuccessful = true;
        this.dialogRef.close(this.form.value);
        // ... and the component is no longer uploading
        this.uploading = false;
      });
      //t
    })
  }

  close() {
    this.dialogRef.close();
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }
}
