import { api } from '../lib/api';
import JSZip from 'jszip';

export const generatePortfolioContent = async (username: string) => {
  if (!username) {
    throw new Error('GitHub username is required');
  }

  try {
    // Get GitHub data
    const githubData = await api.getGithubData(username);
    const userProfile = await api.getProfile();

    if (!githubData.repositories.length) {
      throw new Error('No public repositories found for this GitHub user');
    }

    // Format the data
    return {
      github: {
        username,
        profileUrl: `https://github.com/${username}`,
        avatarUrl: userProfile?.avatar_url || `https://github.com/identicons/${username}.png`,
      },
      hero: {
        headline: `${userProfile?.full_name || username}'s Portfolio`,
        subheadline: `Software Developer with expertise in ${Object.keys(githubData.languages).slice(0, 3).join(', ')}`,
      },
      about: {
        introduction: userProfile?.bio || `Experienced developer with ${githubData.contributions} contributions on GitHub`,
        expertise: Object.entries(githubData.languages)
          .map(([lang, count]) => `${lang} Development`),
        keySkills: Object.keys(githubData.languages),
      },
      projects: githubData.repositories.map(repo => ({
        name: repo.name,
        description: repo.description,
        technologies: [repo.language],
        highlights: [
          `${repo.stars} stars on GitHub`,
          `${repo.forks} forks`,
        ],
        github_url: repo.url,
      })),
      contact: {
        tagline: "Let's collaborate on your next project",
        availability: "Available for freelance opportunities",
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to generate portfolio content: ${error.message}`);
  }
};

export const generateSourceCode = (portfolioData: any) => {
  // Generate downloadable source code
  const files = {
    'index.html': generateHTMLTemplate(portfolioData),
    'styles.css': generateCSSStyles(),
    'README.md': generateReadme(portfolioData),
  };
  return files;
};

const generateHTMLTemplate = (data: any) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.hero.headline}</title>
    <link href="styles.css" rel="stylesheet">
</head>
<body>
    <!-- Generated portfolio content -->
    ${generatePortfolioHTML(data)}
</body>
</html>`;
};

const generateCSSStyles = () => {
  return `/* Portfolio styles */`;
};

const generateReadme = (data: any) => {
  return `# ${data.hero.headline}\n\n${data.hero.subheadline}`;
};

const generatePortfolioHTML = (data: any) => {
  return `<!-- Portfolio HTML structure -->`;
};
