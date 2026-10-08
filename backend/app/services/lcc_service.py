from typing import List
from app.schemas.pydantic_models import LccTreatmentInput, LccTreatmentResult, LccResponse

class LccService:
    DEFAULT_TREATMENTS = [
        LccTreatmentInput(
            treatment="Preventive Maintenance",
            initial_cost_per_km=128000.0,
            annual_maint_cost_per_km=15000.0,
            life_extension_years=7,
            discount_rate_pct=5.0,
            analysis_period_years=20
        ),
        LccTreatmentInput(
            treatment="Overlay",
            initial_cost_per_km=450000.0,
            annual_maint_cost_per_km=25000.0,
            life_extension_years=10,
            discount_rate_pct=5.0,
            analysis_period_years=20
        ),
        LccTreatmentInput(
            treatment="Rehabilitation",
            initial_cost_per_km=950000.0,
            annual_maint_cost_per_km=35000.0,
            life_extension_years=15,
            discount_rate_pct=5.0,
            analysis_period_years=20
        ),
        LccTreatmentInput(
            treatment="Reconstruction",
            initial_cost_per_km=2200000.0,
            annual_maint_cost_per_km=50000.0,
            life_extension_years=25,
            discount_rate_pct=5.0,
            analysis_period_years=20
        ),
    ]

    def calculate_lcc(
        self,
        section_id: str,
        current_pci: float,
        recommended_action: str,
        custom_treatments: List[LccTreatmentInput] = None
    ) -> LccResponse:
        treatments_input = custom_treatments if custom_treatments else self.DEFAULT_TREATMENTS

        results: List[LccTreatmentResult] = []
        lowest_cost = float('inf')
        lowest_treatment_name = ""

        for tr in treatments_input:
            r = tr.discount_rate_pct / 100.0
            n = tr.analysis_period_years
            
            # Present Value of annual maintenance cost
            pv_maint = 0.0
            if r > 0:
                for year in range(1, n + 1):
                    pv_maint += tr.annual_maint_cost_per_km / ((1 + r) ** year)
            else:
                pv_maint = tr.annual_maint_cost_per_km * n

            total_lcc = tr.initial_cost_per_km + pv_maint

            # Determine feasibility
            feasible = True
            notes = "Technically feasible option."

            if current_pci < 30 and tr.treatment in ["Preventive Maintenance", "Overlay"]:
                feasible = False
                notes = "Infeasible due to severe structural pavement distress."

            if total_lcc < lowest_cost and feasible:
                lowest_cost = total_lcc
                lowest_treatment_name = tr.treatment

            # Check if this treatment matches the AI screening recommendation
            is_rec = False
            if "Preventive" in recommended_action and tr.treatment == "Preventive Maintenance":
                is_rec = True
            elif "Overlay" in recommended_action and tr.treatment == "Overlay":
                is_rec = True
            elif "Minor" in recommended_action and tr.treatment in ["Preventive Maintenance", "Overlay"]:
                is_rec = True
            elif "Rehabilitation" in recommended_action and tr.treatment == "Rehabilitation":
                is_rec = True
            elif "Reconstruction" in recommended_action and tr.treatment == "Reconstruction":
                is_rec = True

            results.append(LccTreatmentResult(
                treatment=tr.treatment,
                initial_cost=round(tr.initial_cost_per_km, 2),
                annual_maint_cost=round(tr.annual_maint_cost_per_km, 2),
                pv_maint_cost=round(pv_maint, 2),
                total_pv_lcc=round(total_lcc, 2),
                life_extension_years=tr.life_extension_years,
                feasible=feasible,
                is_lowest_cost=False,
                is_recommended=is_rec,
                notes=notes
            ))

        # Flag lowest cost
        for r in results:
            if r.treatment == lowest_treatment_name:
                r.is_lowest_cost = True

        optimal_tr = next((r.treatment for r in results if r.is_recommended and r.feasible), lowest_treatment_name)
        optimal_cost = next((r.total_pv_lcc for r in results if r.treatment == optimal_tr), lowest_cost)

        return LccResponse(
            section_id=section_id,
            current_pci=current_pci,
            recommended_action=recommended_action,
            treatments=results,
            optimal_treatment=optimal_tr,
            optimal_lcc=optimal_cost
        )

lcc_service = LccService()
