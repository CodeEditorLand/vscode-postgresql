/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { Inject, Injectable, forwardRef } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { Observable, Observer, Subject } from "rxjs/Rx";

import { ISlickRange } from "angular2-slickgrid";

import * as Utils from "./../utils";

import {
	IResultsConfig,
	ISelectionData,
	ResultSetSubset,
	WebSocketEvent,
} from "./../interfaces";

import * as Constants from "./../constants";

const WS_URL = `ws://localhost:${window.location.port}/`;

/**
 * Service which performs the http requests to get the data resultsets from the server.
 */

@Injectable()
export class DataService {
	private uri: string;
	public ws: WebSocket;
	public dataEventObs: Subject<WebSocketEvent>;
	private _shortcuts;
	private _config;

	/* for testing purposes only */
	public get webSocket(): WebSocket {
		return this.ws;
	}

	constructor(@Inject(forwardRef(() => Http)) private http) {;
		// grab the uri from the document for requests
		this.uri = encodeURI(
			document.getElementById("uri")
				? document.getElementById("uri").innerText.trim()
				: ""
		);
		this.ws = new WebSocket(`${WS_URL}?uri=${this.uri}`);
		const observable = Observable.create((obs: Observer<MessageEvent>) => {
			this.ws.onmessage = obs.next.bind(obs);
			this.ws.onerror = obs.error.bind(obs);
			this.ws.onclose = obs.complete.bind(obs);

			return this.ws.close.bind(this.ws);
		});

		const observer = {
			next: (data: Object) => {
				if (this.ws.readyState === WebSocket.OPEN) {
					this.ws.send(JSON.stringify(data));
				}
			},
		};

		this.dataEventObs = Subject.create(observer, observable).map(
			(response: MessageEvent): WebSocketEvent => {
				const data = JSON.parse(response.data);
				return data;
			}
		);

		this.getLocalizedTextsRequest().then((result) => {
			Object.keys(result).forEach((key) => {
				Constants.loadLocalizedConstant(key, result[key]);
			});
		});
	}

	/**
	 * Get a specified number of rows starting at a specified row for
	 * the current results set
	 * @param start The starting row or the requested rows
	 * @param numberOfRows The amount of rows to return
	 * @param batchId The batch id of the batch you are querying
	 * @param resultId The id of the result you want to get the rows for
	 */
	getRows(
		start: number,
		numberOfRows: number,
		batchId: number,
		resultId: number,
	): Observable<ResultSetSubset> {
		const uriFormat = "/{0}?batchId={1}&resultId={2}&uri={3}";
		const uri = Utils.formatString(
			uriFormat,
			"rows",
			batchId,
			resultId,
			this.uri,
		);
		return this.http
			.get(`${uri}&rowStart=${start}&numberOfRows=${numberOfRows}`)
			.map((res) => {
				return res.json();
			});
	}

	/**
	 * send request to save the selected result set as csv, json or excel
	 * @param batchIndex The batch id of the batch with the result to save
	 * @param resultSetNumber The id of the result to save
	 * @param format The format to save in - csv, json, excel
	 * @param selection The range inside the result set to save, or empty if all results should be saved
	 */
	sendSaveRequest(
		batchIndex: number,
		resultSetNumber: number,
		format: string,
		selection: ISlickRange[],
	): void {
		const headers = new Headers();
		const url = `/saveResults?&uri=${this.uri}&format=${format}&batchIndex=${batchIndex}&resultSetNo=${resultSetNumber}`;
		this.http
			.post(url, selection, { headers: headers })
			.subscribe(undefined, (err) => {
				this.showError(err.statusText);
			});
	}

	/**
	 * send request to get all the localized texts
	 */
	getLocalizedTextsRequest(): Promise<{ [key: string]: any }> {
		const headers = new Headers();
		const url = "/localizedTexts";

		return new Promise<{ [key: string]: any }>((resolve, reject) => {
			this.http.get(url, { headers: headers }).subscribe((result) => {
				resolve(result.json());
			});
		});
	}

	/**
	 * send request to open content in new editor
	 * @param content The content to be opened
	 * @param columnName The column name of the content
	 */
	openLink(content: string, columnName: string, linkType: string): void {
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		this.http
			.post(
				"/openLink",
				JSON.stringify({
					content: content,
					columnName: columnName,
					type: linkType,
				}),
				{ headers: headers },
			)
			.subscribe(undefined, (err) => {
				this.showError(err.statusText);
			});
	}

	/**
	 * Sends a copy request
	 * @param selection The selection range to copy
	 * @param batchId The batch id of the result to copy from
	 * @param resultId The result id of the result to copy from
	 * @param includeHeaders [Optional]: Should column headers be included in the copy selection
	 */
	copyResults(
		selection: ISlickRange[],
		batchId: number,
		resultId: number,
		includeHeaders?: boolean,
	): void {
		const headers = new Headers();
		let url = `/copyResults?&uri=${this.uri}&batchId=${batchId}&resultId=${resultId}`;
		if (includeHeaders !== undefined) {
			url += `&includeHeaders=${includeHeaders}`;
		}
		this.http.post(url, selection, { headers: headers }).subscribe();
	}

	/**
	 * Sends a request to set the selection in the VScode window
	 * @param selection The selection range in the VSCode window
	 */
	set editorSelection(selection: ISelectionData) {
		const headers = new Headers();
		const url = `/setEditorSelection?&uri=${this.uri}`;
		this.http.post(url, selection, { headers: headers }).subscribe();
	}

	/**
	 * Sends a generic GET request without expecting anything in return
	 * @param uri The uri to send the GET request to
	 */
	sendGetRequest(uri: string): void {
		const headers = new Headers();
		this.http.get(uri, { headers: headers }).subscribe();
	}

	showWarning(message: string): void {
		const url = `/showWarning?&uri=${this.uri}`;
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		this.http
			.post(url, JSON.stringify({ message: message }), {
				headers: headers,
			})
			.subscribe();
	}

	showError(message: string): void {
		const url = `/showError?&uri=${this.uri}`;
		const headers = new Headers();
		headers.append("Content-Type", "application/json");
		this.http
			.post(url, JSON.stringify({ message: message }), {
				headers: headers,
			})
			.subscribe();
	}

	get config(): Promise<{ [key: string]: any }> {
		if (this._config) {
			return Promise.resolve(this._config);
		} else {
			return new Promise<{ [key: string]: string }>((resolve, reject) => {
				const url = `/config?&uri=${this.uri}`;
				this.http
					.get(url)
					.map((res): IResultsConfig => {
						return res.json();
					})
					.subscribe((result: IResultsConfig) => {
						this._shortcuts = result.shortcuts;
						result.shortcuts = undefined;
						this._config = result;
						resolve(this._config);
					});
			});
		}
	}

	get shortcuts(): Promise<any> {
		if (this._shortcuts) {
			return Promise.resolve(this._shortcuts);
		} else {
			return new Promise<any>((resolve, reject) => {
				const url = `/config?&uri=${this.uri}`;
				this.http
					.get(url)
					.map((res): IResultsConfig => {
						return res.json();
					})
					.subscribe((result) => {
						this._shortcuts = result.shortcuts;
						result.resultShortcuts = undefined;
						this._config = result;
						resolve(this._shortcuts);
					});
			});
		}
	}
}
