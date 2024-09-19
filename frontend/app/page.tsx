import { BookOpen, Users, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/feature-card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="m-2">
        <ThemeToggle />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
              Ace Your Tech Interviews with PeerPrep
            </h1>
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-xl text-muted-foreground mb-8">
                Practice coding interviews with peers, access a vast question
                bank, and improve your skills with AI-powered feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/login">
                  <Button size="lg">Log In</Button>
                </Link>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose PeerPrep?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="Extensive Question Bank"
              description="Access a wide range of coding questions, from easy to hard, covering all major topics."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Peer Matching"
              description="Practice with peers at your skill level for realistic interview experiences."
            />
            <FeatureCard
              icon={<Code className="h-10 w-10 text-primary" />}
              title="Real-time Collaboration"
              description="Code together in real-time with integrated video chat and shared code editor."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="AI-Powered Feedback"
              description="Receive instant, personalized feedback on your code and problem-solving approach."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who have improved their skills with
            PeerPrep.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
