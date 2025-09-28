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
    venue: 'register',
    itemcount: 'item count',
    total: 'total',
  };

  protected emptyReceipt: Receipt = {
    meta: {
      date: '',
      cardnumber: '',
      cardholder: '',
      issuer: '',
      style: 'PLAIN',
      font: 'openinghours',
      text: '',
      text2: '',
    },
    artist: { name: '', logo: '', logodata: '', claim: '', claim2: '' },
    concert: { city: '', country: '', venue: '', festival: '', tour: '' },
    songlist: {
      title: '',
      showHeader: false,
      showQuantity: true,
      total: '',
      tracks: [{ title: '', length: '', order: 1 }],
    },
    mode: 'ALBUM',
  };

  public receipt: Receipt = JSON.parse(
    localStorage.getItem('bonnetjeAutoSave') || JSON.stringify(this.emptyReceipt)
  );

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
          font: 'openinghours',
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
      FATM: {
        meta: {
          date: '30 January 2019',
          cardnumber: '3001 #### #### 2019',
          cardholder: 'Florence Welch',
          issuer: 'Florence  ATM',
          style: 'CRUMPLED',
          text: '',
          text2: '',
        },
        artist: {
          name: 'Florence + the Machine',
          logo: 'C:\\fakepath\\FATM.jpg',
          logodata:
            'data:image/jpeg;base64,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',
          claim: 'choose love',
          claim2: '',
        },
        concert: {
          city: 'Auckland',
          country: 'New Zealand',
          venue: 'Spark Arena',
          festival: '',
          tour: 'High as Hope Tour',
        },
        songlist: {
          title: '',
          showHeader: false,
          showQuantity: true,
          total: '59:00',
          tracks: [
            { title: 'June', length: '3:41', order: 1 },
            { title: 'Hunger', length: '3:34', order: 2 },
            { title: 'Between Two Lungs', length: '4:08', order: 3 },
            { title: 'Only If for a Night', length: '4:58', order: 4 },
            { title: 'Queen of Peace', length: '5:07', order: 5 },
            { title: 'South London Forever', length: '4:22', order: 6 },
            { title: 'Patricia', length: '3:37', order: 7 },
            { title: 'Dog Days Are Over', length: '4:11', order: 8 },
            { title: '100 Years', length: '4:58', order: 9 },
            { title: 'Ship to Wreck', length: '3:54', order: 10 },
            { title: 'Sky Full of Song', length: '3:46', order: 11 },
            { title: 'Cosmic Love', length: '4:15', order: 12 },
            { title: 'Delilah', length: '4:53', order: 13 },
            { title: 'What Kind of Man', length: '3:36', order: 14 },
          ],
        },
        mode: 'CONCERT',
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
    {
      MAMAMOO: {
        meta: {
          date: '11 Feb 2023 06:00 pm',
          cardnumber: '2023 #### #### 0211',
          cardholder: 'MOOMOO',
          issuer: 'Rainbowbridge World',
          style: 'CRUMPLED',
          text: 'get your Moobong ready',
          text2: 'for Solar,Moonbyul,Wheein,Hwasa',
        },
        artist: {
          name: '',
          logo: 'mamamoo.png',
          logodata:
            'data:image/png;base64,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',
          claim: 'enjoy the concert',
          claim2: '',
        },
        concert: {
          city: 'Kuala Lumpur',
          country: 'Malaysia',
          venue: 'Malawati Indoor Stadium',
          festival: '',
          tour: '[my con] world tour',
        },
        songlist: {
          title: '',
          showHeader: false,
          showQuantity: true,
          total: '118:35',
          tracks: [
            { title: '1,2,3 Eoi!', length: '2:56', order: 1 },
            { title: 'Mr. Ambiguous', length: '3:48', order: 2 },
            { title: 'Freakin Shoes', length: '2:59', order: 3 },
            { title: 'NEW YORK', length: '3:01', order: 4 },
            { title: 'Dingga', length: '2:59', order: 5 },
            { title: 'Emotion', length: '3:27', order: 6 },
            { title: 'Funky Boy', length: '3:35', order: 7 },
            { title: 'You’re the best', length: '4:29', order: 8 },
            { title: 'AYA', length: '3:31', order: 9 },
            { title: 'ILLELLA', length: '2:46', order: 10 },
            { title: 'Taller than you', length: '3:05', order: 11 },
            { title: 'mumumumuch', length: '3:29', order: 12 },
            { title: 'water color', length: '3:09', order: 13 },
            { title: 'Eclipse', length: '3:28', order: 14 },
            { title: 'HONEY', length: '2:47', order: 15 },
            { title: 'TWIT', length: '3:10', order: 16 },
            { title: 'Spit it out', length: '3:14', order: 17 },
            { title: 'Make Me Happy', length: '3:17', order: 18 },
            { title: 'LUNATIC', length: '3:25', order: 19 },
            { title: 'Maria', length: '3:19', order: 20 },
            { title: 'Paint Me', length: '3:24', order: 21 },
            { title: 'I love too', length: '4:24', order: 22 },
            { title: 'Star Wind Flower Sun', length: '3:43', order: 23 },
            { title: 'Decalcomanie', length: '4:12', order: 24 },
            { title: 'HIP', length: '4:29', order: 25 },
            { title: 'Egotistic', length: '3:31', order: 26 },
            { title: 'gogobebe (rock version)', length: '3:40', order: 27 },
            { title: 'Starry Night', length: '3:31', order: 28 },
            { title: 'Wind flower', length: '3:56', order: 29 },
            { title: 'Travel', length: '3:31', order: 30 },
            { title: 'Better', length: '3:16', order: 31 },
            { title: 'Yes I am', length: '3:47', order: 32 },
            { title: 'L.I.E.C', length: '2:58', order: 33 },
            { title: 'Um Oh Ah Yeh', length: '4:19', order: 34 },
          ],
        },
        mode: 'CONCERT',
      },
    },
  ];

  ngOnInit() {
    this.fixOldFormats();
  }

  clearReceipt() {
    this.receipt = JSON.parse(JSON.stringify(this.emptyReceipt));
  }

  loadExample(example: string) {
    this.exampleReceipts.forEach((receipt) => {
      if (Object.keys(receipt)[0] === example) {
        this.clearReceipt();
        this.receipt = JSON.parse(JSON.stringify(Object.values(receipt)[0]));
        this.fixOldFormats();
      }
    });
  }

  downloadReceipt() {
    let imageName =
      (this.receipt.artist.name ? this.receipt.artist.name.replace(/\s/g, '-') + '-' : '') +
      (this.receipt.songlist.title ? this.receipt.songlist.title.replace(/\s/g, '-') + '-' : '') +
      'bonnetje-' +
      new Date().toJSON().slice(0, -5).replace('T', '-').replaceAll(':', '') +
      '.png';
    DomToImage.toBlob(document.getElementById('TheReceipt')).then(function (blob: any) {
      SaveAs(blob, imageName);
    });
  }

  downloadLargeReceipt() {
    var oldReceiptWidth = document.documentElement.style.getPropertyValue('--receipt-width');
    document.documentElement.style.setProperty('--receipt-width', '1800px');
    let imageName =
      (this.receipt.artist.name ? this.receipt.artist.name.replace(/\s/g, '-') + '-' : '') +
      (this.receipt.songlist.title ? this.receipt.songlist.title.replace(/\s/g, '-') + '-' : '') +
      'bonnetje-' +
      new Date().toJSON().slice(0, -5).replace('T', '-').replaceAll(':', '') +
      '.png';
    DomToImage.toBlob(document.getElementById('TheReceipt')).then(function (blob: any) {
      SaveAs(blob, imageName);
      document.documentElement.style.setProperty('--receipt-width', oldReceiptWidth);
    });
  }

  exportData() {
    let imageName =
      'bonnetje-export-' +
      (this.receipt.artist.name ? this.receipt.artist.name.replace(/\s/g, '-') + '-' : '') +
      (this.receipt.songlist.title ? this.receipt.songlist.title.replace(/\s/g, '-') + '-' : '') +
      new Date().toJSON().slice(0, -5).replace('T', '-').replaceAll(':', '') +
      '.txt';
    var blob = new Blob([JSON.stringify(this.receipt)], { type: 'text/plain;charset=utf-8' });
    SaveAs.saveAs(blob, imageName);
  }

  importData(event: any) {
    var file = event.target.files[0];
    this.readFileContent(file).then((result) => {
      this.receipt = JSON.parse(result);
      this.fixOldFormats();
    });
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }
      const reader = new FileReader();
      reader.onloadend = function () {
        if (reader.result !== null) {
          resolve(<string>reader.result);
        }
      };
      reader.readAsText(file);
    });
  }

  fixOldFormats() {
    this.receipt.mode = this.receipt.mode || 'ALBUM';
    this.receipt.meta.font = this.receipt.meta.font || 'hydrogen';
  }
}

export interface Artist {
  name: string;
  logo: string;
  logodata: string | ArrayBuffer | null;
  claim: string;
  claim2: string;
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
  font: string;
  text: string;
  text2: string;
}

export interface Concert {
  city: string;
  country: string;
  festival: string;
  venue: string;
  tour: string;
}

export interface Receipt {
  mode: string;
  meta: Meta;
  artist: Artist;
  songlist: SongList;
  concert: Concert;
}

export interface Labels {
  tracknumber: string;
  tracktitle: string;
  tracklength: string;
  cardnumber: string;
  cardholder: string;
  issuer: string;
  date: string;
  venue: string;
  itemcount: string;
  total: string;
}
