import { Request, Response, NextFunction } from 'express';

export const sanitizeResponse = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (body: any) {
    const sanitize = (obj: any, parentKey: string | null = null): any => {
      if (typeof obj === 'string') {
        if (parentKey && ['poster', 'backdrop', 'trailer', 'url', 'thumbnail', 'id', 'slug'].includes(parentKey)) {
          return obj;
        }
        if (/^https?:\/\/[^\s]+$/.test(obj) || /^\/api\//.test(obj)) return obj;
        return obj.replace(/lk21|layarkaca21/gi, '').replace(/\s{2,}/g, ' ').trim();
      }
      if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item, parentKey));
      }
      if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = sanitize(obj[key], key);
          }
        }
        return newObj;
      }
      return obj;
    };

    return originalJson.call(this, sanitize(body));
  };

  next();
};
