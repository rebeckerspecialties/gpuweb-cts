import { DefaultTestFileLoader } from '../common/internal/file_loader';
import { Logger } from '../common/internal/logging/logger';
import { LiveTestCaseResult } from '../common/internal/logging/result';
import { parseQuery } from '../common/internal/query/parseQuery';
import { parseExpectationsForTestQuery } from '../common/internal/query/query';
import { assert, unreachable } from '../common/util/util';

const filterQuery = 'webgpu:api,operation,*';

export const runTests = async () => {
  const loader = new DefaultTestFileLoader();
  const query = parseQuery(filterQuery);
  const testcases = await loader.loadCases(query);

  const expectations = parseExpectationsForTestQuery([], query);

  const failed: Array<[string, LiveTestCaseResult]> = [];
  const warned: Array<[string, LiveTestCaseResult]> = [];
  const skipped: Array<[string, LiveTestCaseResult]> = [];
  const log = new Logger();

  let total = 0;

  for (const testcase of testcases) {
    const name = testcase.query.toString();

    const [rec, res] = log.record(name);
    await testcase.run(rec, expectations);

    total++;
    switch (res.status) {
      case 'pass':
        break;
      case 'fail':
        failed.push([name, res]);
        break;
      case 'warn':
        warned.push([name, res]);
        break;
      case 'skip':
        skipped.push([name, res]);
        break;
      default:
        unreachable('unrecognized status');
    }
  }

  assert(total > 0, 'found no tests!');

  return {
    total,
    failed,
    warned,
    skipped,
  };
};
