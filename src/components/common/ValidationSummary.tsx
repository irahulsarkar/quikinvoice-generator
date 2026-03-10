import type { ValidationIssue } from '../../types/invoice';

interface ValidationSummaryProps {
  issues: ValidationIssue[];
}

export const ValidationSummary = ({ issues }: ValidationSummaryProps) => {
  if (!issues.length) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
        Mandatory invoice fields look good.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
        Resolve before print/export ({issues.length})
      </p>
      <ul className="mt-2 space-y-1 text-xs text-rose-700">
        {issues.slice(0, 8).map((issue, index) => (
          <li key={`${issue.path}-${index}`}>
            {issue.path}: {issue.message}
          </li>
        ))}
      </ul>
      {issues.length > 8 ? <p className="mt-2 text-xs text-rose-600">+ {issues.length - 8} more issues</p> : null}
    </div>
  );
};
