import { NotificationType, RequestType } from "vscode-languageclient";

import { IDbColumn, IResultMessage, ISelectionData } from "./../interfaces";

export class ResultSetSummary {
	id: number;

	batchId: number;

	rowCount: number;

	columnInfo: IDbColumn[];
}

export class BatchSummary {
	hasError: boolean;

	id: number;

	selection: ISelectionData;

	resultSetSummaries: ResultSetSummary[];

	executionElapsed: string;

	executionEnd: string;

	executionStart: string;
}

/// ------------------------------- < Query Execution Complete Notification > ------------------------------------
export namespace QueryExecuteCompleteNotification {
	export const type = new NotificationType<
		QueryExecuteCompleteNotificationResult,
		void
	>("query/complete");
}

export class QueryExecuteCompleteNotificationResult {
	ownerUri: string;

	batchSummaries: BatchSummary[];
}

// Query Batch Notification -----------------------------------------------------------------------
export class QueryExecuteBatchNotificationParams {
	batchSummary: BatchSummary;

	ownerUri: string;
}

// ------------------------------- < Query Batch Start  Notification > ------------------------------------
export namespace QueryExecuteBatchStartNotification {
	export const type = new NotificationType<
		QueryExecuteBatchNotificationParams,
		void
	>("query/batchStart");
}

// ------------------------------- < Query Batch Complete Notification > ------------------------------------
export namespace QueryExecuteBatchCompleteNotification {
	export const type = new NotificationType<
		QueryExecuteBatchNotificationParams,
		void
	>("query/batchComplete");
}

// Query ResultSet Complete Notification -----------------------------------------------------------
export namespace QueryExecuteResultSetCompleteNotification {
	export const type = new NotificationType<
		QueryExecuteResultSetCompleteNotificationParams,
		void
	>("query/resultSetComplete");
}

export class QueryExecuteResultSetCompleteNotificationParams {
	resultSetSummary: ResultSetSummary;

	ownerUri: string;
}

// ------------------------------- < Query Message Notification > ------------------------------------
export namespace QueryExecuteMessageNotification {
	export const type = new NotificationType<QueryExecuteMessageParams, void>(
		"query/message",
	);
}

export class QueryExecuteMessageParams {
	message: IResultMessage;

	ownerUri: string;
}

// ------------------------------- < Query Execution Request > ------------------------------------
export namespace QueryExecuteRequest {
	export const type = new RequestType<
		QueryExecuteParams,
		QueryExecuteResult,
		void,
		void
	>("query/executeDocumentSelection");
}

export namespace QueryExecuteStatementRequest {
	export const type = new RequestType<
		QueryExecuteStatementParams,
		QueryExecuteResult,
		void,
		void
	>("query/executedocumentstatement");
}

export class QueryExecuteParams {
	ownerUri: string;

	querySelection: ISelectionData;
}

export class QueryExecuteStatementParams {
	ownerUri: string;

	line: number;

	column: number;
}

export class QueryExecuteResult {}

// ------------------------------- < Query Results Request > ------------------------------------
export namespace QueryExecuteSubsetRequest {
	export const type = new RequestType<
		QueryExecuteSubsetParams,
		QueryExecuteSubsetResult,
		void,
		void
	>("query/subset");
}

export class QueryExecuteSubsetParams {
	ownerUri: string;

	batchIndex: number;

	resultSetIndex: number;

	rowsStartIndex: number;

	rowsCount: number;
}

export class DbCellValue {
	displayValue: string;

	isNull: boolean;
}

export class ResultSetSubset {
	rowCount: number;

	rows: DbCellValue[][];
}

export class QueryExecuteSubsetResult {
	resultSubset: ResultSetSubset;
}

// --------------------------------- </ Query Results Request > ------------------------------------------
