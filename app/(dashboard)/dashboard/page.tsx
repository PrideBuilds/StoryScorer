import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserStats, getRecentStories } from "@/lib/db/stats";
import {
  Sparkles,
  FileText,
  Calendar,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Fetch stats
  const stats = await getUserStats();
  const recentStories = await getRecentStories(5);

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {displayName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your story analysis activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.error ? "—" : stats.totalStories}
            </div>
            <p className="text-xs text-muted-foreground">All time analyzed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.error ? "—" : stats.currentMonthStories}
            </div>
            <p className="text-xs text-muted-foreground">
              Stories analyzed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {stats.error ? "—" : stats.planType}
            </div>
            <p className="text-xs text-muted-foreground">
              Current subscription
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Billing Period
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.error || stats.daysRemaining === null
                ? "—"
                : `${stats.daysRemaining}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.daysRemaining !== null
                ? `Days remaining`
                : "No active subscription"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Analyze a Story</CardTitle>
            <CardDescription>
              Get AI-powered analysis of your user stories against INVEST
              criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/analyzer">
                <Sparkles className="mr-2 h-4 w-4" />
                Start Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>View History</CardTitle>
            <CardDescription>
              Browse and manage your previously analyzed stories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/history">
                View All Stories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your most recently analyzed stories</CardDescription>
        </CardHeader>
        <CardContent>
          {recentStories.error ? (
            <p className="text-sm text-muted-foreground">
              Unable to load recent stories
            </p>
          ) : !recentStories.data || recentStories.data.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No stories analyzed yet
              </p>
              <Button asChild>
                <Link href="/analyzer">Analyze Your First Story</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentStories.data.map((story) => (
                <Link
                  key={story.id}
                  href={`/history?story=${story.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(story.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {story.score !== null && (
                    <Badge
                      variant={
                        story.score >= 80
                          ? "default"
                          : story.score >= 60
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {story.score}/100
                    </Badge>
                  )}
                </Link>
              ))}
              <div className="pt-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/history">View All History</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
