import { Button } from "@/components/ui/button";

export default function RunnerDashboard() {
  return (
    <div className="flex-1 p-4 md:p-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ring">Runner Dispatch</h1>
            <p className="text-muted-foreground mt-1">Optimized route delivery</p>
          </div>
          <Button variant="outline" className="border-ring text-ring hover:bg-ring/10">Sign Out</Button>
        </header>

        <section className="space-y-6">
          <div className="h-[300px] w-full rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground">
            Venue Map View (Google Maps API placeholder)
          </div>
          
          <div className="p-6 border border-border rounded-lg bg-card space-y-4">
            <h2 className="text-xl font-semibold">Active Batch</h2>
            <div className="text-center text-muted-foreground py-8">
              Waiting for order batches (3+ orders / 90s window)
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
