import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../db/client';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

const createSimulationSchema = z.object({
  decision: z.string().min(1),
  factors: z.object({
    riskTolerance: z.number().min(0).max(100),
    financialStability: z.number().min(0).max(100),
    disciplineLevel: z.number().min(0).max(100),
    supportSystem: z.number().min(0).max(100),
  }),
  results: z.object({
    threeMonths: z.object({
      financial: z.object({ value: z.number(), label: z.string() }),
      emotional: z.object({ value: z.number(), label: z.string() }),
      social: z.object({ value: z.number(), label: z.string() }),
      skills: z.object({ value: z.number(), label: z.string() }),
      stress: z.object({ value: z.number(), label: z.string() }),
    }),
    oneYear: z.object({
      financial: z.object({ value: z.number(), label: z.string() }),
      emotional: z.object({ value: z.number(), label: z.string() }),
      social: z.object({ value: z.number(), label: z.string() }),
      skills: z.object({ value: z.number(), label: z.string() }),
      stress: z.object({ value: z.number(), label: z.string() }),
    }),
    fiveYears: z.object({
      financial: z.object({ value: z.number(), label: z.string() }),
      emotional: z.object({ value: z.number(), label: z.string() }),
      social: z.object({ value: z.number(), label: z.string() }),
      skills: z.object({ value: z.number(), label: z.string() }),
      stress: z.object({ value: z.number(), label: z.string() }),
    }),
    summary: z.string(),
    alternativePath: z.string(),
  }),
});

// Create simulation
router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = createSimulationSchema.parse(req.body);
    const userId = req.user!.id;

    const { data: simulation, error } = await supabase
      .from('simulations')
      .insert([{
        user_id: userId,
        decision: data.decision,
        factors: data.factors,
        results: data.results,
      }])
      .select()
      .single();

    if (error || !simulation) {
      console.error('Create simulation error:', error);
      res.status(500).json({ error: 'Failed to create simulation' });
      return;
    }

    res.status(201).json(simulation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
      return;
    }
    console.error('Create simulation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all simulations for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const { data: simulations, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get simulations error:', error);
      res.status(500).json({ error: 'Failed to fetch simulations' });
      return;
    }

    res.json(simulations || []);
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single simulation
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { data: simulation, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }

    res.json(simulation);
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete simulation
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete simulation error:', error);
      res.status(500).json({ error: 'Failed to delete simulation' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete simulation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
