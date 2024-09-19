import { useCallback, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { runTests } from './runTests';

export const TestTree: React.FC = () => {
  const [results, setResults] = useState({
    failed: 0,
    warned: 0,
    skipped: 0,
    total: 0,
  });
  const runTestsWithLogging = useCallback(async () => {
    const { failed, total, skipped, warned } = await runTests();
    setResults({
      failed: failed.length,
      warned: warned.length,
      skipped: skipped.length,
      total,
    });
  }, []);

  return (
    <View>
      <Button title="Run Tests" onPress={runTestsWithLogging} />
      <Text>Total: {results.total}</Text>
      <Text>Failed: {results.failed}</Text>
      <Text>Warned: {results.warned}</Text>
      <Text>Skipped: {results.skipped}</Text>
    </View>
  );
};
