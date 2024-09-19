// Node can look at the filesystem, but JS in the browser can't.
// This crawls the file tree under src/suites/${suite} to generate a (non-hierarchical) static
// listing file that can then be used in the browser to load the modules containing the tests.

import { TestSuiteListingEntry, TestSuiteListing } from '../internal/test_suite_listing.js';
import { unreachable } from '../util/util.js';

const specFileSuffix = '.spec.ts';

async function crawlFilesRecursively(_dir: string): Promise<string[]> {
  return Promise.resolve(require.context('../../webgpu', true, /\.spec\./).keys());
}

export async function crawl(
  suiteDir: string,
  _opts: { validate: boolean; printMetadataWarnings: boolean } | null = null
): Promise<TestSuiteListingEntry[]> {
  // Crawl files and convert paths to be POSIX-style, relative to suiteDir.
  const filesToEnumerate = (await crawlFilesRecursively(suiteDir)).map(f => f.slice(2)).sort();

  const entries: TestSuiteListingEntry[] = [];
  for (const file of filesToEnumerate) {
    // |file| is the suite-relative file path.
    if (file.endsWith(specFileSuffix)) {
      const filepathWithoutExtension = file.substring(0, file.length - specFileSuffix.length);
      const pathSegments = filepathWithoutExtension.split('/');

      entries.push({ file: pathSegments });
    } else {
      unreachable(`Matched an unrecognized filename ${file}`);
    }
  }

  return entries;
}

export function makeListing(filename: string): Promise<TestSuiteListing> {
  // Don't validate. This path is only used for the dev server and running tests with Node.
  // Validation is done for listing generation and presubmit.
  return crawl(filename);
}
