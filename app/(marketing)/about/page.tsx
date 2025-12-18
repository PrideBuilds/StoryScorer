import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, Linkedin, Twitter } from "lucide-react";

export const metadata = {
  title: "About Us | StoryScorer",
  description: "Learn about StoryScorer's mission to help Business Analysts write better user stories.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About StoryScorer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Empowering Business Analysts to write better user stories through AI-powered analysis
        </p>
      </div>

      <div className="space-y-8">
        {/* Mission Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              StoryScorer was born from a simple observation: writing high-quality, INVEST-compliant
              user stories is challenging, time-consuming, and often inconsistent across teams.
            </p>
            <p className="text-muted-foreground mb-4">
              As Business Analysts ourselves, we've experienced the frustration of spending hours
              crafting user stories, only to have them rejected or require multiple revisions. We
              knew there had to be a better way.
            </p>
            <p className="text-muted-foreground">
              Our mission is to empower Business Analysts with intelligent tools that help them
              write better user stories faster, ensuring consistency, quality, and compliance
              with industry standards like the INVEST framework.
            </p>
          </CardContent>
        </Card>

        {/* Problem Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">The Problem We're Solving</h2>
            <p className="text-muted-foreground mb-4">
              Business Analysts face numerous challenges when writing user stories:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
              <li>
                <strong>Inconsistent Quality:</strong> Without clear guidelines and feedback,
                story quality varies significantly across team members
              </li>
              <li>
                <strong>Time-Consuming Reviews:</strong> Manual review processes are slow and
                often catch issues too late in the development cycle
              </li>
              <li>
                <strong>Lack of Objective Feedback:</strong> Subjective reviews make it difficult
                to improve and maintain standards
              </li>
              <li>
                <strong>INVEST Compliance:</strong> Ensuring stories meet all INVEST criteria
                requires deep knowledge and constant vigilance
              </li>
              <li>
                <strong>Limited Learning Resources:</strong> New BAs struggle to understand what
                makes a good user story without clear, actionable feedback
              </li>
            </ul>
            <p className="text-muted-foreground">
              StoryScorer addresses these challenges by providing instant, AI-powered analysis
              that evaluates stories against INVEST criteria and offers actionable suggestions
              for improvement.
            </p>
          </CardContent>
        </Card>

        {/* Founder Story Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              StoryScorer was founded by a team of experienced Business Analysts and software
              engineers who understand the pain points of writing and reviewing user stories.
            </p>
            <p className="text-muted-foreground mb-4">
              After years of working in agile environments and seeing the same story quality
              issues repeatedly, we decided to leverage modern AI technology to create a solution
              that would help BAs write better stories from the start.
            </p>
            <p className="text-muted-foreground">
              We believe that great software starts with great requirements, and great requirements
              start with well-written user stories. StoryScorer is our contribution to helping
              the BA community elevate their craft.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Quality First</h3>
                <p className="text-muted-foreground text-sm">
                  We're committed to providing accurate, helpful analysis that truly improves
                  story quality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">BA-Focused</h3>
                <p className="text-muted-foreground text-sm">
                  Built by BAs, for BAs. We understand your workflow and design our tools
                  accordingly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Continuous Improvement</h3>
                <p className="text-muted-foreground text-sm">
                  We're always learning and improving our AI models and features based on
                  user feedback.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Privacy & Security</h3>
                <p className="text-muted-foreground text-sm">
                  Your stories are your intellectual property. We protect your data and
                  never use it to train models.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Join Us on This Journey</h2>
            <p className="mb-6 text-blue-100">
              Whether you're a seasoned Business Analyst or just starting out, StoryScorer
              can help you write better user stories. Start your free trial today and see
              the difference AI-powered analysis can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions, feedback, or want to learn more? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hello@storyscorer.com"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-5 w-5" />
                <span>hello@storyscorer.com</span>
              </a>
              <a
                href="https://linkedin.com/company/storyscorer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/storyscorer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

