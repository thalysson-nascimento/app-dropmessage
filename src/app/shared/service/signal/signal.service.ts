import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SignalService<T> {
  private state = signal<T | null>(null);

  set(value: T | null): void {
    this.state.set(value);
  }

  get(): Signal<T | null> {
    return this.state;
  }

  getValue(): T | null {
    return this.state();
  }
}
