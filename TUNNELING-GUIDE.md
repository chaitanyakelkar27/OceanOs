# 🚇 Tunneling Setup for OceanOS Llama Model

## 🎯 Goal
Make your local Llama 3.1 8B model accessible to the Netlify-deployed OceanOS website.

## 🏆 Recommended Solution: ngrok

### Step 1: Install ngrok
```bash
# Download from https://ngrok.com/download
# Or using chocolatey on Windows:
choco install ngrok

# Or using npm:
npm install -g ngrok
```

### Step 2: Setup ngrok Account
1. Sign up at https://ngrok.com
2. Get your auth token from dashboard
3. Configure ngrok:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 3: Create Tunnel Configuration

Create `ngrok.yml` in your project root:
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN
tunnels:
  oceanos-api:
    addr: 8080
    proto: http
    subdomain: oceanos-api  # Use your custom subdomain
    bind_tls: true
  ollama:
    addr: 11434
    proto: http
    subdomain: oceanos-ollama  # Use your custom subdomain
    bind_tls: true
```

### Step 4: Start Tunnels
```bash
# Start both tunnels
ngrok start --all

# Or individually:
ngrok http 8080 --subdomain oceanos-api
ngrok http 11434 --subdomain oceanos-ollama
```

### Step 5: Update Environment Variables

Your tunneled URLs will be:
- API: `https://oceanos-api.ngrok-free.app`
- Ollama: `https://oceanos-ollama.ngrok-free.app`

## 🔧 Alternative Solutions

### Option 2: Cloudflare Tunnel (Free, Reliable)
```bash
# Install cloudflared
# Windows: Download from https://github.com/cloudflare/cloudflared/releases

# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create oceanos

# Route traffic
cloudflared tunnel route dns oceanos oceanos-api.yourdomain.com

# Start tunnel
cloudflared tunnel run oceanos
```

### Option 3: LocalTunnel (Simple, Free)
```bash
# Install
npm install -g localtunnel

# Start tunnels
lt --port 8080 --subdomain oceanos-api
lt --port 11434 --subdomain oceanos-ollama
```

## ⚡ Quick Start Commands

1. **Start Ollama:**
   ```bash
   ollama serve
   ```

2. **Start OceanOS API:**
   ```bash
   npm run dev
   ```

3. **Start Tunnel (ngrok):**
   ```bash
   ngrok http 8080 --subdomain oceanos-api
   ngrok http 11434 --subdomain oceanos-ollama
   ```

4. **Deploy to Netlify with tunnel URLs**

## 🔒 Security Considerations

- Use HTTPS tunnels only
- Consider IP whitelisting in ngrok
- Monitor tunnel usage
- Use authentication headers if needed

## 💰 Cost Comparison

| Solution | Cost | Features |
|----------|------|----------|
| ngrok | Free: 1 tunnel, $5/month: unlimited | Custom subdomains, TCP tunnels |
| Cloudflare | Free | Unlimited, better performance |
| LocalTunnel | Free | Basic tunneling |

## 🚀 Production Notes

- For production, consider deploying Llama on cloud (AWS, GCP, Azure)
- Use load balancers for high availability
- Monitor API usage and costs
- Set up proper logging and monitoring