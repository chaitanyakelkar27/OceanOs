#!/usr/bin/env node

/**
 * OceanOS Tunnel Manager
 * Manages ngrok tunnels for local Llama model access from Netlify
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class TunnelManager {
    constructor() {
        this.tunnels = new Map();
        this.ngrokProcess = null;
        this.config = {
            api_port: 8080,
            ollama_port: 11434,
            subdomain_prefix: 'oceanos'
        };
    }

    async checkNgrokInstalled() {
        return new Promise((resolve) => {
            exec('ngrok version', (error) => {
                resolve(!error);
            });
        });
    }

    async installNgrok() {
        console.log('📦 Installing ngrok...');
        return new Promise((resolve, reject) => {
            const install = spawn('npm', ['install', '-g', 'ngrok'], { stdio: 'inherit' });
            install.on('close', (code) => {
                code === 0 ? resolve() : reject(new Error('Failed to install ngrok'));
            });
        });
    }

    async startTunnel(port, name, subdomain = null) {
        console.log(`🚇 Starting ${name} tunnel on port ${port}...`);

        const args = ['http', port.toString()];
        if (subdomain) {
            args.push('--subdomain', subdomain);
        }

        const tunnel = spawn('ngrok', args);

        tunnel.stdout.on('data', (data) => {
            const output = data.toString();

            // Extract tunnel URL
            const urlMatch = output.match(/https:\/\/[^\s]+\.ngrok-free\.app/);
            if (urlMatch) {
                const url = urlMatch[0];
                this.tunnels.set(name, { url, process: tunnel, port });
                console.log(`✅ ${name} tunnel active: ${url}`);
                this.updateEnvFile();
            }
        });

        tunnel.stderr.on('data', (data) => {
            console.error(`❌ ${name} tunnel error: ${data}`);
        });

        return tunnel;
    }

    async startAllTunnels() {
        console.log('🚀 Starting OceanOS tunnels...\n');

        // Check if ngrok is installed
        if (!(await this.checkNgrokInstalled())) {
            console.log('❌ ngrok not found. Installing...');
            await this.installNgrok();
        }

        // Start API tunnel
        await this.startTunnel(
            this.config.api_port,
            'api',
            `${this.config.subdomain_prefix}-api`
        );

        // Wait a bit before starting second tunnel
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Start Ollama tunnel  
        await this.startTunnel(
            this.config.ollama_port,
            'ollama',
            `${this.config.subdomain_prefix}-ollama`
        );

        // Keep process alive
        process.on('SIGINT', () => this.cleanup());
        process.on('SIGTERM', () => this.cleanup());

        console.log('\n🎉 All tunnels started! Press Ctrl+C to stop.');
        this.displayStatus();
    }

    updateEnvFile() {
        const apiUrl = this.tunnels.get('api')?.url;
        const ollamaUrl = this.tunnels.get('ollama')?.url;

        if (apiUrl || ollamaUrl) {
            let envContent = '';

            if (fs.existsSync('.env.production')) {
                envContent = fs.readFileSync('.env.production', 'utf8');
            }

            // Update or add environment variables
            if (apiUrl) {
                envContent = this.updateEnvVar(envContent, 'VITE_API_URL', apiUrl);
                envContent = this.updateEnvVar(envContent, 'NETLIFY_API_URL', apiUrl);
            }

            if (ollamaUrl) {
                envContent = this.updateEnvVar(envContent, 'VITE_OLLAMA_URL', ollamaUrl);
                envContent = this.updateEnvVar(envContent, 'OLLAMA_HOST', ollamaUrl);
            }

            fs.writeFileSync('.env.production', envContent);
            console.log('📝 Updated .env.production with tunnel URLs');
        }
    }

    updateEnvVar(content, key, value) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;

        if (regex.test(content)) {
            return content.replace(regex, newLine);
        } else {
            return content + (content.endsWith('\n') ? '' : '\n') + newLine + '\n';
        }
    }

    displayStatus() {
        console.log('\n📊 Tunnel Status:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        this.tunnels.forEach((tunnel, name) => {
            console.log(`🔗 ${name.toUpperCase()}: ${tunnel.url}`);
        });

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🌐 For Netlify deployment:');
        console.log('1. Use these URLs in your environment variables');
        console.log('2. Deploy your site to Netlify');
        console.log('3. Your Netlify site will access the local Llama model!');

        if (this.tunnels.has('api')) {
            console.log(`\n🧪 Test API: curl ${this.tunnels.get('api').url}/api/ping`);
        }
    }

    cleanup() {
        console.log('\n🧹 Cleaning up tunnels...');

        this.tunnels.forEach((tunnel, name) => {
            console.log(`🔌 Stopping ${name} tunnel...`);
            tunnel.process.kill('SIGTERM');
        });

        process.exit(0);
    }
}

// CLI Usage
if (require.main === module) {
    const manager = new TunnelManager();

    const command = process.argv[2];

    switch (command) {
        case 'start':
            manager.startAllTunnels().catch(console.error);
            break;
        case 'status':
            manager.displayStatus();
            break;
        default:
            console.log(`
🚇 OceanOS Tunnel Manager

Usage:
  node tools/tunnel-manager.cjs start   - Start all tunnels
  node tools/tunnel-manager.cjs status  - Show tunnel status

Environment:
  API Server: localhost:${manager.config.api_port}
  Ollama: localhost:${manager.config.ollama_port}
      `);
    }
}

module.exports = TunnelManager;