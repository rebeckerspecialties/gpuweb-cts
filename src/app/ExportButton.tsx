import { useCallback } from 'react';
import { CTSResults } from './TestTree';
import { Button } from 'react-native';
import Share from 'react-native-share';

export const ExportButton: React.FC<{ results: CTSResults }> = ({ results }) => {
  const onExport = useCallback(() => {
    Share.open({
      message: 'sharing results',
    });
  }, [results]);

  return <Button title="Export results as JSON" onPress={onExport} />;
};
