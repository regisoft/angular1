import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

//Injectable() decorator. This marks the class as one that participates in the dependency injection system
//root: creates a single, shared instance ... = singleton 
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  //inject another service
  constructor(private messageService: MessageService) { }

  //asynchronous ... It can take a callback. It could return a Promise. It could return an Observable like this
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

  getHero(id: number): Observable<Hero> {
    
    //beachte ... nicht hochkomma 
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }  
}
