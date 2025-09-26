// Simple AI integration test using Node.js built-in modules only
const http = require('http');

function testAI() {
  console.log('🧪 Testing OceanOS AI Species Identification\n');

  const testData = JSON.stringify({
    traits: {
      length: 35,
      habitat: 'coastal',
      color: 'blue-green',
      fins: 'two dorsal fins'
    }
  });

  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/taxonomy/classify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testData)
    }
  };

  console.log('📡 Testing API endpoint: http://localhost:8080/api/taxonomy/classify');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);

        console.log('✅ API call successful!');
        console.log(`🤖 Model used: ${result.meta.model}`);
        console.log(`⏱️ Processing time: ${result.meta.processing_time.toFixed(2)}s`);
        console.log(`🔌 AI service available: ${result.meta.ai_service_available}`);
        console.log('\n📊 Species suggestions:');

        result.suggestions.slice(0, 3).forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion.scientific_name} (${suggestion.common_name})`);
          console.log(`      Confidence: ${(suggestion.score * 100).toFixed(1)}% (${suggestion.confidence})`);
          if (suggestion.reasoning) {
            console.log(`      Reasoning: ${suggestion.reasoning}`);
          }
        });

        console.log('\n🎯 Integration Test Results:');
        console.log('✅ Your OceanOS AI system is working!');
        console.log('🔗 API endpoint: http://localhost:8080/api/taxonomy/classify');

        if (!result.meta.ai_service_available) {
          console.log('\n💡 To enable full Llama 3.1 8B capabilities:');
          console.log('   1. Install Ollama: https://ollama.ai');
          console.log('   2. Run: ollama serve');
          console.log('   3. Pull model: ollama pull llama3.1:8b');
          console.log('\n📋 Currently using intelligent fallback heuristics.');
        } else {
          console.log('\n🚀 Llama 3.1 8B is ready and working!');
        }

      } catch (error) {
        console.error('❌ JSON parsing error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Make sure the dev server is running: npm run dev');
    console.log('   • Check if the server is accessible at http://localhost:8080');
    console.log('   • Verify the API endpoint exists');
  });

  req.write(testData);
  req.end();
}

testAI();