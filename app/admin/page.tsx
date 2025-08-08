"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LocationAnalyticsData {
  locationStats: Array<{
    country: string;
    countryCode?: string;
    region?: string;
    city?: string;
    totalSessions: number;
    completedSessions: number;
    avgRounds: number;
    firstSession: Date;
    latestSession: Date;
  }>;
  totalStats: {
    totalSessionsWithLocation: number;
    uniqueCountries: number;
    uniqueCities: number;
  };
}

interface AnalyticsData {
  popularFinalColors: Array<{
    hex: string;
    name: string;
    category: string;
    frequency: number;
    avgRank: number;
    avgHue: number;
    avgSaturation: number;
    avgLightness: number;
  }>;
  huePreferences: Array<{
    hue_range: number;
    frequency: number;
  }>;
  saturationPreferences: Array<{
    saturation_range: number;
    frequency: number;
  }>;
  lightnessPreferences: Array<{
    lightness_range: number;
    frequency: number;
  }>;
  colorNamePreferences: Array<{
    name: string;
    count: number;
  }>;
  categoryPreferences: Array<{
    category: string;
    count: number;
  }>;
  totalSessions: number;
  totalColors: number;
  totalRounds: number;
}

interface GameResult {
  id: string;
  completedAt: string;
  userAgent: string;
  totalRounds: number;
  finalColors: Array<{
    hex: string;
    rank: number;
    hsl: { h: number; s: number; l: number };
    selectionCount: number;
  }>;
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [locationAnalytics, setLocationAnalytics] =
    useState<LocationAnalyticsData | null>(null);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch analytics
      const analyticsResponse = await fetch("/api/analytics");
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData.data);
      }

      // Fetch location analytics
      const locationResponse = await fetch(
        "/api/game-results?locationAnalytics=true"
      );
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        setLocationAnalytics(locationData.locationAnalytics);
      }

      // Fetch game results
      const resultsResponse = await fetch("/api/game-results?limit=50");
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        setGameResults(resultsData.results || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading Analytics...</h2>
          <p className="text-muted-foreground">Fetching game data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-destructive">
            Error
          </h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🍽️ Yummy Colors Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Insights from color preference data
          </p>
          <Button onClick={fetchData} className="mt-4">
            Refresh Data
          </Button>
        </div>

        {analytics && (
          <div className="grid gap-6 mb-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalSessions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Completed games
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Colors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalColors}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Final color selections
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Rounds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics.totalRounds}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Color selection rounds
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Popular Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Final Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {analytics.popularFinalColors
                    .slice(0, 10)
                    .map((color, index) => (
                      <div key={color.hex} className="text-center">
                        <div
                          className="w-full aspect-square rounded-lg mb-2 border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-sm font-mono">{color.hex}</div>
                        <div className="text-xs font-medium">{color.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {color.category}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          #{index + 1} • {color.frequency} selections
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Avg rank: {color.avgRank.toFixed(1)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Analytics */}
            {locationAnalytics && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Location Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Location Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {
                            locationAnalytics.totalStats
                              .totalSessionsWithLocation
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sessions with location
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {locationAnalytics.totalStats.uniqueCountries}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Countries
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {locationAnalytics.totalStats.uniqueCities}
                        </div>
                        <p className="text-xs text-muted-foreground">Cities</p>
                      </div>
                    </div>

                    {/* Top Locations */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">Top Locations</h4>
                      <div className="space-y-2">
                        {locationAnalytics.locationStats
                          .slice(0, 10)
                          .map((location, index) => (
                            <div
                              key={`${location.country}-${location.city}-${index}`}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">
                                  {location.countryCode}
                                </span>
                                <div>
                                  <div className="font-medium">
                                    {location.city}, {location.region}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {location.country}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  {location.totalSessions}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {location.completedSessions} completed
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Color Preferences Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hue Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.huePreferences.map((pref) => (
                      <div
                        key={pref.hue_range}
                        className="flex items-center gap-2"
                      >
                        <div className="w-16 text-xs">
                          {pref.hue_range}°-{pref.hue_range + 30}°
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${
                                (pref.frequency /
                                  Math.max(
                                    ...analytics.huePreferences.map(
                                      (p) => p.frequency
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="w-8 text-xs text-right">
                          {pref.frequency}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saturation Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.saturationPreferences.map((pref) => (
                      <div
                        key={pref.saturation_range}
                        className="flex items-center gap-2"
                      >
                        <div className="w-16 text-xs">
                          {pref.saturation_range}%-{pref.saturation_range + 10}%
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${
                                (pref.frequency /
                                  Math.max(
                                    ...analytics.saturationPreferences.map(
                                      (p) => p.frequency
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="w-8 text-xs text-right">
                          {pref.frequency}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lightness Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.lightnessPreferences.map((pref) => (
                      <div
                        key={pref.lightness_range}
                        className="flex items-center gap-2"
                      >
                        <div className="w-16 text-xs">
                          {pref.lightness_range}%-{pref.lightness_range + 10}%
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{
                              width: `${
                                (pref.frequency /
                                  Math.max(
                                    ...analytics.lightnessPreferences.map(
                                      (p) => p.frequency
                                    )
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <div className="w-8 text-xs text-right">
                          {pref.frequency}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Color Name and Category Preferences */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Color Name Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Color Names</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.colorNamePreferences.map((pref, index) => (
                      <div key={pref.name} className="flex items-center gap-2">
                        <div className="text-sm font-medium min-w-0 flex-1">
                          #{index + 1} {pref.name}
                        </div>
                        <div className="w-20 text-xs text-right text-muted-foreground">
                          {pref.count} selections
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Color Category Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.categoryPreferences.map((pref, index) => (
                      <div
                        key={pref.category}
                        className="flex items-center gap-2"
                      >
                        <div className="text-sm font-medium min-w-0 flex-1 capitalize">
                          #{index + 1} {pref.category}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{
                                width: `${
                                  (pref.count /
                                    analytics.categoryPreferences[0]?.count) *
                                    100 || 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-12 text-xs text-right text-muted-foreground">
                          {pref.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Recent Game Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Game Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gameResults.slice(0, 10).map((result) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Game {result.id.slice(0, 8)}...
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {result.finalColors.map((color) => (
                      <div key={color.rank} className="text-center">
                        <div
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-xs mt-1">#{color.rank}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.totalRounds} rounds •{" "}
                    {result.userAgent.includes("Mobile") ? "Mobile" : "Desktop"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
