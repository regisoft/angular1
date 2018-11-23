import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

//Injectable() decorator. This marks the class as one that participates in the dependency injection system
//root: creates a single, shared instance ... = singleton 
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  //------1---- MOCK!!!!!
  //private heroesUrl = 'api/heroes';  // URL to web api... local    in-memory-data.service.ts
  //private functionKey = "?code=blibla";

  //------2---- REAL!!!!!
  private heroesUrl = 'https://lambosoftfunc.azurewebsites.net/api/hero';  // URL to web api
  private functionKey = "?code=6ySgwBlz9iOmkGvcqeyrYK4tYDRC1LBOUalC/fiKBfJhsQ9JfKSTtw==";


/* ----- rest endpoints:
api/heroes   get,  post,  put,  delete
api/heroes/99999
api/heroes/?name=BBBBBB
*/

  //Inject HttpClient into the constructor in a private property called http.
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  //asynchronous ... It can take a callback. It could return a Promise. It could return an Observable like this
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    //return of(HEROES);

    const url = this.heroesUrl + this.functionKey;
    this.messageService.add('url: ' + url);
    //All HttpClient methods return an RxJS Observable of something.
    return this.http.get<Hero[]>(url)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );

  }

  getHero(id: number): Observable<Hero> {

    //beachte ... nicht hochkomma 
    //this.messageService.add(`HeroService: fetched hero id=${id}`);

    //return of(HEROES.find(hero => hero.id === id));

    const url = `${this.heroesUrl}/${id}`+ this.functionKey;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl + "/999" + this.functionKey, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }


  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl + this.functionKey, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}${this.functionKey}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`${this.heroesUrl}${this.functionKey}&name=${term}`).pipe(
    tap(_ => this.log(`found heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
