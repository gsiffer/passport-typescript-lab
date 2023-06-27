export interface GitHubProfile {
  id: string;
  displayName: string;
  emails: { value: string }[];
  // Add any additional properties specific to the GitHub profile
}