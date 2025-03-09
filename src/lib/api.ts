import { supabase } from './supabase';
import { Octokit } from 'octokit';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const api = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return data;
  },

  async updateProfile(profile: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPortfolios() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return data || [];
  },

  async createPortfolio(portfolio: {
    title: string;
    description: string;
    template: string;
    github_username: string;
    published: boolean;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    if (!portfolio.github_username?.trim()) {
      throw new Error('GitHub username is required');
    }

    // Validate GitHub username exists before creating portfolio
    await this.getGithubData(portfolio.github_username);

    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        ...portfolio,
        user_id: user.id,
        github_username: portfolio.github_username.trim()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPortfolio(id: string) {
    if (!id) throw new Error('Portfolio ID is required');

    // Fetch the portfolio
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects (*),
        skills (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Portfolio not found');
    if (!data.github_username) {
      throw new Error('No GitHub username associated with this portfolio');
    }
    
    return data;
  },

  async getGithubData(username: string) {
    if (!username) {
      throw new Error('GitHub username is required');
    }

    try {
      const octokit = new Octokit({
        auth: import.meta.env.VITE_GITHUB_TOKEN
      });
      
      // Verify user exists first
      let userData;
      try {
        const { data: user } = await octokit.request('GET /users/{username}', {
          username,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
        userData = user;
      } catch (error) {
        throw new Error(`GitHub user "${username}" not found`);
      }
      
      // Get user repositories
      const { data: repos } = await octokit.request('GET /users/{username}/repos', {
        username,
        sort: 'updated',
        per_page: 10,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      // Calculate language statistics
      const languages = repos.reduce((acc: { [key: string]: number }, repo) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
      }, {});

      // Use public_repos count instead of events API
      const contributionEstimate = userData.public_repos || 0;

      return {
        repositories: repos.map(repo => ({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url
        })),
        contributions: contributionEstimate,
        languages,
      };
    } catch (error: any) {
      if (error.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      }
      console.error('GitHub API Error:', error);
      throw new Error(error.message || 'Failed to fetch GitHub data');
    }
  },

  async generatePortfolioContent(githubData: GithubData, userProfile: Profile) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a professional portfolio description for a developer with the following data:
      GitHub Repositories: ${JSON.stringify(githubData.repositories.slice(0, 5))}
      Total Contributions: ${githubData.contributions}
      Programming Languages: ${JSON.stringify(githubData.languages)}
      Profile: ${JSON.stringify(userProfile)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },
};