import React from 'react';
import { DetectedFallacy } from '../types';

const FALLACY_DATABASE: Record<string, { desc: string; example: string }> = {
  "Abusive Ad Hominem": { desc: "Attacking the character of an opponent rather than their argument.", example: "You're just a fool, so your theory on economics must be wrong." },
  "Ad Hominem": { desc: "Attacking the person instead of the argument.", example: "Why should we listen to a thief's ideas on politics?" },
  "Anecdotal Fallacy": { desc: "Using personal experience or isolated examples instead of sound arguments.", example: "My grandfather smoked 40 a day and lived to 100, so smoking isn't bad." },
  "Appeal to Authority": { desc: "Claiming a statement is true because an authority said so.", example: "My doctor said I should only eat kale, so it's the only healthy food." },
  "Appeal to Emotion": { desc: "Manipulating an emotional response in place of a valid argument.", example: "Think of the children! We must pass this law immediately." },
  "False Dilemma": { desc: "Presenting only two options when more exist.", example: "Either you're with us or against us." },
  "Straw Man": { desc: "Misrepresenting an opponent's argument to make it easier to attack.", example: "You say we should reduce spending, so you want to eliminate all social programs." },
  "Slippery Slope": { desc: "Assuming one action will lead to a chain of negative events.", example: "If we allow same-sex marriage, next people will marry animals." },
  "Hasty Generalization": { desc: "Drawing a conclusion from insufficient evidence.", example: "I met two rude people from that city, so everyone there is rude." },
  "Post Hoc": { desc: "Assuming that because one event followed another, it was caused by it.", example: "I wore my lucky shirt and won the game, so the shirt caused my victory." },
  "Begging the Question": { desc: "Assuming the conclusion in the premises.", example: "God exists because the Bible says so, and the Bible is true because God wrote it." },
  "Red Herring": { desc: "Introducing an irrelevant topic to divert attention.", example: "Why discuss taxes when we should focus on national security?" },
  "Burden Shifting": { desc: "Shifting the burden of proof to the opponent.", example: "Prove that ghosts don't exist!" },
  "Special Pleading": { desc: "Applying different standards to similar situations.", example: "Everyone should follow the rules, except me because I'm special." },
  "Argument from Ignorance": { desc: "Claiming something is true because it hasn't been proven false.", example: "No one has proven aliens don't exist, so they must exist." },
  "Composition Fallacy": { desc: "Assuming what is true for a part is true for the whole.", example: "Every player on this team is a star, so the team is unbeatable." },
  "Division Fallacy": { desc: "Assuming what is true for the whole is true for every part.", example: "This company is great, so every employee must be great." },
  "Bandwagon Fallacy": { desc: "Following the crowd regardless of logic.", example: "All my friends are doing it, so it's fine." },
  "Genetic Fallacy": { desc: "Judging something based on its origins rather than its current state.", example: "This idea came from a cult, so it must be bad." },
  "Tu Quoque": { desc: "Dismissing someone's argument because they don't follow it themselves.", example: "You can't tell me to quit smoking when you smoke too." }
};

export default ({ fallacy, onClose }: { fallacy: DetectedFallacy; onClose: () => void }) => {
  const fallacyInfo = FALLACY_DATABASE[fallacy.name] || {
    desc: fallacy.description || "A logical fallacy detected in the argument.",
    example: fallacy.exampleFromContext || "No example available."
  };

  return (
    <div className="absolute inset-0 z-[160] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={onClose}>
      <div className="border-2 border-red-600 bg-black/90 p-8 max-w-lg w-full rounded-lg shadow-[0_0_30px_rgba(239,68,68,0.5)]" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-red-900/50 pb-4">
            <h2 className="text-red-500 font-orbitron text-xl uppercase tracking-wider">FALLACY_DETECTED</h2>
            <button onClick={onClose} className="text-red-700 hover:text-red-400 text-2xl font-bold">&times;</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-red-400 font-orbitron text-sm uppercase mb-2">Type</div>
              <div className="text-red-300 font-mono text-lg font-bold">{fallacy.name}</div>
            </div>
            
            <div>
              <div className="text-red-400 font-orbitron text-sm uppercase mb-2">Description</div>
              <div className="text-emerald-300 font-mono text-sm leading-relaxed">{fallacyInfo.desc}</div>
            </div>
            
            <div>
              <div className="text-red-400 font-orbitron text-sm uppercase mb-2">Example from Context</div>
              <div className="text-zinc-300 font-mono text-xs bg-zinc-900/50 p-3 rounded border border-red-900/30 leading-relaxed italic">
                "{fallacy.exampleFromContext || fallacyInfo.example}"
              </div>
            </div>
            
            {fallacy.description && fallacy.description !== fallacyInfo.desc && (
              <div>
                <div className="text-red-400 font-orbitron text-sm uppercase mb-2">Analysis</div>
                <div className="text-emerald-200 font-mono text-xs leading-relaxed">{fallacy.description}</div>
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-red-900/50">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-red-500 bg-red-950/30 text-red-400 font-orbitron text-xs uppercase font-bold hover:bg-red-950/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
