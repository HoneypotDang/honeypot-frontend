import { makeAutoObservable } from "mobx";
import { number } from "zod";

export const CONFETTI_DEFAULT_NUMBER_OF_PIECES = 200;

export class VisualEffects {
  confetti_state = {
    run: false,
    recycle: false,
    numberOfPieces: CONFETTI_DEFAULT_NUMBER_OF_PIECES,
  };

  constructor() {
    makeAutoObservable(this);
  }

  startConfetti() {
    if (this.confetti_run === false) {
      this.confetti_run = true;
    } else {
      this.confetti_numberOfPieces += 200;
    }
  }

  onConfettiComplete() {
    this.confetti_run = false;
    this.confetti_numberOfPieces = CONFETTI_DEFAULT_NUMBER_OF_PIECES;
  }

  get confetti_run() {
    return this.confetti_state.run;
  }

  set confetti_run(value: boolean) {
    this.confetti_state.run = value;
  }

  get confetti_recycle() {
    return this.confetti_state.recycle;
  }

  set confetti_recycle(value: boolean) {
    this.confetti_state.recycle = value;
  }

  get confetti_numberOfPieces() {
    return this.confetti_state.numberOfPieces;
  }

  set confetti_numberOfPieces(value: number) {
    this.confetti_state.numberOfPieces = value;
  }
}

export const visualEffects = new VisualEffects();
