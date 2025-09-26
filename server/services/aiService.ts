import { Ollama } from 'ollama';

export class AIService {
    protected ollama: Ollama;

    constructor() {
        this.ollama = new Ollama({
            host: 'http://localhost:11434' // Default Ollama host
        });
    }

    /**
     * Enhanced species database for Indian Ocean marine life with detailed characteristics
     */
    private readonly speciesDatabase = [
        {
            id: "sp_1",
            scientific_name: "Thunnus albacares",
            common_name: "Yellowfin Tuna",
            habitat: "pelagic",
            typical_length: 150,
            color_patterns: ["metallic blue-black", "bright yellow fins", "silver belly"],
            fin_characteristics: ["long pectoral fins", "bright yellow dorsal and anal fins"],
            body_shape: "streamlined torpedo shape",
            distinctive_features: ["yellow finlets", "metallic sheen", "deeply forked tail"]
        },
        {
            id: "sp_2",
            scientific_name: "Scomber japonicus",
            common_name: "Japanese Mackerel",
            habitat: "coastal",
            typical_length: 35,
            color_patterns: ["blue-green back", "silver sides", "dark wavy lines"],
            fin_characteristics: ["two dorsal fins", "small finlets"],
            body_shape: "elongated fusiform",
            distinctive_features: ["dark zigzag lines on back", "forked tail", "no swim bladder"]
        },
        {
            id: "sp_3",
            scientific_name: "Sardinella longiceps",
            common_name: "Indian Oil Sardine",
            habitat: "coastal",
            typical_length: 20,
            color_patterns: ["silvery body", "greenish-blue back"],
            fin_characteristics: ["single dorsal fin", "deeply forked tail"],
            body_shape: "compressed laterally",
            distinctive_features: ["large eyes", "no lateral line scales", "golden spot behind gill"]
        },
        {
            id: "sp_4",
            scientific_name: "Pampus argenteus",
            common_name: "Silver Pomfret",
            habitat: "coastal",
            typical_length: 40,
            color_patterns: ["bright silver", "sometimes with black spots"],
            fin_characteristics: ["long dorsal and anal fins", "deeply forked tail"],
            body_shape: "laterally compressed oval",
            distinctive_features: ["no pelvic fins", "small mouth", "smooth scales"]
        },
        {
            id: "sp_5",
            scientific_name: "Harpadon nehereus",
            common_name: "Bombay Duck",
            habitat: "coastal",
            typical_length: 30,
            color_patterns: ["translucent pale body", "silvery when fresh"],
            fin_characteristics: ["long dorsal fin", "small adipose fin"],
            body_shape: "elongated and soft",
            distinctive_features: ["gelatinous body", "large mouth with sharp teeth", "no scales"]
        },
        {
            id: "sp_6",
            scientific_name: "Katsuwonus pelamis",
            common_name: "Skipjack Tuna",
            habitat: "pelagic",
            typical_length: 80,
            color_patterns: ["dark blue-purple back", "silver belly", "dark stripes"],
            fin_characteristics: ["triangular first dorsal fin", "yellow-edged fins"],
            body_shape: "fusiform torpedo",
            distinctive_features: ["prominent dark stripes on sides", "no swim bladder", "scaleless body behind corselet"]
        },
        {
            id: "sp_7",
            scientific_name: "Rastrelliger kanagurta",
            common_name: "Indian Mackerel",
            habitat: "coastal",
            typical_length: 25,
            color_patterns: ["green-blue back", "golden sides", "dark spots and stripes"],
            fin_characteristics: ["two dorsal fins", "5-6 finlets"],
            body_shape: "streamlined fusiform",
            distinctive_features: ["golden yellow patches", "dark round spots", "no swim bladder"]
        },
        {
            id: "sp_8",
            scientific_name: "Lutjanus argentimaculatus",
            common_name: "Mangrove Red Snapper",
            habitat: "reef",
            typical_length: 120,
            color_patterns: ["reddish-pink to orange", "silver patches", "darker on back"],
            fin_characteristics: ["spiny dorsal fin", "rounded tail"],
            body_shape: "moderately compressed oval",
            distinctive_features: ["large canine teeth", "red eyes", "prominent lower jaw"]
        }
    ];

    /**
     * Generate enhanced species identification prompt for Llama 3.1
     */
    private generateSpeciesPrompt(traits: any, hasImage: boolean): string {
        const context = `You are Dr. Marina Piscis, a senior marine biologist with 25+ years of experience in Indian Ocean fisheries research at CMLRE, Kochi. You have personally identified over 800 species and authored 50+ research papers on fish taxonomy.

CRITICAL EXPERTISE:
- Indian Ocean fish species (Arabian Sea, Bay of Bengal)  
- Commercial and non-commercial marine species
- Habitat-based species distribution patterns
- Size-based maturity and life stages
- Morphometric analysis and taxonomic keys

IDENTIFICATION METHODOLOGY:
1. Analyze ALL provided characteristics systematically
2. Apply taxonomic keys and morphometric ratios  
3. Consider geographic probability (Indian Ocean range)
4. Factor in habitat specificity and depth preferences
5. Account for seasonal variations and life stages

ACCURACY STANDARDS:
- Only suggest species you are CERTAIN about
- Lower confidence for incomplete data is better than wrong ID
- Always explain diagnostic features used
- Mention key distinguishing characteristics
- Acknowledge when additional data is needed

INPUT DATA:
${hasImage ? '- High-resolution fish image provided for analysis' : '- No image provided - morphological data only'}
${traits.length ? `- Length: ${traits.length} cm` : '- Length: Not specified'}
${traits.habitat ? `- Habitat: ${traits.habitat}` : '- Habitat: Not specified'}
${traits.color ? `- Coloration: ${traits.color}` : '- Coloration: Not specified'}
${traits.fins ? `- Fin pattern: ${traits.fins}` : '- Fin pattern: Not specified'}
${traits.body_shape ? `- Body shape: ${traits.body_shape}` : ''}
${traits.distinctive_features ? `- Features: ${traits.distinctive_features.join(', ')}` : ''}

Geographic Context: Indian Ocean coastal waters (Arabian Sea/Bay of Bengal region)

REQUIRED OUTPUT FORMAT - Return ONLY valid JSON array:
[
  {
    "scientific_name": "Genus species",
    "common_name": "Preferred Indian regional name",
    "confidence": 0.85,
    "reasoning": "Specific diagnostic features: size 35cm matches adult range, coastal habitat preferred, characteristic blue-green dorsal coloration with dark wavy lines, two dorsal fins diagnostic for this species in Indian Ocean waters"
  }
]

Provide 3-5 most likely species with conservative confidence scores (0.0-1.0). Scientific accuracy over speed.`;

        return context;
    }

    /**
     * Identify species using Llama 3.1 8B model with timeout handling
     */
    async identifySpecies(traits: any = {}, hasImage: boolean = false): Promise<any[]> {
        try {
            // Quick service check with timeout
            const serviceAvailable = await this.isServiceAvailable();
            const modelAvailable = serviceAvailable ? await this.isModelAvailable() : false;

            if (!serviceAvailable || !modelAvailable) {
                console.log('🔄 Using fallback identification (Ollama/model unavailable)');
                return this.fallbackSpeciesIdentification(traits, hasImage);
            }

            console.log('🦙 Attempting Llama 3.1 8B identification...');

            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('AI request timeout')), 8000); // 8 second timeout
            });

            const prompt = this.generateSpeciesPrompt(traits, hasImage);

            const aiPromise = this.ollama.chat({
                model: 'llama3.1:8b',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a marine biology expert. Always respond with valid JSON only, no additional text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                options: {
                    temperature: 0.05,  // Very low for scientific accuracy
                    top_p: 0.8,         // Focused sampling
                    num_predict: 800,   // Detailed responses
                    top_k: 10          // Limited options for precision
                }
            });

            // Race between AI response and timeout
            const response = await Promise.race([aiPromise, timeoutPromise]) as any;

            // Parse the response
            const content = response.message?.content || '[]';

            // Clean up and validate the response
            const jsonMatch = content.match(/\[[\s\S]*?\]/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from AI model');
            }

            const aiSuggestions = JSON.parse(jsonMatch[0]);

            console.log('✅ Llama 3.1 8B identification successful');

            // Enhanced validation and filtering
            const validatedSuggestions = aiSuggestions
                .filter((suggestion: any) =>
                    suggestion.scientific_name &&
                    suggestion.confidence &&
                    suggestion.confidence >= 0.3  // Filter very low confidence
                )
                .map((suggestion: any, index: number) => ({
                    scientific_name: suggestion.scientific_name,
                    common_name: suggestion.common_name || 'Unknown',
                    score: Math.min(0.95, suggestion.confidence), // Cap at 95% for realism
                    confidence: this.getConfidenceLabel(suggestion.confidence),
                    reasoning: suggestion.reasoning || 'AI-powered marine biology analysis',
                    rank: index + 1,
                    source: 'Llama 3.1 8B Expert Analysis'
                }))
                .sort((a: any, b: any) => b.score - a.score);

            return validatedSuggestions;

        } catch (error) {
            console.error('Error in AI species identification, using fallback:', error.message);

            // Fallback to enhanced heuristic matching if AI fails
            return this.fallbackSpeciesIdentification(traits, hasImage);
        }
    }

    /**
     * Get confidence label from numeric score
     */
    private getConfidenceLabel(score: number): string {
        if (score >= 0.85) return 'very high';
        if (score >= 0.7) return 'high';
        if (score >= 0.5) return 'medium';
        if (score >= 0.3) return 'low';
        return 'very low';
    }

    /**
     * Fallback heuristic matching when AI service is unavailable
     */
    private fallbackSpeciesIdentification(traits: any = {}, hasImage: boolean = false): any[] {
        const suggestions = this.speciesDatabase
            .map(species => {
                let score = 0.3 + Math.random() * 0.2; // Base score

                // Habitat matching
                if (traits.habitat && species.habitat === traits.habitat) {
                    score += 0.25;
                }

                // Length matching
                if (traits.length) {
                    const lengthDiff = Math.abs(species.typical_length - parseInt(traits.length));
                    const lengthScore = Math.max(0, 1 - (lengthDiff / species.typical_length));
                    score += lengthScore * 0.2;
                }

                // Color matching (basic heuristic)
                if (traits.color && species.color_patterns.some(pattern =>
                    pattern.toLowerCase().includes(traits.color.toLowerCase()))) {
                    score += 0.15;
                }

                // Image bonus
                if (hasImage) {
                    score += 0.1;
                }

                return {
                    id: species.id,
                    scientific_name: species.scientific_name,
                    common_name: species.common_name,
                    score: Math.min(0.92, score), // Cap at 92% for fallback
                    confidence: score >= 0.7 ? 'medium' : 'low',
                    reasoning: 'Heuristic matching (AI service unavailable)'
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        return suggestions;
    }

    /**
     * Check if Ollama service is available
     */
    async isServiceAvailable(): Promise<boolean> {
        try {
            await this.ollama.list();
            return true;
        } catch (error) {
            console.warn('Ollama service not available:', error);
            return false;
        }
    }

    /**
     * Check if Llama 3.1 8B model is available
     */
    async isModelAvailable(): Promise<boolean> {
        try {
            const models = await this.ollama.list();
            return models.models.some(model =>
                model.name.includes('llama3.1:8b') ||
                model.name.includes('llama3.1') ||
                model.name.includes('llama3')
            );
        } catch (error) {
            return false;
        }
    }

    /**
     * Pull Llama 3.1 8B model if not available
     */
    async ensureModel(): Promise<void> {
        const isAvailable = await this.isModelAvailable();
        if (!isAvailable) {
            console.log('Pulling Llama 3.1 8B model...');
            await this.ollama.pull({ model: 'llama3.1:8b' });
        }
    }
}

// Export singleton instance
export const aiService = new AIService();