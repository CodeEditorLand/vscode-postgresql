// Type definitions for Jasmine 2.5
// Project: http://jasmine.github.io/
// Definitions by: Boris Yankov <https://github.com/borisyankov/>, Theodore Brown <https://github.com/theodorejb>, David Pärsson <https://github.com/davidparsson/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// For ddescribe / iit use : https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/karma-jasmine/karma-jasmine.d.ts

declare function describe(
	description: string,
	specDefinitions: () => void,
): void;
declare function fdescribe(
	description: string,
	specDefinitions: () => void,
): void;
declare function xdescribe(
	description: string,
	specDefinitions: () => void,
): void;

declare function it(
	expectation: string,
	assertion?: (done: DoneFn) => void,
	timeout?: number,
): void;
declare function fit(
	expectation: string,
	assertion?: (done: DoneFn) => void,
	timeout?: number,
): void;
declare function xit(
	expectation: string,
	assertion?: (done: DoneFn) => void,
	timeout?: number,
): void;

/** If you call the function pending anywhere in the spec body, no matter the expectations, the spec will be marked pending. */
declare function pending(reason?: string): void;

declare function beforeEach(
	action: (done: DoneFn) => void,
	timeout?: number,
): void;
declare function afterEach(
	action: (done: DoneFn) => void,
	timeout?: number,
): void;

declare function beforeAll(
	action: (done: DoneFn) => void,
	timeout?: number,
): void;
declare function afterAll(
	action: (done: DoneFn) => void,
	timeout?: number,
): void;

declare function expect(spy: Function): jasmine.Matchers;
declare function expect(actual: any): jasmine.Matchers;

declare function fail(e?: any): void;
/** Action method that should be called when the async work is complete */
interface DoneFn extends Function {
	(): void;

	/** fails the spec and indicates that it has completed. If the message is an Error, Error.message is used */
	fail: (message?: Error | string) => void;
}

declare function spyOn(object: any, method: string): jasmine.Spy;

declare function runs(asyncMethod: Function): void;
declare function waitsFor(
	latchMethod: () => boolean,
	failureMessage?: string,
	timeout?: number,
): void;
declare function waits(timeout?: number): void;

declare namespace jasmine {
	var clock: () => Clock;

	function any(aclass: any): Any;

	function anything(): Any;

	function arrayContaining(sample: any[]): ArrayContaining;

	function objectContaining(sample: any): ObjectContaining;

	function createSpy(name: string, originalFn?: Function): Spy;

	function createSpyObj(baseName: string, methodNames: any[]): any;

	function createSpyObj<T>(baseName: string, methodNames: any[]): T;

	function pp(value: any): string;

	function getEnv(): Env;

	function addCustomEqualityTester(
		equalityTester: CustomEqualityTester,
	): void;

	function addMatchers(matchers: CustomMatcherFactories): void;

	function stringMatching(str: string): Any;

	function stringMatching(str: RegExp): Any;

	function formatErrorMsg(
		domain: string,
		usage: string,
	): (msg: string) => string;

	interface Any {
		new (expectedClass: any): any;

		jasmineMatches(other: any): boolean;

		jasmineToString(): string;
	}

	// taken from TypeScript lib.core.es6.d.ts, applicable to CustomMatchers.contains()
	interface ArrayLike<T> {
		length: number;
		[n: number]: T;
	}

	interface ArrayContaining {
		new (sample: any[]): any;

		asymmetricMatch(other: any): boolean;

		jasmineToString(): string;
	}

	interface ObjectContaining {
		new (sample: any): any;

		jasmineMatches(
			other: any,
			mismatchKeys: any[],
			mismatchValues: any[],
		): boolean;

		jasmineToString(): string;
	}

	interface Block {
		new (env: Env, func: SpecFunction, spec: Spec): any;

		execute(onComplete: () => void): void;
	}

	interface WaitsBlock extends Block {
		new (env: Env, timeout: number, spec: Spec): any;
	}

	interface WaitsForBlock extends Block {
		new (
			env: Env,
			timeout: number,
			latchFunction: SpecFunction,
			message: string,
			spec: Spec,
		): any;
	}

	interface Clock {
		install(): void;

		uninstall(): void;
		/** Calls to any registered callback are triggered when the clock is ticked forward via the jasmine.clock().tick function, which takes a number of milliseconds. */
		tick(ms: number): void;

		mockDate(date?: Date): void;

		withMock(func: () => void): void;
	}

	interface CustomEqualityTester {
		(first: any, second: any): boolean;
	}

	interface CustomMatcher {
		compare<T>(actual: T, expected: T): CustomMatcherResult;

		compare(actual: any, expected: any): CustomMatcherResult;
	}

	interface CustomMatcherFactory {
		(
			util: MatchersUtil,
			customEqualityTesters: Array<CustomEqualityTester>,
		): CustomMatcher;
	}

	interface CustomMatcherFactories {
		[index: string]: CustomMatcherFactory;
	}

	interface CustomMatcherResult {
		pass: boolean;

		message?: string;
	}

	interface MatchersUtil {
		equals(
			a: any,
			b: any,
			customTesters?: Array<CustomEqualityTester>,
		): boolean;

		contains<T>(
			haystack: ArrayLike<T> | string,
			needle: any,
			customTesters?: Array<CustomEqualityTester>,
		): boolean;

		buildFailureMessage(
			matcherName: string,
			isNot: boolean,
			actual: any,
			...expected: Array<any>
		): string;
	}

	interface Env {
		setTimeout: any;

		clearTimeout: void;

		setInterval: any;

		clearInterval: void;

		updateInterval: number;

		currentSpec: Spec;

		matchersClass: Matchers;

		version(): any;

		versionString(): string;

		nextSpecId(): number;

		addReporter(reporter: Reporter): void;

		execute(): void;

		describe(description: string, specDefinitions: () => void): Suite;
		// ddescribe(description: string, specDefinitions: () => void): Suite; Not a part of jasmine. Angular team adds these
		beforeEach(beforeEachFunction: () => void): void;

		beforeAll(beforeAllFunction: () => void): void;

		currentRunner(): Runner;

		afterEach(afterEachFunction: () => void): void;

		afterAll(afterAllFunction: () => void): void;

		xdescribe(desc: string, specDefinitions: () => void): XSuite;

		it(description: string, func: () => void): Spec;
		// iit(description: string, func: () => void): Spec; Not a part of jasmine. Angular team adds these
		xit(desc: string, func: () => void): XSpec;

		compareRegExps_(
			a: RegExp,
			b: RegExp,
			mismatchKeys: string[],
			mismatchValues: string[],
		): boolean;

		compareObjects_(
			a: any,
			b: any,
			mismatchKeys: string[],
			mismatchValues: string[],
		): boolean;

		equals_(
			a: any,
			b: any,
			mismatchKeys: string[],
			mismatchValues: string[],
		): boolean;

		contains_(haystack: any, needle: any): boolean;

		addCustomEqualityTester(equalityTester: CustomEqualityTester): void;

		addMatchers(matchers: CustomMatcherFactories): void;

		specFilter(spec: Spec): boolean;

		throwOnExpectationFailure(value: boolean): void;

		seed(seed: string | number): string | number;

		provideFallbackReporter(reporter: Reporter): void;

		throwingExpectationFailures(): boolean;

		allowRespy(allow: boolean): void;

		randomTests(): boolean;

		randomizeTests(b: boolean): void;
	}

	interface FakeTimer {
		new (): any;

		reset(): void;

		tick(millis: number): void;

		runFunctionsWithinRange(oldMillis: number, nowMillis: number): void;

		scheduleFunction(
			timeoutKey: any,
			funcToCall: () => void,
			millis: number,
			recurring: boolean,
		): void;
	}

	interface HtmlReporter {
		new (): any;
	}

	interface HtmlSpecFilter {
		new (): any;
	}

	interface Result {
		type: string;
	}

	interface NestedResults extends Result {
		description: string;

		totalCount: number;

		passedCount: number;

		failedCount: number;

		skipped: boolean;

		rollupCounts(result: NestedResults): void;

		log(values: any): void;

		getItems(): Result[];

		addResult(result: Result): void;

		passed(): boolean;
	}

	interface MessageResult extends Result {
		values: any;

		trace: Trace;
	}

	interface ExpectationResult extends Result {
		matcherName: string;

		passed(): boolean;

		expected: any;

		actual: any;

		message: string;

		trace: Trace;
	}

	interface Order {
		new (options: { random: boolean; seed: string }): any;

		random: boolean;

		seed: string;

		sort<T>(items: T[]): T[];
	}

	namespace errors {
		class ExpectationFailed extends Error {
			constructor();

			stack: any;
		}
	}

	interface TreeProcessor {
		new (attrs: any): any;

		execute: (done: Function) => void;

		processTree(): any;
	}

	interface Trace {
		name: string;

		message: string;

		stack: any;
	}

	interface PrettyPrinter {
		new (): any;

		format(value: any): void;

		iterateObject(
			obj: any,
			fn: (property: string, isGetter: boolean) => void,
		): void;

		emitScalar(value: any): void;

		emitString(value: string): void;

		emitArray(array: any[]): void;

		emitObject(obj: any): void;

		append(value: any): void;
	}

	interface StringPrettyPrinter extends PrettyPrinter {}

	interface Queue {
		new (env: any): any;

		env: Env;

		ensured: boolean[];

		blocks: Block[];

		running: boolean;

		index: number;

		offset: number;

		abort: boolean;

		addBefore(block: Block, ensure?: boolean): void;

		add(block: any, ensure?: boolean): void;

		insertNext(block: any, ensure?: boolean): void;

		start(onComplete?: () => void): void;

		isRunning(): boolean;

		next_(): void;

		results(): NestedResults;
	}

	interface Matchers {
		new (env: Env, actual: any, spec: Env, isNot?: boolean): any;

		env: Env;

		actual: any;

		spec: Env;

		isNot?: boolean;

		message(): any;

		toBe(expected: any, expectationFailOutput?: any): boolean;

		toEqual(expected: any, expectationFailOutput?: any): boolean;

		toMatch(
			expected: string | RegExp,
			expectationFailOutput?: any,
		): boolean;

		toBeDefined(expectationFailOutput?: any): boolean;

		toBeUndefined(expectationFailOutput?: any): boolean;

		toBeNull(expectationFailOutput?: any): boolean;

		toBeNaN(): boolean;

		toBeTruthy(expectationFailOutput?: any): boolean;

		toBeFalsy(expectationFailOutput?: any): boolean;

		toHaveBeenCalled(): boolean;

		toHaveBeenCalledWith(...params: any[]): boolean;

		toHaveBeenCalledTimes(expected: number): boolean;

		toContain(expected: any, expectationFailOutput?: any): boolean;

		toBeLessThan(expected: number, expectationFailOutput?: any): boolean;

		toBeLessThanOrEqual(
			expected: number,
			expectationFailOutput?: any,
		): boolean;

		toBeGreaterThan(expected: number, expectationFailOutput?: any): boolean;

		toBeGreaterThanOrEqual(
			expected: number,
			expectationFailOutput?: any,
		): boolean;

		toBeCloseTo(
			expected: number,
			precision?: any,
			expectationFailOutput?: any,
		): boolean;

		toThrow(expected?: any): boolean;

		toThrowError(message?: string | RegExp): boolean;

		toThrowError(
			expected?: new (...args: any[]) => Error,
			message?: string | RegExp,
		): boolean;

		not: Matchers;

		Any: Any;
	}

	interface Reporter {
		reportRunnerStarting(runner: Runner): void;

		reportRunnerResults(runner: Runner): void;

		reportSuiteResults(suite: Suite): void;

		reportSpecStarting(spec: Spec): void;

		reportSpecResults(spec: Spec): void;

		log(str: string): void;
	}

	interface MultiReporter extends Reporter {
		addReporter(reporter: Reporter): void;
	}

	interface Runner {
		new (env: Env): any;

		execute(): void;

		beforeEach(beforeEachFunction: SpecFunction): void;

		afterEach(afterEachFunction: SpecFunction): void;

		beforeAll(beforeAllFunction: SpecFunction): void;

		afterAll(afterAllFunction: SpecFunction): void;

		finishCallback(): void;

		addSuite(suite: Suite): void;

		add(block: Block): void;

		specs(): Spec[];

		suites(): Suite[];

		topLevelSuites(): Suite[];

		results(): NestedResults;
	}

	interface SpecFunction {
		(spec?: Spec): void;
	}

	interface SuiteOrSpec {
		id: number;

		env: Env;

		description: string;

		queue: Queue;
	}

	interface Spec extends SuiteOrSpec {
		new (env: Env, suite: Suite, description: string): any;

		suite: Suite;

		afterCallbacks: SpecFunction[];

		spies_: Spy[];

		results_: NestedResults;

		matchersClass: Matchers;

		getFullName(): string;

		results(): NestedResults;

		log(arguments: any): any;

		runs(func: SpecFunction): Spec;

		addToQueue(block: Block): void;

		addMatcherResult(result: Result): void;

		getResult(): any;

		expect(actual: any): any;

		waits(timeout: number): Spec;

		waitsFor(
			latchFunction: SpecFunction,
			timeoutMessage?: string,
			timeout?: number,
		): Spec;

		fail(e?: any): void;

		getMatchersClass_(): Matchers;

		addMatchers(matchersPrototype: CustomMatcherFactories): void;

		finishCallback(): void;

		finish(onComplete?: () => void): void;

		after(doAfter: SpecFunction): void;

		execute(onComplete?: () => void, enabled?: boolean): any;

		addBeforesAndAftersToQueue(): void;

		explodes(): void;

		spyOn(
			obj: any,
			methodName: string,
			ignoreMethodDoesntExist: boolean,
		): Spy;

		removeAllSpies(): void;

		throwOnExpectationFailure: boolean;
	}

	interface XSpec {
		id: number;

		runs(): void;
	}

	interface Suite extends SuiteOrSpec {
		new (
			env: Env,
			description: string,
			specDefinitions: () => void,
			parentSuite: Suite,
		): any;

		parentSuite: Suite;

		getFullName(): string;

		finish(onComplete?: () => void): void;

		beforeEach(beforeEachFunction: SpecFunction): void;

		afterEach(afterEachFunction: SpecFunction): void;

		beforeAll(beforeAllFunction: SpecFunction): void;

		afterAll(afterAllFunction: SpecFunction): void;

		results(): NestedResults;

		add(suiteOrSpec: SuiteOrSpec): void;

		specs(): Spec[];

		suites(): Suite[];

		children(): any[];

		execute(onComplete?: () => void): void;
	}

	interface XSuite {
		execute(): void;
	}

	interface Spy {
		(...params: any[]): any;

		identity: string;

		and: SpyAnd;

		calls: Calls;

		mostRecentCall: { args: any[] };

		argsForCall: any[];

		wasCalled: boolean;
	}

	interface SpyAnd {
		/** By chaining the spy with and.callThrough, the spy will still track all calls to it but in addition it will delegate to the actual implementation. */
		callThrough(): Spy;
		/** By chaining the spy with and.returnValue, all calls to the function will return a specific value. */
		returnValue(val: any): Spy;
		/** By chaining the spy with and.returnValues, all calls to the function will return specific values in order until it reaches the end of the return values list. */
		returnValues(...values: any[]): Spy;
		/** By chaining the spy with and.callFake, all calls to the spy will delegate to the supplied function. */
		callFake(fn: Function): Spy;
		/** By chaining the spy with and.throwError, all calls to the spy will throw the specified value. */
		throwError(msg: string): Spy;
		/** When a calling strategy is used for a spy, the original stubbing behavior can be returned at any time with and.stub. */
		stub(): Spy;
	}

	interface Calls {
		/** By chaining the spy with calls.any(), will return false if the spy has not been called at all, and then true once at least one call happens. **/
		any(): boolean;
		/** By chaining the spy with calls.count(), will return the number of times the spy was called **/
		count(): number;
		/** By chaining the spy with calls.argsFor(), will return the arguments passed to call number index **/
		argsFor(index: number): any[];
		/** By chaining the spy with calls.allArgs(), will return the arguments to all calls **/
		allArgs(): any[];
		/** By chaining the spy with calls.all(), will return the context (the this) and arguments passed all calls **/
		all(): CallInfo[];
		/** By chaining the spy with calls.mostRecent(), will return the context (the this) and arguments for the most recent call **/
		mostRecent(): CallInfo;
		/** By chaining the spy with calls.first(), will return the context (the this) and arguments for the first call **/
		first(): CallInfo;
		/** By chaining the spy with calls.reset(), will clears all tracking for a spy **/
		reset(): void;
	}

	interface CallInfo {
		/** The context (the this) for the call */
		object: any;
		/** All arguments passed to the call */
		args: any[];
		/** The return value of the call */
		returnValue: any;
	}

	interface Util {
		inherit(childClass: Function, parentClass: Function): any;

		formatException(e: any): any;

		htmlEscape(str: string): string;

		argsToArray(args: any): any;

		extend(destination: any, source: any): any;
	}

	interface JsApiReporter extends Reporter {
		started: boolean;

		finished: boolean;

		result: any;

		messages: any;

		runDetails: {
			failedExpectations: ExpectationResult[];

			order: jasmine.Order;
		};

		new (): any;

		suites(): Suite[];

		summarize_(suiteOrSpec: SuiteOrSpec): any;

		results(): any;

		resultsForSpec(specId: any): any;

		log(str: any): any;

		resultsForSpecs(specIds: any): any;

		summarizeResult_(result: any): any;
	}

	interface Jasmine {
		Spec: Spec;

		clock: Clock;

		util: Util;
	}

	export var HtmlReporter: HtmlReporter;

	export var HtmlSpecFilter: HtmlSpecFilter;

	export var DEFAULT_TIMEOUT_INTERVAL: number;
}
