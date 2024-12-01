// required for vercel deployment
// note: name vercel `output` as `dist`

import { bootstrap } from "../dist/main.js";

export default async function (req, res) {
  const app = await bootstrap();
  const handler = app.getHttpAdapter().getInstance();
  return handler(req, res);
}
