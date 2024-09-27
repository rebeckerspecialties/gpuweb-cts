import { useCallback } from 'react';
import { CTSResults } from './TestTree';
import { Button } from 'react-native';
import Share from 'react-native-share';
import FetchBlob from 'rn-fetch-blob';

export const ExportButton: React.FC<{ results: CTSResults }> = ({ results }) => {
  const onExport = useCallback(() => {
    const filePath = `${FetchBlob.fs.dirs.DocumentDir}/cts-results.json`;

    FetchBlob.fs
      .writeFile(filePath, JSON.stringify(results), 'utf8')
      .then(() =>
        Share.open({
          message: 'sharing results',
          url: filePath,
        })
      )
      .catch(err => {
        console.warn('Failed to export CSV');
        console.error(err);
      });
  }, [results]);

  return <Button title="Export results as JSON" onPress={onExport} />;
};
