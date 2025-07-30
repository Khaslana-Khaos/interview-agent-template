"use client";

import { useEffect, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { Modality } from "@google/genai";

function GrammarAssistantComponent() {
    const { setConfig, setModel } = useLiveAPIContext();

    useEffect(() => {
        setModel("models/gemini-2.0-flash-exp");
        setConfig({
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
            systemInstruction: {
                parts: [
                    {
                        text: `You are a helpful grammar and linguistic correction assistant. 
                        Your role is to: 
                        1. Listen carefully to what the user says in French. 
                        2. Identify any grammar, spelling, or pronunciation mistakes in their French sentences. 
                        3. Respond in English, giving constructive corrections and brief explanations. 
                        4. Clearly state the corrected version of the French sentence. 
                        5. Acknowledge when the sentence is already correct to encourage the user. Guidelines for your responses: Be friendly, supportive, and never condescending. 
                        Focus on major errors first if there are multiple issues. Provide the corrected French sentence. 
                        Give a short explanation in English. Use a clear and conversational English tone. 
                        Keep your response concise and suitable for audio format. 
                        Example responses: "Good try! Instead of 'je vais au marché hier,' you should say 'je suis allé au marché hier' because it's past tense and 'aller' uses 'être' as the auxiliary." "Perfect sentence! Nothing to change." "Nice effort! Just a small fix: say 'il m'a dit' instead of 'il a dit moi'  in French, object pronouns go before the verb." 
                        Note:Your response will be used in audio format, so keep it concise and to the point. `,
                    },
                ],
            },
            tools: [
                { googleSearch: {} },
            ],
        });
    }, [setConfig, setModel]);

    return null;
}

export const GrammarAssistant = memo(GrammarAssistantComponent); 