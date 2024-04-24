import http from 'http';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = httpProxy.createProxyServer();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    req.headers.cookie = '';
    req.url = req.url!.replace(/^\/api/, '');
    console.log(req.url);

    proxy.once('proxyRes', function (proxyRes: http.IncomingMessage) {
      handleLoginResponse(proxyRes, req, res);
    });

    proxy.web(req, res, {
      target: process.env.SERVER_URL,
      autoRewrite: false,
      changeOrigin: true,
      selfHandleResponse: true
    });

    function handleLoginResponse(
      proxyRes: http.IncomingMessage,
      req: NextApiRequest,
      res: NextApiResponse,
    ) {
      let responseBody: Uint8Array[] = [];
      proxyRes.on('data', function (chunk: Uint8Array) {
        responseBody.push(chunk);
      });

      proxyRes.on('end', function () {
        try {
          const body = JSON.parse(Buffer.concat(responseBody).toString());
          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV !== 'development',
          });

          if (!body.error) {
            cookies.set('access_token', body.data.accessToken, {
              httpOnly: true,
              sameSite: 'lax',
            });
            cookies.set('refresh_token', body.data.refreshToken, {
              httpOnly: true,
              sameSite: 'lax',
            });
          }

          res.status(200).json({ message: 'Login successfully' });
          resolve(body);
        } catch (e) {
          res.status(500).json({ message: 'Internal Server Error' });
          reject(e);
        }
      });
    }
  });
}
