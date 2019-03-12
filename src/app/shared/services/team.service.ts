import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TeamModel} from '../models/team.model';
import {combineLatest, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private teamCollection: AngularFirestoreCollection<TeamModel>;

  constructor(private afs: AngularFirestore) {
  }

  getTeamsByName(): Observable<TeamModel[]> {
    this.teamCollection = this.afs.collection<TeamModel>('teams', ref => {
      return ref.orderBy('name', 'asc');
    });
    return this.teamCollection.valueChanges();
  }

  teamExists(player1Uid: string, player2Uid: string): Observable<boolean> {
    const o1$ = this.afs.collection<TeamModel>('teams', ref =>
      ref.where('player1Uid', '==', player1Uid).where('player2Uid', '==', player2Uid));

    const o2$ = this.afs.collection<TeamModel>('teams', ref =>
      ref.where('player2Uid', '==', player1Uid).where('player1Uid', '==', player2Uid));

    return combineLatest(o1$.get(), o2$.get()).pipe(
      map(([o1, o2]) => o1.size > 0 || o2.size > 0),
    );
  }

  register(player1Uid: string, player1Name: string, player2Uid: string, player2Name: string, name: string): Observable<TeamModel> {
    const team = {
      isPlaying: false,
      player1Uid: player1Uid,
      player1Name: player1Name,
      player2Uid: player2Uid,
      player2Name: player2Name,
      name: name,
      rating: 1500,
    } as TeamModel;
    return fromPromise(this.afs.collection<TeamModel>('teams').add(team)).pipe(
      switchMap(docRef =>
        fromPromise(this.afs.collection<TeamModel>('teams').doc(docRef.id).update({uid: docRef.id})).pipe(
          map(() => docRef.id),
        )
      ),
      switchMap(id => this.afs.collection<TeamModel>('teams').doc<TeamModel>(id).valueChanges().pipe(take(1))),
    );
  }

}
