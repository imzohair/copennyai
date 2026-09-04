import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Activity
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Lord Harrington</h1>
        <p className="text-muted-foreground">Here is an overview of your wealth portfolio today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,80,500</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +3.4%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        {/* Monthly Income */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Monthly Income
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹11,400</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +1.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Monthly Expenses
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,820</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-destructive flex items-center">
                <ArrowUpRight className="h-3 w-3" />
                +4.1%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        {/* Savings Rate */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Savings Rate
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">Excellent</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <Progress value={42} className="h-2 mt-3 bg-secondary" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Cash Flow Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
              Chart implementation goes here
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
              Transaction list goes here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
