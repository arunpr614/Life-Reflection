import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const readText = (filePath) => fs.readFileSync(path.join(repoRoot, filePath), "utf8");
const readJson = (filePath) => JSON.parse(readText(filePath));
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const sameSet = (left, right) => left.size === right.size && [...left].every((value) => right.has(value));
const sha256 = (content) => crypto.createHash("sha256").update(content).digest("hex");
const fullCommitPattern = /^[0-9a-f]{40}$/;
const opaqueEvidencePattern = /^[a-z][a-z0-9-]*:[A-Za-z0-9._/-]{4,}$/;
const isOpaqueEvidenceReference = (value) => typeof value === "string"
  && opaqueEvidencePattern.test(value)
  && !value.includes("://")
  && !/(?:pending|unknown|tbd|placeholder)/i.test(value);
const gitSuccess = (args) => {
  try {
    execFileSync("git", args, { cwd: repoRoot, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};
const gitFileSha256 = (revision, filePath) => {
  try {
    const content = execFileSync("git", ["show", `${revision}:${filePath}`], {
      cwd: repoRoot,
      encoding: null,
      maxBuffer: 16 * 1024 * 1024,
    });
    return sha256(content);
  } catch {
    return null;
  }
};
const revisionExists = (revision) => fullCommitPattern.test(revision ?? "")
  && gitSuccess(["cat-file", "-e", `${revision}^{commit}`]);
const revisionIsPublished = (revision) => revisionExists(revision)
  && gitSuccess(["merge-base", "--is-ancestor", revision, "refs/remotes/origin/main"]);
const countBy = (values) => Object.fromEntries(
  [...new Set(values)].sort().map((value) => [value, values.filter((candidate) => candidate === value).length]),
);
const walkFiles = (relativeDirectory) => {
  const absoluteDirectory = path.join(repoRoot, relativeDirectory);
  const files = [];
  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(relativePath));
    if (entry.isFile()) files.push(relativePath);
  }
  return files;
};

const manifestPath = "docs/project/PHASE1-ROADMAP-MANIFEST.json";
const taskStatePath = "docs/project/P0-PHASE1-TASK-STATE.json";
const issueMapPath = "docs/project/PHASE1-GITHUB-ISSUES.json";
const artifactRegisterPath = "docs/project/P0-PHASE1-TASK-ARTIFACT-REGISTER.json";
const readinessStatePath = "docs/project/P0-PHASE1-TASK-READINESS-STATE.json";
const manifest = readJson(manifestPath);
const taskState = readJson(taskStatePath);
const issueMap = readJson(issueMapPath).issues ?? {};
const artifactRegister = readJson(artifactRegisterPath);
const readinessState = readJson(readinessStatePath);
const dossierById = new Map(artifactRegister.tasks.map((record) => [record.taskId, record]));
const productRequirements = readText("docs/product/PRODUCT-REQUIREMENTS.md");
const traceability = readText("docs/project/REQUIREMENTS-TRACEABILITY.md");
const r4Release = readText("docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md");
const uxSpecification = readText("docs/design/UX-SPECIFICATION.md");
const architecturePlan = readText("docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md");
const sharedArchitecturePlan = readText("docs/architecture/IMPLEMENTATION-PLAN.md");
const r0Prd = readText("docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md");
const r3Prd = readText("docs/product/releases/PRD-R3-RETRIEVAL-DATE-INTEGRITY.md");
const prototypeTracker = readText("docs/project/PROTOTYPE-COMPLETENESS-TRACKER.md");
const requirementPattern = /\bLID-[A-Z]+-\d{3}\b/g;
const prdIds = new Set(productRequirements.match(requirementPattern) ?? []);
const traceabilityIds = new Set(traceability.match(requirementPattern) ?? []);
const manifestIds = new Set(manifest.requirementMap.map((entry) => entry.requirementId));
const deferredIds = new Set(
  manifest.requirementMap
    .filter((entry) => entry.primaryMilestone === "Deferred")
    .map((entry) => entry.requirementId),
);
const expectedDeferred = new Set([
  "LID-UP-004",
  "LID-DEF-001",
  "LID-DEF-002",
  "LID-DEF-003",
  "LID-DEF-004",
  "LID-DEF-005",
  "LID-DEF-006",
]);

check(prdIds.size === 78, `GOV-REQ-001: governing PRD has ${prdIds.size} unique requirement IDs, expected 78`);
check(traceabilityIds.size === 78, `GOV-REQ-002: traceability has ${traceabilityIds.size} unique requirement IDs, expected 78`);
check(manifestIds.size === 78, `GOV-REQ-003: manifest has ${manifestIds.size} unique requirement IDs, expected 78`);
check(sameSet(prdIds, traceabilityIds), "GOV-REQ-004: governing PRD and traceability requirement-ID sets differ");
check(sameSet(prdIds, manifestIds), "GOV-REQ-005: governing PRD and manifest requirement-ID sets differ");
check(sameSet(deferredIds, expectedDeferred), "GOV-REQ-006: deferred requirement set is not the exact approved seven IDs");
check(manifest.summary?.activeRequirementCount === 71, "GOV-REQ-007: active requirement count is not 71");

const tasks = manifest.tasks ?? [];
const taskIds = new Set(tasks.map((task) => task.id));
check(tasks.length === 58 && taskIds.size === 58, `GOV-TASK-001: got ${tasks.length}/${taskIds.size} total/unique tasks, expected 58/58`);
check(tasks.filter((task) => task.milestone !== "R10").length === 55, "GOV-TASK-002: P0/R0-R9 task count is not 55");
check(tasks.filter((task) => task.milestone === "R10").length === 3, "GOV-TASK-003: R10 task count is not 3");
const actualStatuses = countBy(tasks.map((task) => task.status));
const expectedStatuses = { Backlog: 40, Done: 13, "In progress": 1, Next: 4 };
check(JSON.stringify(actualStatuses) === JSON.stringify(expectedStatuses), `GOV-TASK-004: status counts are ${JSON.stringify(actualStatuses)}, expected ${JSON.stringify(expectedStatuses)}`);
check(
  tasks.filter((task) => task.milestone === "R10").every((task) => task.startDate === null && task.targetDate === null),
  "GOV-TASK-005: every R10 task must have null start and target dates",
);
check(
  manifest.releases.find((release) => release.id === "R10")?.startDate === null
    && manifest.releases.find((release) => release.id === "R10")?.targetDate === null,
  "GOV-TASK-006: the R10 milestone must have null start and target dates",
);
check(Object.keys(issueMap).length === 58 && sameSet(new Set(Object.keys(issueMap)), taskIds), "GOV-TASK-007: public issue-map IDs must equal the 58 manifest task IDs");
check(artifactRegister.tasks.length === 58 && dossierById.size === 58, "GOV-DOR-001: task-artifact register must have 58 unique records");
check(sameSet(new Set(dossierById.keys()), taskIds), "GOV-DOR-002: task-artifact register IDs must equal manifest task IDs");
check(artifactRegister.readinessStatePath === readinessStatePath, "GOV-DOR-033: register does not identify the canonical readiness-state input");
check(artifactRegister.schemaVersion === "1.1.0" && readinessState.schemaVersion === "1.1.0", "GOV-DOR-039: readiness/register schema version is not 1.1.0");
check(JSON.stringify(artifactRegister.approvalModel) === JSON.stringify(readinessState.approvalModel), "GOV-DOR-040: readiness/register approval models differ");
check(
  artifactRegister.readinessStateUrl === `https://github.com/arunpr614/Life-Reflection/blob/main/${readinessStatePath}`,
  "GOV-DOR-034: readiness-state URL/path mismatch",
);
const unknownReadinessOverrides = Object.keys(readinessState.taskOverrides ?? {}).filter((taskId) => !taskIds.has(taskId));
check(unknownReadinessOverrides.length === 0, `GOV-DOR-035: readiness-state overrides contain unknown IDs: ${unknownReadinessOverrides.join(", ")}`);

const allowedArtifactStates = new Set(["missing", "draft", "in-review", "approved", "blocked", "not-applicable"]);
const executionPermittingVerdicts = new Set(["ready-local-synthetic", "ready-private-execution", "proceed-release"]);
const artifactKinds = ["product", "architecture", "design", "qa", "delivery", "council"];
const councilSeats = ["product", "design", "architecture", "qa", "project"];
const artifactReviewDecisions = new Set(["hold", "approved", "not-applicable"]);
const councilSeatVerdicts = new Set(["hold", "approved", "not-applicable"]);
const designStateDimensions = ["normal", "empty", "loading", "error", "interruption", "destructive"];
const designAccessibilityDimensions = ["keyboard", "focus", "screenReader", "targetSize", "contrast", "zoom", "reducedMotion"];
const allScenarioIds = new Set();

for (const task of tasks) {
  const dossier = dossierById.get(task.id);
  check(Boolean(dossier), `GOV-DOR-003: ${task.id} has no dossier record`);
  if (dossier) {
    check(JSON.stringify(task.taskDossier) === JSON.stringify(dossier), `GOV-DOR-004: ${task.id} manifest dossier differs from the central register`);
    check(task.artifactReadiness === dossier.artifactReadiness, `GOV-DOR-005: ${task.id} readiness projection differs`);
    check(task.executionAllowed === dossier.executionAllowed, `GOV-DOR-006: ${task.id} executionAllowed projection differs`);
    check(task.executionScope === dossier.executionScope, `GOV-DOR-007: ${task.id} execution scope projection differs`);
    check(JSON.stringify(task.requirementIds) === JSON.stringify(dossier.requirementIds), `GOV-DOR-008: ${task.id} dossier requirement IDs differ from the manifest`);
    check(dossier.acceptanceScenarioIds.length > 0, `GOV-DOR-009: ${task.id} has no task acceptance scenario IDs`);
    for (const scenarioId of dossier.acceptanceScenarioIds) {
      check(!allScenarioIds.has(scenarioId), `GOV-DOR-010: duplicate acceptance scenario ID ${scenarioId}`);
      allScenarioIds.add(scenarioId);
    }
    for (const kind of artifactKinds) {
      const artifact = dossier.artifacts?.[kind];
      const review = dossier.artifactReviews?.[kind];
      check(Boolean(artifact), `GOV-DOR-011: ${task.id} lacks ${kind} artifact metadata`);
      check(Boolean(review), `GOV-DOR-041: ${task.id} lacks ${kind} structured artifact review`);
      if (!artifact) continue;
      check(allowedArtifactStates.has(artifact.state), `GOV-DOR-012: ${task.id} ${kind} has invalid state ${artifact.state}`);
      check(allowedArtifactStates.has(artifact.contentState), `GOV-DOR-042: ${task.id} ${kind} has invalid content state ${artifact.contentState}`);
      check(path.basename(artifact.path).startsWith("P0-"), `GOV-NAME-004: ${task.id} ${kind} artifact lacks P0- prefix`);
      check(path.basename(artifact.path).includes(task.id), `GOV-DOR-013: ${task.id} ${kind} basename lacks the task ID`);
      const absoluteArtifactPath = path.join(repoRoot, artifact.path);
      check(fs.existsSync(absoluteArtifactPath), `GOV-DOR-014: ${task.id} ${kind} artifact is missing: ${artifact.path}`);
      if (fs.existsSync(absoluteArtifactPath)) {
        const content = fs.readFileSync(absoluteArtifactPath, "utf8");
        const digest = sha256(content);
        check(digest === artifact.sha256, `GOV-DOR-015: ${task.id} ${kind} SHA-256 mismatch`);
        check(content.includes(`- **Task ID:** \`${task.id}\``), `GOV-DOR-016: ${task.id} ${kind} artifact lacks its task marker`);
        check(content.includes(`- **Artifact kind:** \`${kind}\``), `GOV-DOR-017: ${task.id} ${kind} artifact lacks its kind marker`);
        const contentState = content.match(/^- \*\*Artifact state:\*\* `([^`]+)`$/m)?.[1];
        check(contentState === artifact.contentState, `GOV-DOR-043: ${task.id} ${kind} content-state marker differs from the register`);
      }
      check(artifact.url === `https://github.com/arunpr614/Life-Reflection/blob/main/${artifact.path}`, `GOV-DOR-018: ${task.id} ${kind} URL/path mismatch`);
      if (review) {
        check(artifactReviewDecisions.has(review.decision), `GOV-DOR-044: ${task.id} ${kind} has invalid artifact-review decision ${review.decision}`);
        const expectedEffectiveState = review.decision === "approved"
          ? "approved"
          : review.decision === "not-applicable"
            ? "not-applicable"
            : ["approved", "not-applicable"].includes(artifact.contentState)
              ? "in-review"
              : artifact.contentState;
        check(artifact.state === expectedEffectiveState, `GOV-DOR-045: ${task.id} ${kind} effective state is not derived from content and review state`);
        if (["approved", "not-applicable"].includes(review.decision)) {
          check(typeof review.reviewer === "string" && review.reviewer.trim().length > 0, `GOV-DOR-046: ${task.id} ${kind} lacks a named reviewer`);
          check(fullCommitPattern.test(review.reviewedRevision ?? ""), `GOV-DOR-047: ${task.id} ${kind} lacks a full reviewed revision`);
          check(review.reviewedRevision === dossier.candidate?.revision, `GOV-DOR-048: ${task.id} ${kind} review does not bind the task candidate revision`);
          check(review.artifactSha256 === artifact.sha256, `GOV-DOR-049: ${task.id} ${kind} review does not bind the registered SHA-256`);
          check(review.dossierDigest === dossier.candidate?.dossierDigest, `GOV-DOR-050: ${task.id} ${kind} review does not bind the dossier digest`);
          check(isOpaqueEvidenceReference(review.evidenceReference), `GOV-DOR-051: ${task.id} ${kind} lacks a public-safe opaque review evidence reference`);
          check(revisionExists(review.reviewedRevision), `GOV-DOR-052: ${task.id} ${kind} reviewed revision does not exist locally`);
          check(revisionIsPublished(review.reviewedRevision), `GOV-DOR-053: ${task.id} ${kind} reviewed revision is not on fetched origin/main`);
          check(gitFileSha256(review.reviewedRevision, artifact.path) === artifact.sha256, `GOV-DOR-054: ${task.id} ${kind} bytes at the reviewed revision differ from the registered artifact`);
        }
        if (review.decision === "not-applicable") {
          check(["architecture", "design"].includes(kind), `GOV-DOR-055: ${task.id} ${kind} cannot be not-applicable`);
          check(typeof review.notApplicableRationale === "string" && review.notApplicableRationale.trim().length >= 20, `GOV-DOR-056: ${task.id} ${kind} lacks a concrete not-applicable rationale`);
          check(review.specialistConcurrence === true, `GOV-DOR-057: ${task.id} ${kind} lacks explicit specialist concurrence`);
        }
      }
    }
    const expectedCandidateArtifacts = Object.fromEntries(artifactKinds.map((kind) => [kind, {
      path: dossier.artifacts[kind].path,
      sha256: dossier.artifacts[kind].sha256,
    }]));
    check(dossier.candidate?.revision === dossier.council.reviewedRevision, `GOV-DOR-058: ${task.id} candidate and council revisions differ`);
    check(JSON.stringify(dossier.candidate?.artifacts) === JSON.stringify(expectedCandidateArtifacts), `GOV-DOR-059: ${task.id} candidate artifact bindings differ from the register`);
    const expectedDossierDigest = dossier.candidate?.revision
      ? `sha256:${sha256(JSON.stringify({ taskId: task.id, revision: dossier.candidate.revision, artifacts: expectedCandidateArtifacts }))}`
      : null;
    check(dossier.candidate?.dossierDigest === expectedDossierDigest, `GOV-DOR-060: ${task.id} dossier digest is invalid`);
    const coverage = dossier.designCoverage;
    check(["pending", "applicable", "not-applicable"].includes(coverage?.applicability), `GOV-DOR-061: ${task.id} Design applicability is invalid`);
    check(Array.isArray(coverage?.journeyIds), `GOV-DOR-062: ${task.id} Design journey IDs are not an array`);
    for (const dimension of designStateDimensions) check(Array.isArray(coverage?.stateCoverage?.[dimension]), `GOV-DOR-063: ${task.id} Design state coverage ${dimension} is not an array`);
    for (const dimension of designAccessibilityDimensions) check(Array.isArray(coverage?.accessibilityCoverage?.[dimension]), `GOV-DOR-064: ${task.id} Design accessibility coverage ${dimension} is not an array`);
    const designCoverageIds = [
      ...(coverage?.journeyIds ?? []),
      ...designStateDimensions.flatMap((dimension) => coverage?.stateCoverage?.[dimension] ?? []),
      ...designAccessibilityDimensions.flatMap((dimension) => coverage?.accessibilityCoverage?.[dimension] ?? []),
    ];
    for (const scenarioId of designCoverageIds) check(dossier.acceptanceScenarioIds.includes(scenarioId), `GOV-DOR-065: ${task.id} Design coverage references unknown scenario ${scenarioId}`);
    const seatEntries = dossier.council?.seatVerdicts ?? {};
    check(sameSet(new Set(Object.keys(seatEntries)), new Set(councilSeats)), `GOV-DOR-066: ${task.id} does not have exactly the five required council seats`);
    for (const seat of councilSeats) {
      const seatRecord = seatEntries[seat];
      check(councilSeatVerdicts.has(seatRecord?.verdict), `GOV-DOR-067: ${task.id} ${seat} has invalid council-seat verdict ${seatRecord?.verdict}`);
      if (["approved", "not-applicable"].includes(seatRecord?.verdict)) {
        check(typeof seatRecord.reviewer === "string" && seatRecord.reviewer.trim().length > 0, `GOV-DOR-068: ${task.id} ${seat} lacks a named council reviewer`);
        check(seatRecord.reviewedRevision === dossier.candidate?.revision, `GOV-DOR-069: ${task.id} ${seat} verdict does not bind the candidate revision`);
        check(seatRecord.dossierDigest === dossier.candidate?.dossierDigest, `GOV-DOR-070: ${task.id} ${seat} verdict does not bind the dossier digest`);
        check(isOpaqueEvidenceReference(seatRecord.evidenceReference), `GOV-DOR-071: ${task.id} ${seat} lacks a public-safe opaque verdict evidence reference`);
        check(typeof seatRecord.rationale === "string" && seatRecord.rationale.trim().length > 0, `GOV-DOR-072: ${task.id} ${seat} lacks a verdict rationale`);
      }
    }
    check(dossier.artifacts.product.required === true, `GOV-DOR-019: ${task.id} Product artifact must be required`);
    check(dossier.artifacts.qa.required === true, `GOV-DOR-020: ${task.id} QA artifact must be required`);
    check(dossier.artifacts.delivery.required === true, `GOV-DOR-021: ${task.id} Delivery artifact must be required`);
    check(dossier.artifacts.council.required === true, `GOV-DOR-022: ${task.id} Council artifact must be required`);
    if (dossier.executionAllowed) {
      check(dossier.artifactReadiness === "Ready", `GOV-DOR-023: ${task.id} execution is allowed without Ready artifacts`);
      for (const kind of ["product", "qa", "delivery", "council"]) {
        check(dossier.artifacts[kind].state === "approved", `GOV-DOR-024: ${task.id} execution is allowed without approved ${kind}`);
      }
      for (const kind of ["architecture", "design"]) {
        check(["approved", "not-applicable"].includes(dossier.artifacts[kind].state), `GOV-DOR-025: ${task.id} execution is allowed without approved/not-applicable ${kind}`);
      }
      if (dossier.artifacts.design.state === "approved") {
        check(coverage.applicability === "applicable", `GOV-DOR-073: ${task.id} approved Design is not marked applicable`);
        check(coverage.journeyIds.length > 0, `GOV-DOR-074: ${task.id} approved Design has no journey coverage`);
        for (const dimension of designStateDimensions) check(coverage.stateCoverage[dimension].length > 0, `GOV-DOR-075: ${task.id} approved Design lacks ${dimension} state coverage`);
        for (const dimension of designAccessibilityDimensions) check(coverage.accessibilityCoverage[dimension].length > 0, `GOV-DOR-076: ${task.id} approved Design lacks ${dimension} accessibility coverage`);
      }
      if (dossier.artifacts.design.state === "not-applicable") {
        check(coverage.applicability === "not-applicable", `GOV-DOR-077: ${task.id} Design not-applicable state lacks matching applicability`);
        check(typeof coverage.notApplicableRationale === "string" && coverage.notApplicableRationale.trim().length >= 20, `GOV-DOR-078: ${task.id} Design not-applicable coverage lacks a rationale`);
        check(dossier.council.seatVerdicts.design.verdict === "not-applicable", `GOV-DOR-079: ${task.id} Designer did not concur with not-applicable`);
      }
      const requiredSeatVerdicts = {
        product: "approved",
        design: dossier.artifacts.design.state === "not-applicable" ? "not-applicable" : "approved",
        architecture: dossier.artifacts.architecture.state === "not-applicable" ? "not-applicable" : "approved",
        qa: "approved",
        project: "approved",
      };
      for (const [seat, verdict] of Object.entries(requiredSeatVerdicts)) {
        check(dossier.council.seatVerdicts[seat].verdict === verdict, `GOV-DOR-080: ${task.id} ${seat} seat is ${dossier.council.seatVerdicts[seat].verdict}, expected ${verdict}`);
        check(dossier.council.seatVerdicts[seat].reviewedRevision === dossier.candidate.revision, `GOV-DOR-081: ${task.id} ${seat} seat does not bind the candidate revision`);
        check(dossier.council.seatVerdicts[seat].dossierDigest === dossier.candidate.dossierDigest, `GOV-DOR-082: ${task.id} ${seat} seat does not bind the dossier digest`);
      }
      check(dossier.dependenciesEntryEvidenceSatisfied === true, `GOV-DOR-026: ${task.id} execution is allowed without dependency entry evidence`);
      check(dossier.ownerActionsSatisfied === true, `GOV-DOR-027: ${task.id} execution is allowed with due owner actions incomplete`);
      check(dossier.openDecisions.length === 0, `GOV-DOR-028: ${task.id} execution is allowed with open decisions`);
      check(executionPermittingVerdicts.has(dossier.council.verdict), `GOV-DOR-029: ${task.id} execution is allowed under council verdict ${dossier.council.verdict}`);
      check(dossier.council.unresolvedBlockers.length === 0, `GOV-DOR-030: ${task.id} execution is allowed with council blockers`);
      check(fullCommitPattern.test(dossier.council.reviewedRevision ?? ""), `GOV-DOR-031: ${task.id} execution is allowed without a reviewed 40-character commit`);
      check(revisionIsPublished(dossier.council.reviewedRevision), `GOV-DOR-083: ${task.id} reviewed task candidate is not on fetched origin/main`);
      for (const kind of artifactKinds) check(gitFileSha256(dossier.council.reviewedRevision, dossier.artifacts[kind].path) === dossier.artifacts[kind].sha256, `GOV-DOR-084: ${task.id} ${kind} differs from the reviewed task candidate`);
      if (["ready-private-execution", "proceed-release"].includes(dossier.council.verdict)) {
        check(dossier.privateAuthorityState === "verified", `GOV-DOR-036: ${task.id} private/release execution is allowed without verified private authority`);
        check(/^P0-AUTH-[A-Z0-9-]{4,}$/.test(dossier.privateAuthorityEvidenceReference ?? ""), `GOV-DOR-085: ${task.id} private/release execution lacks a public-safe opaque authority evidence reference`);
      }
      const councilContent = readText(dossier.artifacts.council.path);
      check(councilContent.includes(`**\`${dossier.council.verdict}\`**`), `GOV-DOR-037: ${task.id} council artifact lacks its permitting verdict`);
      check(councilContent.includes("central readiness registry"), `GOV-DOR-038: ${task.id} council artifact lacks the non-self-referential revision-binding contract`);
    }
  }
  const expectedStatus = taskState.statusOverrides?.[task.id] ?? taskState.defaultStatus;
  check(task.status === expectedStatus, `GOV-STATE-001: ${task.id} manifest status does not match the task-state ledger`);
  for (const dependency of task.dependencies ?? []) {
    check(taskIds.has(dependency), `GOV-DEP-001: ${task.id} has unknown dependency ${dependency}`);
    check(dependency !== task.id, `GOV-DEP-002: ${task.id} depends on itself`);
  }
  const references = task.evidenceReferencePaths ?? [];
  if (["In progress", "Done"].includes(task.status)) {
    check(references.length > 0, `GOV-EVID-001: ${task.id} ${task.status} has no retrievable evidence reference`);
  }
  check(
    JSON.stringify(references) === JSON.stringify(taskState.evidenceReferences?.[task.id] ?? []),
    `GOV-EVID-002: ${task.id} manifest references differ from the task-state ledger`,
  );
  for (const [index, filePath] of references.entries()) {
    check(fs.existsSync(path.join(repoRoot, filePath)), `GOV-EVID-003: ${task.id} evidence path does not exist: ${filePath}`);
    check(
      task.evidenceReferenceUrls?.[index] === `https://github.com/arunpr614/Life-Reflection/blob/main/${filePath}`,
      `GOV-EVID-004: ${task.id} evidence URL does not match ${filePath}`,
    );
  }
  check(
    task.evidenceState === (["In progress", "Done"].includes(task.status) ? "Linked" : "Not yet provided"),
    `GOV-EVID-005: ${task.id} evidenceState is inconsistent with status`,
  );
}

const dependencyMap = new Map(tasks.map((task) => [task.id, task.dependencies ?? []]));
const visiting = new Set();
const visited = new Set();
const visit = (taskId, stack = []) => {
  if (visiting.has(taskId)) {
    failures.push(`GOV-DEP-003: dependency cycle: ${[...stack, taskId].join(" -> ")}`);
    return;
  }
  if (visited.has(taskId)) return;
  visiting.add(taskId);
  for (const dependency of dependencyMap.get(taskId) ?? []) visit(dependency, [...stack, taskId]);
  visiting.delete(taskId);
  visited.add(taskId);
};
for (const taskId of taskIds) visit(taskId);

const actionPhrases = [
  "keep the correction",
  "display newest upstream revision",
  "create a new correction based on both",
];
for (const [filePath, content] of [
  ["docs/product/PRODUCT-REQUIREMENTS.md", productRequirements],
  ["docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md", r4Release],
  ["docs/design/UX-SPECIFICATION.md", uxSpecification],
]) {
  const lower = content.toLowerCase();
  for (const phrase of actionPhrases) check(lower.includes(phrase), `GOV-R4-001: ${filePath} is missing exact outcome: ${phrase}`);
  check(!lower.includes("use source update"), `GOV-R4-002: ${filePath} contains forbidden fourth/alternate outcome: use source update`);
  check(!lower.includes("save source update as suggestion"), `GOV-R4-003: ${filePath} contains forbidden fourth/alternate outcome: save source update as suggestion`);
}
check(
  !/\bconflict suggestions?\b/i.test(r4Release)
    && !/\brevision, correction, suggestion\b/i.test(r4Release)
    && !/\bsource revisions?, suggestions?\b/i.test(r4Release)
    && r4Release.includes("recorded conflict-resolution choices")
    && r4Release.includes("never modeled as a fourth suggestion outcome"),
  "GOV-R4-004: R4 still models a conflict suggestion or lacks the exact three-choice persistence boundary",
);

const healthContract = [
  "`unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`",
  "`Unknown`, `Never verified`, `Healthy`, `Attention — delayed`, `Failed`, and `Blocked`",
  "`Not configured` is a separate prerequisite/configuration state",
];
for (const phrase of healthContract) check(uxSpecification.includes(phrase), `GOV-HEALTH-001: UX specification is missing: ${phrase}`);
check(
  uxSpecification.includes("| Health Status Card | Operational evidence | `Unknown`, `Never verified`, `Healthy`, `Attention — delayed`, `Failed`, or `Blocked`; `Not configured` is a separate prerequisite/configuration state |"),
  "GOV-HEALTH-006: Health Status Card inventory does not preserve the exact six labels and separate prerequisite state",
);
check(
  architecturePlan.includes("exactly: `unknown`, `never run`, `success`, `delayed`, `failed`, or `blocked`"),
  "GOV-HEALTH-002: architecture plan lacks the exact six durable health states",
);
check(
  architecturePlan.includes("`recovery verified` is separate evidence/detail"),
  "GOV-HEALTH-003: architecture plan does not classify recovery verified as separate evidence/detail",
);
check(
  r0Prd.includes("`unknown`, `never run`, `success`, `delayed`, `failed`, and `blocked`"),
  "GOV-HEALTH-004: R0 PRD lacks the exact six durable health states",
);
check(
  !/distinguish(?:es)?[^\n.]*\bhealthy\b[^\n.]*\bdelayed\b/i.test(architecturePlan)
    && !/distinguish(?:es)?[^\n.]*\bhealthy\b[^\n.]*\bdelayed\b/i.test(r0Prd),
  "GOV-HEALTH-005: an authoritative architecture/R0 state list still uses healthy as a durable state",
);

check(
  productRequirements.includes("LID-REF-002 — Monthly Almanac")
    && productRequirements.includes("there is no competing Timeline tab")
    && productRequirements.includes("Calendar and Almanac share the approved switcher near Search"),
  "GOV-UX-001: governing Product requirements do not preserve the approved Monthly Almanac/navigation contract",
);
check(
  uxSpecification.includes("| Primary | Monthly Almanac |")
    && uxSpecification.includes("The approved Calendar/Almanac switcher sits near Search")
    && uxSpecification.includes("do not add a competing Timeline tab or persistent primary-navigation rail")
    && uxSpecification.includes("management surfaces live under Settings/More"),
  "GOV-UX-002: UX specification does not preserve the approved Almanac/switcher/management contract",
);
check(
  productRequirements.includes("Calendar tiles use no source/AI overlay chip")
    && uxSpecification.includes("No persistent source-type, `AI artwork`, or attention overlay chip")
    && uxSpecification.includes("selected Museum Margin/detail exposes it visibly"),
  "GOV-UX-003: Calendar progressive-disclosure and AI/source-label contract has drifted",
);
check(!r3Prd.includes("Timeline"), "GOV-UX-004: R3 PRD still presents Timeline as a separate user-facing destination");
check(
  !uxSpecification.includes("real versus AI cover badges")
    && !uxSpecification.includes("| Wide | 1024 px and above | Persistent rail")
    && !uxSpecification.includes("Adding timeline results")
    && uxSpecification.includes("Do not add overlay badges or a persistent primary-navigation rail")
    && uxSpecification.includes("Calendar tile itself uses progressive disclosure and no persistent source-type overlay chip"),
  "GOV-UX-005: UX still contains a persistent rail/badge/Timeline instruction that conflicts with the approved Calendar/Almanac contract",
);
check(
  architecturePlan.includes("`/api/calendar`, `/api/almanac`, `/api/days/:date`")
    && !architecturePlan.includes("`/api/timeline`")
    && sharedArchitecturePlan.includes("Image-first Calendar, Monthly Almanac, deterministic Search, and Journal Day detail are primary surfaces")
    && sharedArchitecturePlan.includes("`GET /api/almanac`")
    && !sharedArchitecturePlan.includes("`GET /api/timeline`")
    && !sharedArchitecturePlan.includes("Calendar, timeline, Journal Day detail"),
  "GOV-UX-006: architecture still models Timeline as a separate user-facing surface",
);
check(
  prototypeTracker.includes("new `P0-index-vN.html`, `P0-app-vN.js`, `P0-styles-vN.css`, `P0-README-vN.md`")
    && prototypeTracker.includes("Frozen v6–v10 names remain grandfathered and unchanged"),
  "GOV-NAME-006: v11+ prototype artifact names do not follow the P0-prefix rule",
);

const executionGovernance = manifest.project?.executionGovernance ?? {};
for (const [name, filePath] of Object.entries(executionGovernance)) {
  check(fs.existsSync(path.join(repoRoot, filePath)), `GOV-CTRL-001: ${name} path does not exist: ${filePath}`);
  check(path.basename(filePath).startsWith("P0-"), `GOV-NAME-001: new execution artifact lacks P0- prefix: ${filePath}`);
}
const executionFiles = walkFiles("docs/council/execution");
for (const filePath of executionFiles) {
  check(path.basename(filePath).startsWith("P0-"), `GOV-NAME-002: execution artifact lacks P0- prefix: ${filePath}`);
}
check(path.basename(import.meta.filename).startsWith("P0-"), "GOV-NAME-003: this new validator lacks the P0- prefix");
const workItemFiles = walkFiles("docs/work-items");
check(workItemFiles.length === 58 * artifactKinds.length, `GOV-DOR-032: expected 348 task artifacts; found ${workItemFiles.length}`);
for (const filePath of workItemFiles) {
  check(path.basename(filePath).startsWith("P0-"), `GOV-NAME-005: task artifact lacks P0- prefix: ${filePath}`);
}

const governedMarkdown = [
  "README.md",
  "docs/INDEX.md",
  "docs/council/PRODUCT-COUNCIL.md",
  "docs/council/PRODUCT-COUNCIL-CHARTER.md",
  "docs/council/PHASE1-COUNCIL-DECISION-RECORD.md",
  "docs/product/PRODUCT-REQUIREMENTS.md",
  "docs/product/releases/PRD-R4-SOURCE-HISTORY-LIFECYCLE.md",
  "docs/design/UX-SPECIFICATION.md",
  "docs/architecture/PHASE1-IMPLEMENTATION-PLAN.md",
  "docs/product/releases/PRD-R0-SHARED-HOST-PRIVATE-FOUNDATION.md",
  "docs/project/PHASE1-GITHUB-PROJECT-SYNC.md",
  ...executionFiles.filter((filePath) => filePath.endsWith(".md")),
  "docs/council/agents/P0-QA-LEAD.md",
  ...workItemFiles.filter((filePath) => filePath.endsWith(".md")),
];
const markdownLinkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
for (const filePath of governedMarkdown) {
  const content = readText(filePath);
  for (const match of content.matchAll(markdownLinkPattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "").split(/\s+[\"']/)[0];
    if (!rawTarget || rawTarget.startsWith("#") || /^(?:https?:|mailto:)/.test(rawTarget)) continue;
    const targetWithoutFragment = decodeURI(rawTarget.split("#")[0].split("?")[0]);
    if (!targetWithoutFragment) continue;
    const resolved = path.resolve(path.dirname(path.join(repoRoot, filePath)), targetWithoutFragment);
    check(resolved.startsWith(`${repoRoot}${path.sep}`) || resolved === repoRoot, `GOV-LINK-001: ${filePath} link escapes the repository: ${rawTarget}`);
    check(fs.existsSync(resolved), `GOV-LINK-002: ${filePath} has a missing local link target: ${rawTarget}`);
  }
}

const publicSafePaths = [
  ...governedMarkdown,
  manifestPath,
  taskStatePath,
  readinessStatePath,
  artifactRegisterPath,
  "tools/generate_phase1_roadmap_manifest.mjs",
  "tools/sync_phase1_github.mjs",
  "tools/build-wiki.mjs",
  "tools/P0-validate-execution-controls.mjs",
  "tools/P0-generate-task-artifacts.mjs",
];
const githubPatPrefix = ["github", "pat", ""].join("_");
const privateKeyWords = ["PRIVATE", "KEY"].join(" ");
const forbiddenPublicPatterns = [
  ["absolute user path", /\/Users\//],
  ["GitHub token", new RegExp(`(?:ghp_|${githubPatPrefix})[A-Za-z0-9_]{16,}`)],
  ["private key", new RegExp(`-----BEGIN (?:RSA |EC |OPENSSH )?${privateKeyWords}-----`)],
  ["private Project node ID", /\b(?:PVT|PVTI|PVTF|PVTV)_[A-Za-z0-9_-]+\b/],
];
for (const filePath of new Set(publicSafePaths)) {
  const content = readText(filePath);
  for (const [label, pattern] of forbiddenPublicPatterns) {
    check(!pattern.test(content), `GOV-SAFE-001: ${filePath} contains a ${label}`);
  }
}

check(manifest.project?.deploymentState === "Unknown — private read authority pending", "GOV-AUTH-001: deployment state is not the exact approved unknown value");
check(manifest.project?.latestFrozenPrototype === "prototypes/calendar-ui/index-v10.html", "GOV-PROT-001: latest frozen prototype is not v10");

if (failures.length) {
  console.error(`P0 execution-control validation failed (${failures.length} finding${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  result: "pass",
  requirements: { total: prdIds.size, active: 71, deferred: [...deferredIds].sort() },
  tasks: { total: tasks.length, p0ThroughR9: 55, r10: 3, statuses: actualStatuses },
  evidenceLinkedTasks: tasks.filter((task) => task.evidenceReferencePaths?.length).length,
  executionArtifacts: executionFiles.length,
  taskArtifacts: workItemFiles.length,
  artifactReadiness: artifactRegister.summary,
  authenticMediaAccessed: false,
  deploymentState: manifest.project.deploymentState,
}, null, 2));
