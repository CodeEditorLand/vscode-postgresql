/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	Component,
	EventEmitter,
	forwardRef,
	Inject,
	OnInit,
	Output,
} from "@angular/core";

import * as Constants from "./../constants";
import { IRange } from "./../interfaces";
import { ShortcutService } from "./../services/shortcuts.service";
import * as Utils from "./../utils";

/**
 * The component that acts as the contextMenu for slick grid
 */

const template = `
<ul class="contextMenu" style="position:absolute" [class.hidden]="!visible" [style.top]="position.y" [style.left]="position.x">
    <li id="copy" (click)="handleContextActionClick('copySelection')" [class.disabled]="isDisabled"> {{Constants.copyLabel}}
        <span style="float: right; color: lightgrey; padding-left: 10px">{{keys['event.copySelection']}}</span>
    </li>
</ul>
`;

@Component({
	selector: "msg-context-menu",
	providers: [ShortcutService],
	template: template,
})
export class MessagesContextMenu implements OnInit {
	// tslint:disable-next-line:no-unused-variable
	private Utils = Utils;
	// tslint:disable-next-line:no-unused-variable
	private Constants = Constants;

	@Output() clickEvent: EventEmitter<{
		type: string;

		selectedRange: IRange;
	}> = new EventEmitter<{ type: string; selectedRange: IRange }>();

	private selectedRange: IRange;

	private isDisabled: boolean;

	private position: { x: number; y: number } = { x: 0, y: 0 };

	private visible: boolean = false;

	private keys = {
		"event.copySelection": "",
	};

	constructor(
		@Inject(forwardRef(() => ShortcutService))
		private shortcuts: ShortcutService,
	) {
		const self = this;

		for (let key in this.keys) {
			if (this.keys.hasOwnProperty(key)) {
				this.shortcuts.stringCodeFor(key).then((result) => {
					self.keys[key] = result;
				});
			}
		}
	}

	ngOnInit(): void {
		const self = this;
		$(document).on("click", () => {
			self.hide();
		});
	}

	show(x: number, y: number, selectedRange: IRange): void {
		this.selectedRange = selectedRange;

		let selectedText =
			selectedRange && selectedRange.toString
				? selectedRange.toString()
				: "";

		this.isDisabled = selectedText.length === 0;

		this.position = { x: x, y: y };

		this.visible = true;
	}

	hide(): void {
		this.visible = false;
	}

	handleContextActionClick(type: string): void {
		if (!this.isDisabled) {
			this.clickEvent.emit({
				"type": type,
				"selectedRange": this.selectedRange,
			});
		}
	}
}
