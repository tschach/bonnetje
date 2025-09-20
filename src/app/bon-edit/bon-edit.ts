import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Receipt, Labels } from './../app';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-bon-edit',
  imports: [FormsModule, JsonPipe],
  templateUrl: './bon-edit.html',
  styleUrl: './bon-edit.css',
})
export class BonEdit {
  self = this;

  @Input() receipt: Receipt = {
    meta: { date: '', cardnumber: '', cardholder: '', issuer: '', style: '' },
    artist: { name: '', logo: '', logodata: '', claim: '' },
    songlist: { title: '', showHeader: true, showQuantity: true, total: '', tracks: [] },
  };
  @Input() labels: Labels | undefined;

  ngDoCheck() {
    localStorage.setItem('bonnetjeAutoSave', JSON.stringify(this.receipt));
  }

  newTrack() {
    let tracks: number = this.receipt.songlist.tracks.length + 1;
    this.receipt.songlist.tracks.push({ title: '', length: '', order: tracks });
  }

  deleteTrack() {
    if (this.receipt.songlist.tracks.length > 0) {
      this.receipt.songlist.tracks.splice(-1);
    }
  }

  // https://stackoverflow.com/a/20285053
  logoToBase64(event: any) {
    let receipt2 = this.receipt;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      receipt2.artist.logodata = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
