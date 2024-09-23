import { useCallback, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { runTests } from './runTests';
import { Canvas, useCanvasEffect } from 'react-native-wgpu';
import { LiveTestCaseResult } from '../common/internal/logging/result';

type Results = {
  failed: [string, LiveTestCaseResult][];
  warned: [string, LiveTestCaseResult][];
  skipped: [string, LiveTestCaseResult][];
  total: number;
};

export const TestTree: React.FC = () => {
  const [results, setResults] = useState<Results>({
    failed: [],
    warned: [],
    skipped: [],
    total: 0,
  });

  const [ready, setReady] = useState(false);

  const runTestsWithLogging = useCallback(async () => {
    const { failed, total, skipped, warned } = await runTests();
    setResults({
      failed,
      warned,
      skipped,
      total,
    });
  }, []);

  const ref = useCanvasEffect(async () => {
    setReady(true);
  });

  return (
    <View style={style.container}>
      {ready ? (
        <View style={style.webgpu}>
          <Button title="Run Tests" onPress={runTestsWithLogging} />
          <Text>Total: {results.total}</Text>
          <Text>Failed: {results.failed.length}</Text>
          <Text>Warned: {results.warned.length}</Text>
          <Text>Skipped: {results.skipped.length}</Text>
        </View>
      ) : null}
      {results.failed.length > 0 ? (
        <View style={style.container}>
          <Text>Failing Tests:</Text>
          <ScrollView>
            {results.failed.map(([name]) => {
              return <Text key={name}>{name}</Text>;
            })}
          </ScrollView>
        </View>
      ) : null}
      <Canvas ref={ref} style={style.webgpu} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  webgpu: {
    flex: 1,
  },
});
