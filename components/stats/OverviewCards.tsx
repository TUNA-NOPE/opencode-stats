'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpenCodeStats } from '@/types';
import { MessageSquare, Calendar, DollarSign, Hash } from 'lucide-react';

interface OverviewCardsProps {
  stats: OpenCodeStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  const { overview, cost } = stats;
  
  const cards = [
    {
      title: 'Total Sessions',
      value: overview.sessions.toLocaleString(),
      icon: Hash,
      description: 'OpenCode sessions',
    },
    {
      title: 'Total Messages',
      value: overview.messages.toLocaleString(),
      icon: MessageSquare,
      description: 'Messages sent',
    },
    {
      title: 'Days Active',
      value: overview.days.toString(),
      icon: Calendar,
      description: 'Active days',
    },
    {
      title: 'Total Cost',
      value: `$${cost.totalCost.toFixed(2)}`,
      icon: DollarSign,
      description: `~$${cost.avgCostPerDay.toFixed(2)}/day`,
    },
  ];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
