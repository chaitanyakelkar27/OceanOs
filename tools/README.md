# OceanOS Tools

This directory contains utility scripts for developing and fine-tuning the OceanOS marine biology AI system.

## 🧪 Testing Tools

### `test-ai.cjs`
Tests the Llama 3.1 8B AI integration with the OceanOS API.

**Usage:**
```bash
node tools/test-ai.cjs
```

**What it tests:**
- API connectivity on port 8080
- Species identification accuracy
- Response time and model information
- Confidence scoring

## 🎯 Accuracy Improvement Tools

### `improve-accuracy.cjs`
Improves AI accuracy through enhanced prompting and validation without fine-tuning.

**Usage:**
```bash
node tools/improve-accuracy.cjs
```

**Features:**
- Expert-level marine biology prompts
- Scientific temperature optimization
- Response validation and filtering
- Accuracy testing framework

### `fine-tune.cjs`
Creates specialized Llama models for marine biology (requires Ollama model creation features).

**Usage:**
```bash
node tools/fine-tune.cjs
```

**Features:**
- Custom marine biology model creation
- Training data generation
- Model validation
- Automated AI service updates

## 📋 Quick Usage

**Test current system:**
```bash
# Start your dev server first
npm run dev

# Then test AI integration
node tools/test-ai.cjs
```

**Improve accuracy:**
```bash
# Apply accuracy improvements
node tools/improve-accuracy.cjs

# Restart server to apply changes
npm run dev
```

## 🔧 Requirements

- Ollama running on localhost:11434
- Llama 3.1 8B model installed (`ollama pull llama3.1:8b`)
- OceanOS development server running on port 8080

## 📊 Expected Results

- **Base accuracy**: ~75-80%
- **With improvements**: ~85-90%  
- **With fine-tuning**: ~90-95%

## 🐛 Troubleshooting

**Test fails to connect:**
- Ensure `npm run dev` is running
- Check if Ollama service is running: `ollama list`
- Verify port 8080 is not blocked

**Low accuracy:**
- Run `improve-accuracy.cjs` to apply expert prompting
- Collect more training data for fine-tuning
- Adjust temperature settings in `aiService.ts`