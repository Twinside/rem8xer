import { AccumulatingSelection, ChainSelection, ExtendSelection } from "./state";
import { Signal } from "@preact/signals";

class SelectionRectangle {
  top : number;
  left : number;
  right : number;
  bottom : number;
  isMouseDown : boolean;

  constructor(
    private readonly target : string,
    private readonly selection: Signal<ChainSelection | undefined>) {
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;
    this.isMouseDown = false;
  }

  rectangleSelect() {
    const left = Math.min(this.left, this.right);
    const right = Math.max(this.left, this.right);
    const top = Math.min(this.top, this.bottom);
    const bottom = Math.max(this.top, this.bottom);

    let acc = AccumulatingSelection;

    const elements = [...document.querySelectorAll(".scselect")] as HTMLElement[];
    for (const element of elements) {
      var box = element.getBoundingClientRect();

      if (left <= box.left && box.right <= right &&
          top <= box.top && box.bottom <= bottom) {

          const col = Number.parseInt(element.dataset.col, 10);
          const line = Number.parseInt(element.dataset.line, 10);

          acc = ExtendSelection(acc, col, line)
      }
    }

    this.selection.value = (acc.end.x < 0 || acc.end.y < 0)
      ? undefined
      : acc;
  }

  private getSelectionRectNode() : HTMLElement {
    return document.querySelector(this.target);
  }

  private hideSelectionRectangle() {
    const rect = this.getSelectionRectNode();
    rect.style.opacity = "0";
  }

  private showSelectionRectangle() {
    const rect = this.getSelectionRectNode();

    const left = Math.min(this.left, this.right)
    const top = this.top < this.bottom
      ? this.top + window.scrollY
      : this.bottom + window.scrollY;

    rect.style.left = `${left}px`;
    rect.style.top = `${top}px`;
    rect.style.width = `${Math.abs(this.right - this.left)}px`;
    rect.style.height = `${Math.abs(this.bottom - this.top)}px`;
    rect.style.opacity = "0.5";
  }

  public onMouseMove(e : MouseEvent) {
    if (!this.isMouseDown) { return; }

    this.right = e.clientX;
    this.bottom = e.clientY;
    this.showSelectionRectangle();
  }

  public onMouseUp(e : MouseEvent) {
    this.isMouseDown = false;
    this.rectangleSelect();

    this.hideSelectionRectangle();
    this.top = 0;
    this.left = 0;
    this.right = 0;
    this.bottom = 0;
  }

  public onMouseDown(e : MouseEvent) {
    e.preventDefault();

    this.isMouseDown = true;

    this.left = e.clientX;
    this.top = e.clientY;
  }
}