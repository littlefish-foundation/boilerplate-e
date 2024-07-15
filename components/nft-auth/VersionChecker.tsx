import { useEffect, useState } from 'react';
import { packageJson } from '../../lib/constants';

interface VersionInfo {
  currentVersion: string;
  latestVersion: string;
  isUpdateAvailable: boolean;
}

export function VersionChecker() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo>({
    currentVersion: packageJson.version,
    latestVersion: '',
    isUpdateAvailable: false,
  });

  useEffect(() => {
    async function checkVersion() {
      try {
        const response = await fetch('https://api.github.com/repos/littlefish-foundation/boilerplate-e/contents/package.json');
        const data = await response.json();
        const content = atob(data.content);
        const githubPackageJson = JSON.parse(content);
        const latestVersion = githubPackageJson.version;

        setVersionInfo({
          currentVersion: packageJson.version,
          latestVersion,
          isUpdateAvailable: latestVersion !== packageJson.version,
        });
      } catch (error) {
        console.error('Error fetching version:', error);
      }
    }

    checkVersion();
  }, []);

  return (
    <div>
      <p>Current Version: {versionInfo.currentVersion}</p>
      {versionInfo.isUpdateAvailable && (
        <p className="text-yellow-500">
          Update available: {versionInfo.latestVersion}
        </p>
      )}
    </div>
  );
}