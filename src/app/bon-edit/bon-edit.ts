import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Receipt, Labels } from './../app';

@Component({
  selector: 'app-bon-edit',
  imports: [FormsModule],
  templateUrl: './bon-edit.html',
  styleUrl: './bon-edit.css',
})
export class BonEdit {
  @Input() receipt: Receipt = {
    meta: { date: '', cardnumber: '', cardholder: '', issuer: '', style: '' },
    artist: { name: '', logo: '', claim: '' },
    songlist: { title: '', showHeader: true, showQuantity: true, total: '', tracks: [] },
  };
  @Input() labels: Labels | undefined;

  newTrack() {
    let tracks: number = this.receipt.songlist.tracks.length + 1;
    this.receipt.songlist.tracks.push({ title: '', length: '', order: tracks });
  }

  deleteTrack() {
    if (this.receipt.songlist.tracks.length > 0) {
      this.receipt.songlist.tracks.splice(-1);
    }
  }
}
