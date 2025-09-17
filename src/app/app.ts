import { Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BonEdit } from './bon-edit/bon-edit';
import { BonPreview } from './bon-preview/bon-preview';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BonEdit, BonPreview],
  templateUrl: './app.html',
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected readonly title = signal('bonnetje');
  public labels: Labels = {
    tracknumber: '#',
    tracktitle: 'item',
    tracklength: 'amt',
    cardnumber: 'card',
    cardholder: 'cardholder',
    issuer: 'issuer',
    date: 'date',
    itemcount: 'item count',
    total: 'total'
  };
  public receipt: Receipt = {
    meta: {
      date: '2025-08-21',
      cardnumber: '####-####-####-2018',
      cardholder: 'STAY',
      issuer: 'JYP ENTERTAINMENT',
      style: 'PLAIN'
    },
    artist: {
      name: 'Stray Kids',
      logo: '/Stray-Kids-Emblem-712943836.png',
      claim: 'Stray Kids everywhere all around the world'
    },
    songlist: {
      title: 'Karma',
      showHeader: false,
      showQuantity: false,
      total: '',
      tracks: [
        { order: 1, title: 'Bleep', length: '2:47' },
        { order: 2, title: 'Ceremony', length: '2:44' },
        { order: 3, title: 'Creed', length: '2:41' },
        { order: 4, title: 'Mess', length: '3:29' },
        { order: 5, title: 'In My Head', length: '2:56' },
        { order: 6, title: 'Half Time', length: '2:50' },
        { order: 7, title: 'Phoenix', length: '3:02' },
        { order: 8, title: 'Ghost', length: '2:33' },
        { order: 9, title: '0801', length: '3:24' },
        { order: 10, title: 'Ceremony (festival ver.)', length: '2:52' },
        { order: 11, title: 'Ceremony (english ver.)', length: '2:44' }
      ],
    },
  };

  ngOnInit() {
    // this.receipt = {
    //   meta: { date: '', cardnumber: '', cardholder: '', issuer: '' },
    //   artist: { name: '', logo: '/Tool-Lateralus.png', claim: '' },
    //   songlist: { showHeader: true, showQuantity: true, total: '', tracks: [] },
    // };
  }
}

export interface Artist {
  name: string;
  logo: string;
  claim: string;
}

export interface SongList {
  title: string;
  showHeader: boolean;
  showQuantity: boolean;
  total: string;
  tracks: Array<Track>;
}

export interface Track {
  order: number;
  title: string;
  length: string;
}

export interface Meta {
  date: string;
  cardnumber: string;
  cardholder: string;
  issuer: string;
  style: string;
}

export interface Receipt {
  meta: Meta;
  artist: Artist;
  songlist: SongList;
}

export interface Labels {
  tracknumber: string;
  tracktitle: string;
  tracklength: string;
  cardnumber: string;
  cardholder: string;
  issuer: string;
  date: string;
  itemcount: string;
  total: string;
}
