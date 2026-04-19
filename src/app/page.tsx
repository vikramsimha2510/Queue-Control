"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Store, User, MapIcon, Compass } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleDemoLogin = (role: string) => {
    // Set a dummy cookie for demo mode middleware
    document.cookie = `demo_role=${role}; path=/; max-age=86400`;
    router.push(`/${role}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-3xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary">
            VenueTrix
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Premium Venue-Commerce Platform. Seat-level ordering, real-time communication, and smart dispatch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader className="text-center pb-2">
              <User className="w-12 h-12 mx-auto text-primary mb-4" />
              <CardTitle className="text-2xl">Customer</CardTitle>
              <CardDescription>Order direct to your seat</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleDemoLogin('customer')}
                className="w-full font-medium"
                size="lg"
              >
                Enter as Customer
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-secondary/20">
            <CardHeader className="text-center pb-2">
              <Store className="w-12 h-12 mx-auto text-secondary mb-4" />
              <CardTitle className="text-2xl">Vendor</CardTitle>
              <CardDescription>Manage incoming orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary"
                onClick={() => handleDemoLogin('vendor')}
                className="w-full font-medium"
                size="lg"
              >
                Enter as Vendor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-ring/20">
            <CardHeader className="text-center pb-2">
              <MapIcon className="w-12 h-12 mx-auto text-ring mb-4" />
              <CardTitle className="text-2xl">Runner</CardTitle>
              <CardDescription>Smart dispatch routing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                onClick={() => handleDemoLogin('runner')}
                className="w-full font-medium border-ring text-ring hover:bg-ring/10"
                size="lg"
              >
                Enter as Runner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
