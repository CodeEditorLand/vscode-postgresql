/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	Directive,
	ElementRef,
	EventEmitter,
	Inject,
	Output,
	forwardRef,
} from "@angular/core";
// import { Observable } from 'rxjs/Rx';

@Directive({
	selector: "[mousedown]",
})
export class MouseDownDirective {
	@Output("mousedown") onMouseDown: EventEmitter<void> =
		new EventEmitter<void>();

	constructor(@Inject(forwardRef(() => ElementRef)) private _el: ElementRef) {
		setTimeout(() => {
			const $gridCanvas = $(this._el.nativeElement).find(".grid-canvas");
			$gridCanvas.on("mousedown", () => {
				this.onMouseDown.emit();
			});
			const mouseDownFuncs: any[] = $._data($gridCanvas[0], "events")[
				"mousedown"
			];
			// reverse the event array so that our event fires first.
			mouseDownFuncs.reverse();
		});
	}
}
