'use client';

import { OpenCodeStats } from '@/types';
import { MessageSquare, Calendar, DollarSign, Hash, Activity, Clock, TrendingUp, BarChart3 } from 'lucide-react';

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

  const avgCards = [
    {
      title: 'Avg/Session',
      value: overview.avgRequests.perSession.toFixed(1),
      icon: Activity,
      description: 'Requests per session',
    },
    {
      title: 'Avg/5 Hours',
      value: overview.avgRequests.per5Hours.toFixed(1),
      icon: Clock,
      description: 'Requests per 5h',
    },
    {
      title: 'Avg/Day',
      value: overview.avgRequests.perDay.toFixed(1),
      icon: TrendingUp,
      description: 'Requests per day',
    },
    {
      title: 'Avg/Week',
      value: overview.avgRequests.perWeek.toFixed(0),
      icon: BarChart3,
      description: 'Requests per week',
    },
    {
      title: 'Avg/Month',
      value: overview.avgRequests.perMonth.toFixed(0),
      icon: BarChart3,
      description: 'Requests per month',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div 
            key={card.title}
            className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    {card.value}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                <card.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Average Requests Stats */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Average Requests
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {avgCards.map((card, index) => (
            <div 
              key={card.title}
              className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-foreground">
                      {card.value}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-foreground">
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
