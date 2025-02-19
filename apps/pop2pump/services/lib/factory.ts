import { makeAutoObservable } from "mobx";
import { useEffect } from "react";
import { AsyncState } from "../utils";

export abstract class PageController {
    constructor() {
        makeAutoObservable(this);
    }
    abstract init: AsyncState;
    abstract dispose(): void;
}