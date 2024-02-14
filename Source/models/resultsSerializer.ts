import vscode = require("vscode");
import Constants = require("../constants/constants");
import LocalizedConstants = require("../constants/localizedConstants");
import Interfaces = require("./interfaces");
import * as path from "path";
import type { RequestType } from "vscode-languageclient";
import VscodeWrapper from "../controllers/vscodeWrapper";
import SqlToolsServerClient from "../languageservice/serviceclient";
import * as Contracts from "../models/contracts";
import Telemetry from "../models/telemetry";
import * as Utils from "../models/utils";

const opener = require("opener");

type SaveAsRequestParams =
	| Contracts.SaveResultsAsCsvRequestParams
	| Contracts.SaveResultsAsJsonRequestParams
	| Contracts.SaveResultsAsExcelRequestParams;

/**
 *  Handles save results request from the context menu of slickGrid
 */
export default class ResultsSerializer {
	private _client: SqlToolsServerClient;
	private _vscodeWrapper: VscodeWrapper;
	private _uri: string;
	private _filePath: string;

	constructor(client?: SqlToolsServerClient, vscodeWrapper?: VscodeWrapper) {
		if (client) {
			this._client = client;
		} else {
			this._client = SqlToolsServerClient.instance;
		}
		if (vscodeWrapper) {
			this._vscodeWrapper = vscodeWrapper;
		} else {
			this._vscodeWrapper = new VscodeWrapper();
		}
	}

	private promptForFilepath(format: string): Thenable<string> {
		let defaultUri: vscode.Uri;
		if (vscode.Uri.parse(this._uri).scheme === "untitled") {
			defaultUri = undefined;
		} else {
			defaultUri = vscode.Uri.parse(path.dirname(this._uri));
		}
		const fileTypeFilter: { [name: string]: string[] } = {};
		if (format === "csv") {
			fileTypeFilter[LocalizedConstants.fileTypeCSVLabel] = ["csv"];
		} else if (format === "json") {
			fileTypeFilter[LocalizedConstants.fileTypeJSONLabel] = ["json"];
		} else if (format === "excel") {
			fileTypeFilter[LocalizedConstants.fileTypeExcelLabel] = ["xlsx"];
		}
		const options = <vscode.SaveDialogOptions>{
			defaultUri: defaultUri,
			filters: fileTypeFilter,
		};
		return this._vscodeWrapper.showSaveDialog(options).then((uri) => {
			if (!uri) {
				return undefined;
			}
			return uri.scheme === "file" ? uri.fsPath : uri.path;
		});
	}

	private getConfigForCsv(): Contracts.SaveResultsAsCsvRequestParams {
		// get save results config from vscode config
		const config = this._vscodeWrapper.getConfiguration(
			Constants.extensionConfigSectionName,
			this._uri,
		);
		const saveConfig = config[Constants.configSaveAsCsv];
		const saveResultsParams = new Contracts.SaveResultsAsCsvRequestParams();

		// if user entered config, set options
		if (saveConfig) {
			if (saveConfig.includeHeaders !== undefined) {
				saveResultsParams.includeHeaders = saveConfig.includeHeaders;
			}
		}
		return saveResultsParams;
	}

	private getConfigForJson(): Contracts.SaveResultsAsJsonRequestParams {
		// get save results config from vscode config
		const config = this._vscodeWrapper.getConfiguration(
			Constants.extensionConfigSectionName,
			this._uri,
		);
		const saveConfig = config[Constants.configSaveAsJson];
		const saveResultsParams =
			new Contracts.SaveResultsAsJsonRequestParams();

		if (saveConfig) {
			// TODO: assign config
		}
		return saveResultsParams;
	}

	private getConfigForExcel(): Contracts.SaveResultsAsExcelRequestParams {
		// get save results config from vscode config
		// Note: we are currently using the configSaveAsCsv setting since it has the option pgsql.saveAsCsv.includeHeaders
		// and we want to have just 1 setting that lists this.
		const config = this._vscodeWrapper.getConfiguration(
			Constants.extensionConfigSectionName,
			this._uri,
		);
		const saveConfig = config[Constants.configSaveAsCsv];
		const saveResultsParams =
			new Contracts.SaveResultsAsExcelRequestParams();

		// if user entered config, set options
		if (saveConfig) {
			if (saveConfig.includeHeaders !== undefined) {
				saveResultsParams.includeHeaders = saveConfig.includeHeaders;
			}
		}
		return saveResultsParams;
	}

	private getParameters(
		filePath: string,
		batchIndex: number,
		resultSetNo: number,
		format: string,
		selection: Interfaces.ISlickRange,
	): SaveAsRequestParams {
		let saveResultsParams: SaveAsRequestParams;
		this._filePath = filePath;

		if (format === "csv") {
			saveResultsParams = this.getConfigForCsv();
		} else if (format === "json") {
			saveResultsParams = this.getConfigForJson();
		} else if (format === "excel") {
			saveResultsParams = this.getConfigForExcel();
		}

		saveResultsParams.filePath = this._filePath;
		saveResultsParams.ownerUri = this._uri;
		saveResultsParams.resultSetIndex = resultSetNo;
		saveResultsParams.batchIndex = batchIndex;
		if (this.isSelected(selection)) {
			saveResultsParams.rowStartIndex = selection.fromRow;
			saveResultsParams.rowEndIndex = selection.toRow;
			saveResultsParams.columnStartIndex = selection.fromCell;
			saveResultsParams.columnEndIndex = selection.toCell;
		}
		return saveResultsParams;
	}

	/**
	 * Check if a range of cells were selected.
	 */
	public isSelected(selection: Interfaces.ISlickRange): boolean {
		return (
			selection &&
			!(
				selection.fromCell === selection.toCell &&
				selection.fromRow === selection.toRow
			)
		);
	}

	/**
	 * Send request to sql tools service to save a result set
	 */
	public sendRequestToService(
		filePath: string,
		batchIndex: number,
		resultSetNo: number,
		format: string,
		selection: Interfaces.ISlickRange,
	): Thenable<void> {
		const saveResultsParams = this.getParameters(
			filePath,
			batchIndex,
			resultSetNo,
			format,
			selection,
		);
		let type: RequestType<
			Contracts.SaveResultsRequestParams,
			Contracts.SaveResultRequestResult,
			void,
			void
		>;
		if (format === "csv") {
			type = Contracts.SaveResultsAsCsvRequest.type;
		} else if (format === "json") {
			type = Contracts.SaveResultsAsJsonRequest.type;
		} else if (format === "excel") {
			type = Contracts.SaveResultsAsExcelRequest.type;
		}

		this._vscodeWrapper.logToOutputChannel(
			LocalizedConstants.msgSaveStarted + this._filePath,
		);

		// send message to the sqlserverclient for converting resuts to the requested format and saving to filepath
		return this._client.sendRequest(type, saveResultsParams).then(
			(result: any) => {
				if (result.messages) {
					this._vscodeWrapper.showErrorMessage(
						LocalizedConstants.msgSaveFailed + result.messages,
					);
					this._vscodeWrapper.logToOutputChannel(
						LocalizedConstants.msgSaveFailed + result.messages,
					);
				} else {
					this._vscodeWrapper.showInformationMessage(
						LocalizedConstants.msgSaveSucceeded + this._filePath,
					);
					this._vscodeWrapper.logToOutputChannel(
						LocalizedConstants.msgSaveSucceeded + filePath,
					);
					this.openSavedFile(this._filePath, format);
				}
				// telemetry for save results
				Telemetry.sendTelemetryEvent("SavedResults", { type: format });
			},
			(error) => {
				this._vscodeWrapper.showErrorMessage(
					LocalizedConstants.msgSaveFailed + error.message,
				);
				this._vscodeWrapper.logToOutputChannel(
					LocalizedConstants.msgSaveFailed + error.message,
				);
			},
		);
	}

	/**
	 * Handle save request by getting filename from user and sending request to service
	 */
	public onSaveResults(
		uri: string,
		batchIndex: number,
		resultSetNo: number,
		format: string,
		selection: Interfaces.ISlickRange[],
	): Thenable<void> {
		this._uri = uri;

		// prompt for filepath
		return this.promptForFilepath(format).then(
			(filePath): void => {
				if (!Utils.isEmpty(filePath)) {
					this.sendRequestToService(
						filePath,
						batchIndex,
						resultSetNo,
						format,
						selection ? selection[0] : undefined,
					);
				}
			},
			(error) => {
				this._vscodeWrapper.showErrorMessage(error.message);
				this._vscodeWrapper.logToOutputChannel(error.message);
			},
		);
	}

	/**
	 * Open the saved file in a new vscode editor pane
	 */
	public openSavedFile(filePath: string, format: string): void {
		if (format === "excel") {
			// This will not open in VSCode as it's treated as binary. Use the native file opener instead
			// Note: must use filePath here, URI does not open correctly
			opener(filePath, undefined, (error, stdout, stderr) => {
				if (error) {
					this._vscodeWrapper.showErrorMessage(error);
				}
			});
		} else {
			const uri = vscode.Uri.file(filePath);
			this._vscodeWrapper.openTextDocument(uri).then(
				(doc: vscode.TextDocument) => {
					// Show open document and set focus
					this._vscodeWrapper
						.showTextDocument(doc, 1, false)
						.then(undefined, (error: any) => {
							this._vscodeWrapper.showErrorMessage(error);
						});
				},
				(error: any) => {
					this._vscodeWrapper.showErrorMessage(error);
				},
			);
		}
	}
}
