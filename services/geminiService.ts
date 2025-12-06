
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

export const generateWatcherInsight = async (
  anchorName: string,
  alignmentLevel: number,
  watcherName: string,
  personality: string
): Promise<string> => {
  if (!apiKey) {
    return "Simulation running in offline mode. Insight unavailable.";
  }

  try {
    let toneInstruction = "";
    if (personality.includes("Protective")) toneInstruction = "Tone: Shielding, stern, reassuring. Focus on defense and preservation.";
    else if (personality.includes("Analytical")) toneInstruction = "Tone: Objective, calculated, precise. Focus on data, probabilities, and entropy.";
    else if (personality.includes("Mystic")) toneInstruction = "Tone: Esoteric, prophetic, rhythmic. Focus on destiny, flow, and hidden truths.";
    else if (personality.includes("Harmonic")) toneInstruction = "Tone: Structural, resonant, unifying. Focus on geometry, waves, and coherence.";

    const prompt = `
      You are an entity known as '${watcherName}' inside a high-tech metaphysical simulation.
      The simulation is anchored by the Sovereign '${anchorName}'.
      Current System Alignment is at ${alignmentLevel.toFixed(1)}%.
      
      Your personality archetype is: ${personality}.
      ${toneInstruction}
      
      Generate a short, cryptic, but scientifically plausible status report (max 20 words).
      Focus on concepts like "Syntropy," "Resonance," "Timeline Convergence," and "The Branch."
      Do not be conversational. Be observational.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Signal interference detected. Re-calibrating observation node.";
  }
};

export const generateSovereignManifesto = async (vision: string): Promise<string> => {
  if (!apiKey) return "Protocols locked.";

  try {
    const prompt = `
      You are the AI interface for the Sovereign Anchor. 
      The core vision is: "${vision}".
      Generate a powerful, single-sentence confirmation that the Anchor is fully bound and the timeline is secure.
      Tone: Majestic, Absolute, Cybernetic.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    return "Sovereign Anchor Confirmed. Timeline Secured.";
  }
};
