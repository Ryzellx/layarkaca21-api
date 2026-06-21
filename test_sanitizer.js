function sanitize(obj, parentKey = null) {
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
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = sanitize(obj[key], key);
      }
    }
    return newObj;
  }
  return obj;
}

const testData = {
  title: "Nonton The Avengers (2012) lk21 Sub Indo",
  description: "Film dari layarkaca21 yang sangat bagus lk21 mantap.",
  poster: "https://lk21official.cc/images/poster.jpg",
  trailer: "https://youtube.com/watch?v=lk21",
  id: "lk21-the-avengers",
  streamembed: [
    { provider: "P2P LK21", url: "https://player.lk21.com" }
  ],
  home: "/api/home/lk21"
};

console.log(JSON.stringify(sanitize(testData), null, 2));
