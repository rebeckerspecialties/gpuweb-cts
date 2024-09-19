// Node can look at the filesystem, but JS in the browser can't.
// This crawls the file tree under src/suites/${suite} to generate a (non-hierarchical) static
// listing file that can then be used in the browser to load the modules containing the tests.

import { TestSuiteListingEntry, TestSuiteListing } from '../internal/test_suite_listing.js';

export async function crawl(
  _suiteDir: string,
  _opts: { validate: boolean; printMetadataWarnings: boolean } | null = null
): Promise<TestSuiteListingEntry[]> {
  return Promise.resolve([]);
}

export function makeListing(_filename: string): Promise<TestSuiteListing> {
  // Don't validate. This path is only used for the dev server and running tests with Node.
  // Validation is done for listing generation and presubmit.
  return Promise.resolve([{ file: require.context('../../webgpu/', true, /\.spec\./).keys() }]);
}
