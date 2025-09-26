@echo off
echo 🚇 OceanOS LocalTunnel Setup
echo ================================

echo.
echo Current Tunnel URLs:
echo 📡 API Server: https://pretty-eyes-join.loca.lt
echo 🦙 Ollama Service: https://icy-ties-train.loca.lt
echo.

echo 📝 Environment file updated: .env.production
echo 🔧 AI Service configured for tunneled access
echo.

echo 🚀 Next Steps:
echo.
echo 1. Keep both tunnels running:
echo    - Ollama: lt --port 11434
echo    - API: npx localtunnel --port 8080
echo.
echo 2. Start your local services:
echo    - Ollama: ollama serve
echo    - OceanOS: npm run dev
echo.
echo 3. Test the tunneled API:
echo    curl https://pretty-eyes-join.loca.lt/api/ping
echo.
echo 4. Deploy to Netlify:
echo    - Build: npm run build
echo    - Deploy with environment variables from .env.production
echo.

echo ✅ Your Netlify site will now access your local Llama model!
echo.

pause