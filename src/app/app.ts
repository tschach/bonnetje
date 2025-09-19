import { Component, signal, ViewEncapsulation } from '@angular/core';
import { BonEdit } from './bon-edit/bon-edit';
import { BonPreview } from './bon-preview/bon-preview';
import DomToImage from 'dom-to-image';
import SaveAs from 'file-saver';

@Component({
  selector: 'app-root',
  imports: [BonEdit, BonPreview],
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
    total: 'total',
  };

  protected emptyReceipt: Receipt = {
    meta: { date: '', cardnumber: '', cardholder: '', issuer: '', style: 'PLAIN' },
    artist: { name: '', logo: '', logodata: '', claim: '' },
    songlist: {
      title: '',
      showHeader: false,
      showQuantity: true,
      total: '',
      tracks: [{ title: '', length: '', order: 1 }],
    },
  };

  public receipt: Receipt = JSON.parse(JSON.stringify(this.emptyReceipt));

  public exampleReceipts = [
    {
      TOOL: {
        meta: {
          date: '15 May 2001',
          cardnumber: '0112-35813-213455-89144233',
          cardholder: '',
          issuer: 'Zoo Entertainment',
          style: 'PLAIN',
        },
        artist: {
          name: '',
          logo: 'Tool.png',
          logodata:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANgAAABUCAMAAADXjAl8AAAAnFBMVEUAAAATExMUFBQTExMTExMTExMTExMUFBQUFBQTExMUFBQUFBQTExMTExMWFhYTExMTExMUFBQVFRUWFhYWFhYWFhYTExMTExMUFBQUFBQUFBQTExMTExMUFBQTExMTExMTExMVFRUVFRUTExMTExMUFBQUFBQTExMTExMTExMTExMUFBQUFBQUFBQTExMTExMTExMUFBQUFBQTExPDA1J5AAAAM3RSTlMACL+P/ZzmPRnLHmLh9gTX+ZAORCwT8tAKgFjq3Ym4p3InI+6UeVK0wmivSjgzx6BtXEAqyaBKAAAEQ0lEQVR42u3b63KiMBiAYcCAggQicj7j+dzqd//3tt3tOlsxIsROAzs8fzvD8BIVvliFSpZmCB1kjPZ5xZ/FY56dRkLnWPtERdLD6Fm+0QnoXQsz7ECNAIAe5hTvJ4wAoGNhvnZOMQKgh1mX5dqFD10L00JZhw/UMOOYnBQE0LkwYyqbLgA1zHCKXP2zkl0Ls4rcxAiAHmYtUwwfOhfmh9l1rahhNgB0MkxTAfqwPqwF+rA+rCUehA2kv05AgTfSlSO01IMwCWpq7dr1YX1YS/RhL4YZo+HU9o2XByxrpllie8KsoYwRQvrg4L+SJdqJDmi+O88M1rDNt4ZNswg+RbLN3vU765O3dBjDjtO/9mu4F4XTqxovC2cSIbhC8cpgnBzfYwJXRD28+Eglyi8+UvmhCTfI0mJ5cx135PbibkWuYYWMoYQsnMZdVq5DCQ5EfmFGaCK4Q2S/YddsjeEOXoi8wkYJBhqUiI3eXSsdaMjE4hN2WCOgw7khXDFfHgASGBzCjDCGh+b1PxvtDYFH8PvPh1m5CxX0ouY9eaUjqLpAPx2mLRBUqjeiOsEcKnn2z4bZEoJqJKnxYixSAk/srB8MM4YxgmeU6dN36cV8fhiUf2OYshpWGitQg7QdV1vWOsw8HNKsTIYwpFTDUAt6ouZR5goVeRr2H+nDKrgxgW9AYrdNYcQ7j0YyghehKCmsqdueMPxnMNHSV7vU4e8P/a3bljCU+J/DhgQvMe3PUwhwO8JQer1/FxsE7PDleg4JbkWYu/ryZA7s/s2RRuC2Iewkfn3YA1bzy5ezWLotCLuZkbQdYj2J0dfpZYu5hyH7dv7N2MqQLNw4R7zDFKs0UsnAgizLA7nCOWzjC+UyljVzw/IQs5rzDVv7d2PwG0PZfC+UrRSuYakv3Jd9S5gRRjzDVJ+yg7aGptwxZaR+xxzDIoe2B+IhaIYEAsUE8QuDg0CxcqGhTKRt6q05hiW0MGMADXkzgWIY8wuLHYHCMaEZEgo0CeEWhnPqkm1R07OwBIqZzi0MvEKgKDxoBm0FmgG/MFhYtCVrfJtWqB9DR8QvDFG/bGz8gI5U2sa87/ELA0z7Su4SQUPIOwp3xIxjGKC1fbdohcKwTbV17l7SAd99xSgZltI0heUKpWetVLbkvROsSMHF+pe1Z9y4wJ4c/rtXW8exBNy3uAl2zTST5WznRS4mwAhhV9lkb7K8k+KPwyD+Ya3Th3VNH9Y1fVjX9GFd04d1TR/WNU/DToNbkx2Gat5i8NzCgyeUxaAu2WUIC8QSa7hQKuYJIh19sYbRWK2aSpB3EGvTYoawJe1XJ+GbpxBqlln/X+3F4ULVMdBgM3CE+hyWsODRT1i2k9QsxenZ+0xowj+cg0ydl6pUeUw5DHuYEU4opo+vuDOz9/lgt/Hi2PTWcj6cWUJz1qg4hMtBtpakNM0m+d4e+UIzTmreefsFA5MLArQpn9QAAAAASUVORK5CYII=',
          claim: 'Black Then White are All I see in my infancy',
        },
        songlist: {
          title: 'Lateralus',
          showHeader: false,
          showQuantity: true,
          total: '78:51',
          tracks: [
            { title: 'The Grudge', length: '8:36', order: 1 },
            { title: 'Eon Blue Apocalypse', length: '1:04', order: 2 },
            { title: 'The Patient', length: '7:13', order: 3 },
            { title: 'Mantra', length: '1:12', order: 4 },
            { title: 'Schism', length: '6:47', order: 5 },
            { title: 'Parabol', length: '3:04', order: 6 },
            { title: 'Parabola', length: '6:03', order: 7 },
            { title: 'Ticks & Leeches', length: '8:10', order: 8 },
            { title: 'Lateralus', length: '9:24', order: 9 },
            { title: 'Disposition', length: '4:46', order: 10 },
            { title: 'Reflection', length: '11:07', order: 11 },
            { title: 'Triad', length: '8:46', order: 12 },
            { title: 'Faaip De Oiad', length: '2:39', order: 13 },
          ],
        },
      },
    },
    {
      STRAYKIDS: {
        meta: {
          date: '2025-08-21',
          cardnumber: '####-####-####-2018',
          cardholder: 'STAY',
          issuer: 'JYP ENTERTAINMENT',
          style: 'CRUMPLED',
        },
        artist: {
          name: 'Stray Kids',
          logo: 'Straykids.png',
          logodata:
            'data:image/png;base64,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',
          claim: 'Stray Kids everywhere all around the world',
        },
        songlist: {
          title: 'Karma',
          showHeader: false,
          showQuantity: false,
          total: '32:02',
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
            { order: 11, title: 'Ceremony (english ver.)', length: '2:44' },
          ],
        },
      },
    },
    {
      TRIBE: {
        meta: {
          date: '1991-09-24',
          cardnumber: '3740-5162-3833-xxxx',
          cardholder: 'Native Tongues Posse',
          issuer: 'Jive',
          style: 'FADED',
        },
        artist: {
          name: 'A Tribe Called Quest',
          logo: '',
          logodata: '',
          claim: 'Here we go, yo, here we go, yo',
        },
        songlist: {
          title: 'The Low End Theory',
          showHeader: true,
          showQuantity: false,
          total: '48:04',
          tracks: [
            { title: 'Excursions', length: '3:55', order: 1 },
            { title: "Buggin' Out", length: '3:37', order: 2 },
            { title: 'Rap Promoter', length: '2:13', order: 3 },
            { title: 'Butter', length: '3:39', order: 4 },
            { title: 'Verses from the Abstract', length: '3:59', order: 5 },
            { title: 'Show Business', length: '3:53', order: 6 },
            { title: 'Vibes and Stuff', length: '4:18', order: 7 },
            { title: 'The Infamous Date Rape', length: '2:54', order: 8 },
            { title: 'Check the Rhime', length: '3:37', order: 9 },
            { title: 'Everything Is Fair', length: '2:58', order: 10 },
            { title: "Jazz (We've Got)", length: '4:10', order: 11 },
            { title: 'Skypager', length: '2:12', order: 12 },
            { title: 'What?', length: '2:29', order: 13 },
            { title: 'Scenario', length: '4:10', order: 14 },
          ],
        },
      },
    },
    {
      SOAD: {
        meta: {
          date: 'September 4, 2001',
          cardnumber: '1994-2006-2010-xxxx',
          cardholder: 'S.O.A.D.',
          issuer: 'American / Columbia',
          style: 'FADED',
        },
        artist: {
          name: '',
          logo: 'SOAD.png',
          logodata:
            'data:image/png;base64,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',
          claim: 'Revolution, the only solution',
        },
        songlist: {
          title: 'Toxicity',
          showHeader: true,
          showQuantity: true,
          total: '43:55',
          tracks: [
            { title: 'Prison Song', length: '3:21', order: 1 },
            { title: 'Needles', length: '3:13', order: 2 },
            { title: 'Deer Dance', length: '2:54', order: 3 },
            { title: 'Jet Pilot', length: '2:06', order: 4 },
            { title: 'X', length: '1:58', order: 5 },
            { title: 'Chop Suey!', length: '3:30', order: 6 },
            { title: 'Bounce', length: '1:54', order: 7 },
            { title: 'Forest', length: '4:00', order: 8 },
            { title: 'ATWA', length: '2:56', order: 9 },
            { title: 'Science', length: '2:42', order: 10 },
            { title: 'Shimmy', length: '1:50', order: 11 },
            { title: 'Toxicity', length: '3:38', order: 12 },
            { title: 'Psycho', length: '3:45', order: 13 },
            { title: 'Aerials', length: '3:55', order: 14 },
            { title: 'Arto', length: '2:13', order: 15 },
          ],
        },
      },
    },
    {
      GAGA: {
        meta: {
          date: '7 March 2025',
          cardnumber: '00-6024-7545-1075',
          cardholder: 'Stefani Germanotta',
          issuer: 'Interscope',
          style: 'PLAIN',
        },
        artist: { name: 'Lady Gaga', logo: '', logodata: '', claim: 'Born This Way' },
        songlist: {
          title: 'Mayhem',
          showHeader: false,
          showQuantity: false,
          total: '53:04',
          tracks: [
            { title: 'Disease', length: '3:49', order: 1 },
            { title: 'Abracadabra', length: '3:43', order: 2 },
            { title: 'Garden of Eden', length: '3:59', order: 3 },
            { title: 'Perfect Celebrity', length: '3:49', order: 4 },
            { title: 'Vanish into You', length: '4:04', order: 5 },
            { title: 'Killah', length: '3:30', order: 6 },
            { title: 'Zombieboy', length: '3:33', order: 7 },
            { title: 'LoveDrug', length: '3:13', order: 8 },
            { title: 'How Bad Do U Want Me', length: '3:58', order: 9 },
            { title: "Don't Call Tonight", length: '3:45', order: 10 },
            { title: 'Shadow of a Man', length: '3:19', order: 11 },
            { title: 'The Beast', length: '3:54', order: 12 },
            { title: 'Blade of Grass', length: '4:17', order: 13 },
            { title: 'Die with a Smile', length: '4:11', order: 14 },
          ],
        },
      },
    },
  ];

  ngOnInit() {}

  clearReceipt() {
    this.receipt = JSON.parse(JSON.stringify(this.emptyReceipt));
  }

  loadExample(example: string) {
    this.exampleReceipts.forEach((receipt) => {
      if (Object.keys(receipt)[0] === example) {
        this.receipt = JSON.parse(JSON.stringify(Object.values(receipt)[0]));
      }
    });
  }

  downloadReceipt() {
    let imageName =
      (this.receipt.artist.name ? this.receipt.artist.name.replace(/\s/g, '-') + '-' : '') +
      (this.receipt.songlist.title ? this.receipt.songlist.title.replace(/\s/g, '-') + '-' : '') +
      'bonnetje-' +
      (new Date().toJSON().slice(0, -5)).replace('T', '-').replaceAll(':', '') +
      '.png';
    DomToImage.toBlob(document.getElementById('TheReceipt')).then(function (blob: any) {
      SaveAs(blob, imageName);
    });
  }
}

export interface Artist {
  name: string;
  logo: string;
  logodata: string | ArrayBuffer | null;
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
