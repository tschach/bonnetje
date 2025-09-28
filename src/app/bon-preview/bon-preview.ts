import { Component, Input, SimpleChanges } from '@angular/core';
import { Receipt, Labels } from './../app';

@Component({
  selector: 'app-bon-preview',
  imports: [],
  templateUrl: './bon-preview.html',
  styleUrl: './bon-preview.css',
})
export class BonPreview {
  @Input() receipt: Receipt = {
    mode: '',
    meta: { date: '', cardnumber: '', cardholder: '', issuer: '', style: '', font: '', text: '', text2: '' },
    artist: { name: '', logo: '', logodata:'', claim: '', claim2: ''  },
    concert: { city: '', country: '', venue: '', festival: '', tour: '' },
    songlist: { title: '', showHeader: true, showQuantity: true, total: '', tracks: [] },
  };
  @Input() labels: Labels | undefined;

  seconds: number = 0;

  styleCssClass: string | undefined

  ngDoCheck(changes: SimpleChanges) {
    const styleToCssClass = new Map<string, string>([
      ['CRUMPLED', 'crumbled'],
      ['PLAIN', 'plain'],
      ['FADED', 'faded']
    ]);

    this.seconds = 0;
    this.receipt.songlist.tracks?.forEach((element) => {
      let time = element.length.split(':');
      if (time[0] && time[0].length > 0 && time[1] && time[0].length > 0) {
        this.seconds += parseInt(time[0]) * 60 + parseInt(time[1]);
      }
    });

    let minutes = Math.floor(this.seconds / 60);
    this.receipt.songlist.total =
      minutes + ':' + ('0000' + (this.seconds - minutes * 60)).slice(-2);

      this.styleCssClass = styleToCssClass.get(this.receipt.meta.style)
    }

}
