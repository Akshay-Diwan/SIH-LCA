impo
import numpy as np
import random

app = FastAPI(title="LCIA Engine")

# ---------- Models ----------
class InventoryVector(BaseModel):
    vector: dict  # e.g. {"CO2": 3.3, "CH4": 0.001}

class CharacterizationFactor(BaseModel):
    method_name: str
    cf_matrix: dict  # e.g. {"Climate Change": {"CO2": 1.0, "CH4": 28.0}}

class LCIARequest(BaseModel):
    inventory: InventoryVector
    factors: CharacterizationFactor
    monte_carlo_runs: int = 1000
    uncertainty_percent: float = 10.0

# ---------- Helper Functions ----------
def compute_lcia(inventory: dict, cf_matrix: dict):
    """Perform deterministic LCIA calculation."""
    results = {}
    for category, flows in cf_matrix.items():
        total = sum(inventory.get(flow, 0) * factor for flow, factor in flows.items())
        results[category] = total
    return results

def monte_carlo_lcia(inventory, cf_matrix, runs=1000, uncertainty_percent=10.0):
    """Monte Carlo simulation of LCIA with random variation."""
    results_mc = {category: [] for category in cf_matrix.keys()}

    for _ in range(runs):
        noisy_inventory = {
            flow: val * random.uniform(
                1 - uncertainty_percent/100,
                1 + uncertainty_percent/100
            )
            for flow, val in inventory.items()
        }
        res = compute_lcia(noisy_inventory, cf_matrix)
        for cat, val in res.items():
            results_mc[cat].append(val)

    # Aggregate statistics
    stats = {}
    for cat, vals in results_mc.items():
        arr = np.array(vals)
        stats[cat] = {
            "mean": float(np.mean(arr)),
            "std": float(np.std(arr)),
            "p95": float(np.percentile(arr, 95))
        }
    return stats

# ---------- API Endpoints ----------
@app.post("/lcia")
def calculate_lcia(req: LCIARequest):
    deterministic = compute_lcia(req.inventory.vector, req.factors.cf_matrix)
    monte_carlo = monte_carlo_lcia(
        req.inventory.vector,
        req.factors.cf_matrix,
        runs=req.monte_carlo_runs,
        uncertainty_percent=req.uncertainty_percent
    )
    return {
        "method": req.factors.method_name,
        "deterministic_result": deterministic,
        "monte_carlo_results": monte_carlo
    }
