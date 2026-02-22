import { Router } from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Optional: require auth for AI analysis
router.use(authMiddleware);

const analyzeSchema = z.object({
  decision: z.string().min(1).max(500),
  factors: z.object({
    riskTolerance: z.number().min(0).max(100),
    financialStability: z.number().min(0).max(100),
    disciplineLevel: z.number().min(0).max(100),
    supportSystem: z.number().min(0).max(100),
  }),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// AI-powered decision analysis
router.post('/analyze', async (req: AuthRequest, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      res.status(503).json({ error: 'AI analysis not configured' });
      return;
    }

    const { decision, factors } = analyzeSchema.parse(req.body);

    const riskLevel = factors.riskTolerance > 60 ? 'high' : factors.riskTolerance < 40 ? 'low' : 'moderate';
    const financialLevel = factors.financialStability > 60 ? 'secure' : 'challenging';
    const disciplineLevel = factors.disciplineLevel > 60 ? 'high' : 'developing';
    const supportLevel = factors.supportSystem > 60 ? 'strong' : 'limited';

    const prompt = `Analyze this life decision and provide structured feedback:

Decision: "${decision}"

User Profile:
- Risk Tolerance: ${riskLevel} (${factors.riskTolerance}%)
- Financial Stability: ${financialLevel} (${factors.financialStability}%)
- Discipline Level: ${disciplineLevel} (${factors.disciplineLevel}%)
- Support System: ${supportLevel} (${factors.supportSystem}%)

Provide a JSON response with:
1. analysis: A thoughtful 2-3 sentence analysis considering their profile
2. pros: Array of 3-4 specific pros for this decision
3. cons: Array of 3-4 specific cons for this decision  
4. recommendation: A personalized recommendation (1-2 sentences)
5. confidenceScore: A number 0-100 representing confidence in this decision based on their readiness factors

Format as valid JSON only.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a wise decision advisor. Provide thoughtful, balanced analysis of life decisions. Be encouraging but realistic. Always respond with valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      res.status(500).json({ error: 'No response from AI' });
      return;
    }

    // Parse JSON response
    let analysis;
    try {
      // Extract JSON if wrapped in markdown
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/({[\s\S]*})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonStr);
    } catch {
      // Fallback if not valid JSON
      analysis = {
        analysis: content.slice(0, 200),
        pros: ['Consider the potential benefits', 'Growth opportunity', 'New experiences'],
        cons: ['Uncertainty involved', 'Requires commitment', 'May face challenges'],
        recommendation: 'Take time to reflect on your priorities before deciding.',
        confidenceScore: 50,
      };
    }

    res.json(analysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error('AI analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze decision' });
  }
});

export default router;
