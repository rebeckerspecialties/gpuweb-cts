import { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { runTests } from './runTests';
import { Canvas, useCanvasEffect } from 'react-native-wgpu';

export const TestTree: React.FC = () => {
  const [results, setResults] = useState({
    failed: 0,
    warned: 0,
    skipped: 0,
    total: 0,
  });

  const [ready, setReady] = useState(false);

  const runTestsWithLogging = useCallback(async () => {
    const { failed, total, skipped, warned } = await runTests();
    setResults({
      failed: failed.length,
      warned: warned.length,
      skipped: skipped.length,
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
          <Text>Failed: {results.failed}</Text>
          <Text>Warned: {results.warned}</Text>
          <Text>Skipped: {results.skipped}</Text>
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
