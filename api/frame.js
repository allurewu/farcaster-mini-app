// Frame API 处理函数
export default function handler(req, res) {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只处理 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  try {
    // 返回新的 Frame 响应
    return res.status(200).json({
      frames: {
        version: 'vNext',
        image: 'https://placehold.co/1200x630/png?text=应用已启动',
        buttons: [
          {
            label: '返回',
            action: 'post',
          }
        ],
      }
    });
  } catch (error) {
    console.error('Frame 处理错误:', error);
    return res.status(500).json({ error: '处理请求时出错' });
  }
} 