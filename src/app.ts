import * as Rx from 'rxjs'

const tick$ = Rx.Observable
    .interval(1000)
    .publish();


tick$.subscribe((v) => {
    console.log(v);
});

let a = new Date();
console.log(a);

console.log('Ahahaha');