import { API_ENDPOINTS, BACKEND_URL } from '@/config/api';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/services/supabaseClient';

// Helper to delay response for realistic UI loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const backendService = {
    // Jan Aushadhi Stores
    getNearestStores: async (lat: number, lon: number) => {
        await delay(1000);
        return {
            status: 'success',
            stores: [
                {
                    id: 'store-1',
                    store_name: 'Jan Aushadhi Kendra - Sector 15',
                    latitude: lat + 0.005,
                    longitude: lon + 0.005,
                    area: 'Sector 15, Vashi',
                    distance_km: '0.6'
                },
                {
                    id: 'store-2',
                    store_name: 'Pradhan Mantri Bhartiya Janaushadhi Kendra',
                    latitude: lat - 0.007,
                    longitude: lon - 0.003,
                    area: 'Koparkhairane',
                    distance_km: '1.2'
                },
                {
                    id: 'store-3',
                    store_name: 'Janaushadhi Kendra - CBD Belapur',
                    latitude: lat + 0.012,
                    longitude: lon - 0.008,
                    area: 'Belapur Station Complex',
                    distance_km: '2.5'
                }
            ]
        };
    },

    endSession: async (patientId: string, log: any[], existingSummary: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/health/daily-summary?patient_id=${patientId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error("Daily summary request failed");
            const result = await response.json();
            return {
                daily_summary: result.summary || "Summary generated successfully.",
                urgency: "Normal",
                key_risks: "None detected",
                symptoms_today: (result.symptoms_reported || []) as string[]
            };
        } catch (e) {
            console.error("endSession API error:", e);
            return {
                daily_summary: "Summary could not be synchronized with server.",
                urgency: "Normal",
                key_risks: "None detected",
                symptoms_today: []
            };
        }
    },

    // Risk Scoring
    generateRisk: async (data: any) => {
        await delay(1000);
        return {
            success: true,
            score: 68,
            level: "Moderate",
            factors: ["Age", "Slightly elevated BP"],
            recommendation: "Monitor BP daily and restrict salt intake.",
            base_score: 65,
            rag_adjustment: 3,
            final_score: 68,
            risk_level: "Moderate",
            guideline_reference: "AHA/ACC Hypertension Guidelines 2017"
        };
    },

    // Risk Prediction
    predictRisk: async (data: any) => {
        await delay(1200);
        return {
            success: true,
            risk_score: 65,
            risk_level: "Moderate",
            cardiovascular_risk: "Low-Moderate",
            diabetes_risk: "Low",
            hypertension_risk: "Moderate",
            recommendations: [
                "Engage in 30 minutes of moderate aerobic exercise 5 days a week.",
                "Ensure regular medical check-ups every 6 months."
            ]
        };
    },

    // Scheme Matching (Jan Aushadhi included)
    matchSchemes: async (data: any) => {
        await delay(800);
        return {
            success: true,
            schemes: [
                {
                    id: "scheme-1",
                    name: "Ayushman Bharat PM-JAY",
                    description: "Provides health cover up to Rs. 5 Lakh per family per year for secondary and tertiary care hospitalization.",
                    benefits: ["Cashless treatment", "Covers pre-existing diseases"],
                    eligibility: "Low-income households"
                },
                {
                    id: "scheme-2",
                    name: "Pradhan Mantri Suraksha Bima Yojana",
                    description: "Accident insurance scheme offering accidental death and disability cover.",
                    benefits: ["Rs. 2 Lakh cover for death/disability"],
                    eligibility: "All bank account holders aged 18-70"
                }
            ],
            generic_alternatives: [
                {
                    brand_name: "Metformin 500mg",
                    generic_name: "Metformin Hydrochloride",
                    brand_price: 45.5,
                    jan_aushadhi_price: 9.2,
                    savings_percent: 80
                },
                {
                    brand_name: "Amlodipine 5mg",
                    generic_name: "Amlodipine Besylate",
                    brand_price: 32.0,
                    jan_aushadhi_price: 5.5,
                    savings_percent: 83
                }
            ]
        };
    },

    // Drug Interaction
    checkInteraction: async (data: any) => {
        await delay(800);
        return {
            success: true,
            has_interaction: false,
            severity: "None",
            description: "No significant interactions found between the selected medications.",
            conflict_found: false,
            warning_text: "",
            recommendation: "No significant interactions found. Safe to proceed."
        };
    },

    // Main Chat
    sendMessage: async (patientId: string, message: string, context: any) => {
        try {
            const response = await fetch(`${BACKEND_URL}/health/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id: patientId, message })
            });
            if (!response.ok) throw new Error("Chat message request failed");
            const res = await response.json();
            
            return {
                bot_reply: res.ai_reply,
                medical_event: res.saving,
                save_status: res.saving ? {
                    action: "Saved to health graph",
                    symptoms_created: res.saved_data?.symptoms || [],
                    symptoms_updated: [],
                    symptoms_resolved: [],
                    message: `Saved to Neo4j graph (Score: ${res.importance_score}/10)`
                } : null
            };
        } catch (e) {
            console.error("sendMessage API error:", e);
            return {
                bot_reply: "I am having trouble communicating with the backend. Please check connection.",
                medical_event: false,
                save_status: null
            };
        }
    },

    extractReport: async (fileUri: string, fileName: string, fileType: string) => {
        await delay(2000);
        return {
            success: true,
            data: {
                patient_name: "Rahul Kumar",
                report_date: "2026-06-10",
                key_findings: "Normal lipid profile. Hemoglobin: 14.5 g/dL (Normal). Blood Glucose (Fasting): 98 mg/dL (Normal).",
                recommendations: "Continue a balanced diet. Repeat lipid profile in 6 months."
            }
        };
    },

    getSymptoms: async () => {
        try {
            const patientId = useAuthStore.getState().patientId || 'demo-patient';
            const { data, error } = await supabase
                .from('symptom_tracker')
                .select('*')
                .eq('user_id', patientId)
                .order('last_reported_at', { ascending: false });
            if (error) throw error;
            return (data || []).map(item => ({
                id: item.id,
                symptom_name: item.symptom_name,
                first_reported_at: item.first_reported_at,
                last_reported_at: item.last_reported_at,
                duration_days: item.reported_duration_days || 0,
                status: item.status,
                severity: item.current_severity || 5
            }));
        } catch (e) {
            console.error("getSymptoms error:", e);
            return [];
        }
    },

    getSummaries: async () => {
        try {
            const patientId = useAuthStore.getState().patientId || 'demo-patient';
            const { data, error } = await supabase
                .from('daily_health_summaries')
                .select('*')
                .eq('patient_id', patientId)
                .order('summary_date', { ascending: false });
            if (error) throw error;
            return data || [];
        } catch (e) {
            console.error("getSummaries error:", e);
            return [];
        }
    }
};
