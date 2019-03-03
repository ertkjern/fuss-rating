import {TestBed} from '@angular/core/testing';

import {MatchmakerService} from './matchmaker.service';
import {MatchModel} from '../models/match.model';
import {UserModel} from '../models/user.model';
import {AngularFirestore} from '@angular/fire/firestore';

const AngularFirestoreStub = {
  createId: () => 'createId',
  collection: (name: string) => ({
    valueChanges: () => 'valueChanges',
    snapshotChanges: () => 'snapshotChanges',
    doc: (_id: string) => ({
      valueChanges: () => 'valuChanges',
      set: (_d: any) => 'set',
    }),
  }),
};

const setup1v1Match = (player1Elo, player2Elo) => {
  const match = new MatchModel();
  const player1 = new UserModel();
  player1.rating = player1Elo;
  match.player1 = player1;
  const player2 = new UserModel();
  player2.rating = player2Elo;
  match.player2 = player2;
  return match;
};

describe('MatchmakerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      providers: [
        MatchmakerService,
        {provide: AngularFirestore, useValue: AngularFirestoreStub},
      ]
    }).compileComponents()
  );

  it('should be created', () => {
    const service = TestBed.get(MatchmakerService);
    expect(service).toBeTruthy();
  });

  describe('calculate1v1ELORating', () => {

    it('should result in player1(1510), player2(1490)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1500, 1500);
      const actual = service['calculate1v1ELORating'](true, match);
      expect(actual.player1.rating).toEqual(1510);
      expect(actual.player2.rating).toEqual(1490);
    });

    it('should result in player1(1490), player2(1510)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1500, 1500);
      const actual = service['calculate1v1ELORating'](false, match);
      expect(actual.player1.rating).toEqual(1490);
      expect(actual.player2.rating).toEqual(1510);
    });

    it('should result in player1(1000), player2(2000)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1000, 2000);
      const actual = service['calculate1v1ELORating'](true, match);
      expect(actual.player1.rating).toEqual(1020);
      expect(actual.player2.rating).toEqual(1980);
    });

    it('should result in player1(1374), player2(1520)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1360, 1520);
      const actual = service['calculate1v1ELORating'](true, match);
      expect(actual.player1.rating).toEqual(1374);
      expect(actual.player2.rating).toEqual(1506);
    });

    it('should result in player1(1481), player2(1648)', () => {
      const service = TestBed.get(MatchmakerService);
      const match = setup1v1Match(1487, 1642);
      const actual = service['calculate1v1ELORating'](false, match);
      expect(actual.player1.rating).toEqual(1481);
      expect(actual.player2.rating).toEqual(1648);
    });
  });
});
