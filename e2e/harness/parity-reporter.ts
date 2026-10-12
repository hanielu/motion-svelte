import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";

type Outcome = "pass" | "known-failure" | "unsupported" | "skipped" | "unexpected";

/**
 * Prints the upstream parity score after a run: how much of motion's own Cypress suite motion-sv passes.
 * Ported tests are classified in the specs themselves: `test.fail(true, "motion-sv: ...")` marks a known behavior
 * difference, `test.skip(true, "unsupported: ...")` an API motion-sv doesn't have. Other skips are tests upstream skips
 * itself or that can't pass in this browser even for upstream (`"env: ..."`).
 */
export default class ParityReporter implements Reporter {
	private readonly outcomes = new Map<string, { test: TestCase; outcome: Outcome }>();

	onTestEnd(test: TestCase, result: TestResult) {
		if (test.parent.project()?.name !== "upstream") return;
		this.outcomes.set(test.id, { test, outcome: classify(test, result) });
	}

	onEnd() {
		if (!this.outcomes.size) return;
		const count = (outcome: Outcome) => [...this.outcomes.values()].filter((o) => o.outcome === outcome).length;
		const pass = count("pass");
		const known = count("known-failure");
		const unexpected = [...this.outcomes.values()].filter((o) => o.outcome === "unexpected");
		const portable = pass + known + unexpected.length;

		const lines = [
			"",
			`Upstream parity: ${pass}/${portable} portable tests pass (${((pass / portable) * 100).toFixed(1)}%)`,
			`  ${pass} pass · ${known} known motion-sv failures · ${count("unsupported")} unsupported · ${count("skipped")} skipped (upstream/env)`,
		];
		if (unexpected.length) {
			lines.push(`  ${unexpected.length} unexpected (new failure, or a known failure that now passes):`);
			for (const { test } of unexpected) lines.push(`    ${test.titlePath().slice(2).join(" › ")}`);
		}
		console.log(lines.join("\n"));
	}
}

function classify(test: TestCase, result: TestResult): Outcome {
	if (result.status === "skipped") {
		const unsupported = test.annotations.some((a) => a.type === "skip" && a.description?.startsWith("unsupported"));
		return unsupported ? "unsupported" : "skipped";
	}
	if (test.expectedStatus === "failed") return result.status === "failed" ? "known-failure" : "unexpected";
	return result.status === "passed" ? "pass" : "unexpected";
}
