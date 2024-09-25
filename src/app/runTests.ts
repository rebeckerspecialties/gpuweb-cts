import { DefaultTestFileLoader } from '../common/internal/file_loader';
import { LogMessageWithStack } from '../common/internal/logging/log_message';
import { Logger } from '../common/internal/logging/logger';
import { LiveTestCaseResult } from '../common/internal/logging/result';
import { parseQuery } from '../common/internal/query/parseQuery';
import { parseExpectationsForTestQuery } from '../common/internal/query/query';
import { assert, unreachable } from '../common/util/util';

const filterQuery = 'webgpu:api,operation,*';

// Time out tests after a delay
const TEST_TIMEOUT = 5000;

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

    console.log(name);
    const [rec, res] = log.record(name);
    const timeout = createTimeout(res, TEST_TIMEOUT);
    await Promise.race([testcase.run(rec, expectations), timeout]);
    if (res.status === 'fail') {
      console.log(res.logs);
    }

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

const createTimeout = (res: LiveTestCaseResult, timeoutLength: number) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      res.status = 'fail';
      res.logs = [
        LogMessageWithStack.wrapError(
          'timeout',
          new Error(`Manually timed out test after ${timeoutLength} ms.`)
        ),
      ];
      resolve();
    }, timeoutLength);
  });
};
