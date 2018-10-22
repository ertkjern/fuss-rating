import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {HistoryModel} from '../models/history.model';
import {Observable} from 'rxjs';

@Injectable()
export class HistoryService {

  private historyCollection: AngularFirestoreCollection<HistoryModel>;

  constructor(private afs: AngularFirestore) {
  }

  getHistory(top: number): Observable<HistoryModel[]> {
    this.historyCollection = this.afs.collection<HistoryModel>('history', ref => {
      return ref.orderBy('created', 'desc').limit(top);
    });
    return this.historyCollection.valueChanges();
  }
}
