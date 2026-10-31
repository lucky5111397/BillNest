import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PlaceholderPage() {
  const location = useLocation();
  const routeName = location.pathname.replace('/', '') || 'module';
  const formattedTitle = routeName.charAt(0).toUpperCase() + routeName.slice(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
            <Construction className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">{formattedTitle} Module</CardTitle>
          <CardDescription>
            This section is part of the planned Brightloop domain roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground space-y-4">
          <p>
            In accordance with Phase 0 architectural rules, business implementations are deferred
            until their respective phase milestones.
          </p>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs">Module Status:</span>
            <Badge variant="outline">Scheduled for Upcoming Phase</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
