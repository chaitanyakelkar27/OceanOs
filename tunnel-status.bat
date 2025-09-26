@echo off
REM OceanOS Tunnel Status Manager

echo 🚇 OceanOS Tunnel Status
echo ========================

echo.
echo 📊 Active Tunnels:
echo ├─ API Server (Port 8080):  https://pretty-eyes-join.loca.lt
echo └─ Ollama Service (Port 11434): https://icy-ties-train.loca.lt
echo.

echo 🔧 Commands to start tunnels:
echo ├─ API:    npx localtunnel --port 8080
echo └─ Ollama: lt --port 11434
echo.

echo 🧪 Test Commands:
echo ├─ API Health: curl https://pretty-eyes-join.loca.lt/api/ping
echo └─ Ollama: curl https://icy-ties-train.loca.lt/api/version
echo.

echo 🌐 Netlify Environment Variables:
echo ├─ VITE_API_URL=https://pretty-eyes-join.loca.lt  
echo └─ OLLAMA_HOST=https://icy-ties-train.loca.lt
echo.

echo 💡 Tips:
echo - Keep tunnel windows open while testing
echo - Restart tunnels if URLs change
echo - Update .env.production with new URLs if needed
echo.

pause