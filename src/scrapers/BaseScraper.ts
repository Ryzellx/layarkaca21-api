import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../config/logger';

export class PageNotFoundError extends Error {
  status = 404;
  constructor(message = 'Film / Series not found') {
    super(message);
    this.name = 'PageNotFoundError';
  }
}

export class BaseScraper {
  protected baseUrl = 'https://tv11.lk21official.cc';
  
  protected async fetchHtml(endpoint: string): Promise<cheerio.CheerioAPI> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        timeout: 10000
      });
      
      const finalUrl = response.request?.res?.responseUrl || '';
      if (finalUrl) {
        const finalPath = new URL(finalUrl).pathname;
        const requestedPath = endpoint.startsWith('http') ? new URL(endpoint).pathname : endpoint;
        if (finalPath === '/' && requestedPath !== '/' && requestedPath !== '') {
          throw new PageNotFoundError();
        }
      }

      const $ = cheerio.load(response.data);
      
      // Auto-handle LK21 redirects to other domains (like Nontondrama)
      const redirectBtn = $('a:contains("Buka Sekarang"), a:contains("Nontondrama")');
      if (redirectBtn.length > 0 && redirectBtn.attr('href')) {
        const targetUrl = redirectBtn.attr('href') as string;
        logger.info(`Following redirect to ${targetUrl}`);
        const targetResponse = await axios.get(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 10000
        });

        const targetFinalUrl = targetResponse.request?.res?.responseUrl || '';
        if (targetFinalUrl) {
          const finalPath = new URL(targetFinalUrl).pathname;
          const requestedPath = endpoint.startsWith('http') ? new URL(endpoint).pathname : endpoint;
          if (finalPath === '/' && requestedPath !== '/' && requestedPath !== '') {
            throw new PageNotFoundError();
          }
        }

        return cheerio.load(targetResponse.data);
      }
      
      return $;
    } catch (error) {
      if (error instanceof PageNotFoundError) {
        throw error;
      }
      logger.error(`Failed to fetch ${endpoint}`, error);
      throw error;
    }
  }

  protected extractText($: cheerio.CheerioAPI, context: any, selectors: string[]): string {
    for (const sel of selectors) {
      const text = $(context).find(sel).first().text().trim();
      if (text) return text;
    }
    return '';
  }

  protected extractAttr($: cheerio.CheerioAPI, context: any, selectors: string[], attr: string): string {
    for (const sel of selectors) {
      const el = $(context).find(sel).first();
      let val = el.attr(attr);
      if (!val && attr === 'src') {
        val = el.attr('data-src') || el.attr('data-lazy-src') || el.attr('data-original');
      }
      if (val) return val.trim();
    }
    return '';
  }

  public async fetchExtraDetails(id: string) {
    try {
      const $ = await this.fetchHtml(`/${id}`);
      const synopsis = $('div.synopsis.collapsed').text().trim();
      let sutradara = '';
      let bintangFilm = '';
      let negara = '';
      let votes = '';
      let release = '';
      let updated = '';
      let subtitle = '';

      $('div.detail.hidden p').each((_, el) => {
        const text = $(el).text();
        if (text.includes('Subtitle:')) subtitle = text.replace('Subtitle:', '').trim();
        if (text.includes('Sutradara:')) sutradara = text.replace('Sutradara:', '').trim();
        if (text.includes('Bintang Film:')) bintangFilm = text.replace('Bintang Film:', '').trim();
        if (text.includes('Negara:')) negara = text.replace('Negara:', '').trim();
        if (text.includes('Release:')) release = text.replace('Release:', '').trim();
        if (text.includes('Updated:')) updated = text.replace('Updated:', '').trim();
        if (text.includes('Votes:')) votes = text.replace('Votes:', '').trim();
      });

      return {
        synopsis,
        subtitle,
        sutradara,
        bintangFilm,
        negara,
        release,
        updated,
        votes
      };
    } catch (error) {
      return {
        synopsis: '', subtitle: '', sutradara: '', bintangFilm: '', negara: '', release: '', updated: '', votes: ''
      };
    }
  }

  protected extractTrailer($: cheerio.CheerioAPI): string | null {
    let rawUrl: string | null = null;

    $('iframe').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.includes('youtube') || src.includes('youtu.be'))) {
        rawUrl = src;
      }
    });

    if (!rawUrl) {
      $('a, button').each((_, el) => {
        const href = $(el).attr('href');
        if (href && (href.includes('youtube.com/watch') || href.includes('youtu.be'))) {
          rawUrl = href;
        }
      });
    }

    if (!rawUrl) return null;

    const match = (rawUrl as string).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}`;
    }

    return rawUrl;
  }
}
