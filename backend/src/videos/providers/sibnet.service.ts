import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class SibnetService {
  private readonly baseUrl = 'https://video.sibnet.ru';

  async findVideo(animeTitle: string, episode: number) {
    try {
      // Search for anime videos on Sibnet
      const searchQuery = `${animeTitle} ${episode} серия`;
      const searchUrl = `${this.baseUrl}/search.php`;

      const response = await axios.get(searchUrl, {
        params: {
          str: searchQuery,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      // Find video links in search results
      const videoLinks = [];
      $('.video-item, .item').each((index, element) => {
        const link = $(element).find('a').attr('href');
        const title = $(element).find('.title, .video-title').text().trim();

        if (link && title.toLowerCase().includes(animeTitle.toLowerCase())) {
          videoLinks.push({
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
            title: title,
          });
        }
      });

      if (videoLinks.length === 0) {
        return null;
      }

      // Get the first matching video
      const videoLink = videoLinks[0];

      // Try to extract direct video URL
      const videoPageResponse = await axios.get(videoLink.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const videoPage$ = cheerio.load(videoPageResponse.data);

      // Look for video source in various possible locations
      let directVideoUrl = null;

      // Check for video tag
      const videoSrc = videoPage$('video source').attr('src') || videoPage$('video').attr('src');
      if (videoSrc) {
        directVideoUrl = videoSrc.startsWith('http') ? videoSrc : `${this.baseUrl}${videoSrc}`;
      }

      // If no direct URL found, return the page URL (can be embedded)
      return {
        url: directVideoUrl || videoLink.url,
        quality: '720p', // Default quality
        title: videoLink.title,
        episode: episode,
      };
    } catch (error) {
      console.error('Error fetching video from Sibnet:', error);
      return null;
    }
  }

  async searchVideos(query: string) {
    try {
      const searchUrl = `${this.baseUrl}/search.php`;

      const response = await axios.get(searchUrl, {
        params: {
          str: query,
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const results = [];

      $('.video-item, .item').each((index, element) => {
        const link = $(element).find('a').attr('href');
        const title = $(element).find('.title, .video-title').text().trim();
        const thumbnail = $(element).find('img').attr('src');

        if (link && title) {
          results.push({
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
            title: title,
            thumbnail: thumbnail ? (thumbnail.startsWith('http') ? thumbnail : `${this.baseUrl}${thumbnail}`) : null,
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Error searching videos on Sibnet:', error);
      return [];
    }
  }
}