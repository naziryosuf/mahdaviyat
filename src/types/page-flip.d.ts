declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, options: any);
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void;
    flipNext(corner?: string): void;
    flipPrev(corner?: string): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    on(event: string, callback: (e: any) => void): void;
    destroy(): void;
  }
}
