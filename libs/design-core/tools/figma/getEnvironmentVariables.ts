export default function getEnvironmentVariables(): {
  figmaToken: string;
  fileKey: string;
} {
  const figmaToken = process.env.FIGMA_API_TOKEN;
  const fileKey = process.env.FIGMA_FOUNDATIONS_FILE_KEY;

  if (!figmaToken || !fileKey) {
    throw new Error(
      `Please set the FIGMA_API_TOKEN and FIGMA_FOUNDATIONS_FILE_KEY environment variables.`,
    );
  }

  return { figmaToken, fileKey };
}
