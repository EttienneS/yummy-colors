"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Area,
  AreaChart,
} from "recharts";

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
                        {/* Color square: try to find the color hex from popularFinalColors, fallback to gray if not found */}
                        <div
                          className="w-4 h-4 rounded border mr-2"
                          style={{
                            backgroundColor:
                              analytics.popularFinalColors.find(
                                (c) => c.name === pref.name
                              )?.hex || "#e5e7eb",
                          }}
                          title={
                            analytics.popularFinalColors.find(
                              (c) => c.name === pref.name
                            )?.hex || "Unknown"
                          }
                        />
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

        {/* New Charts Section */}
        {analytics && (
          <div className="grid gap-6 mb-8">
            {/* Most Popular Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.popularFinalColors.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, "Frequency"]}
                      labelFormatter={(label) => `Color: ${label}`}
                    />
                    <Bar dataKey="frequency">
                      {analytics.popularFinalColors
                        .slice(0, 25)
                        .map((entry, index) => (
                          <Cell key={`cell-most-${index}`} fill={entry.hex} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Least Popular Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Least Popular Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[...analytics.popularFinalColors]
                      .sort((a, b) => a.frequency - b.frequency)
                      .slice(0, 25)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, "Frequency"]}
                      labelFormatter={(label) => `Color: ${label}`}
                    />
                    <Bar dataKey="frequency">
                      {[...analytics.popularFinalColors]
                        .sort((a, b) => a.frequency - b.frequency)
                        .slice(0, 25)
                        .map((entry, index) => (
                          <Cell key={`cell-least-${index}`} fill={entry.hex} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Hue vs Saturation Scatter Plot */}
            <Card>
              <CardHeader>
                <CardTitle>Hue vs Saturation Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="avgHue"
                      name="Hue"
                      domain={[0, 360]}
                      label={{
                        value: "Hue (°)",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="avgSaturation"
                      name="Saturation"
                      domain={[0, 100]}
                      label={{
                        value: "Saturation (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value, name) => [value, name]}
                      labelFormatter={() => ""}
                      content={({ payload }) => {
                        if (payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: data.hex }}
                                />
                                <span className="font-medium">{data.name}</span>
                              </div>
                              <div>Hue: {data.avgHue.toFixed(1)}°</div>
                              <div>
                                Saturation: {data.avgSaturation.toFixed(1)}%
                              </div>
                              <div>Frequency: {data.frequency}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter
                      data={analytics.popularFinalColors}
                      shape={(props) => {
                        const { cx, cy, payload } = props;
                        // Scale frequency for point size (min 6, max 24)
                        const minSize = 6;
                        const maxSize = 24;
                        const minFreq = Math.min(
                          ...analytics.popularFinalColors.map(
                            (c) => c.frequency
                          )
                        );
                        const maxFreq = Math.max(
                          ...analytics.popularFinalColors.map(
                            (c) => c.frequency
                          )
                        );
                        const size =
                          minFreq === maxFreq
                            ? minSize
                            : minSize +
                              ((payload.frequency - minFreq) /
                                (maxFreq - minFreq)) *
                                (maxSize - minSize);
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={size / 2}
                            fill={payload.hex}
                            stroke="#333"
                            strokeWidth={1}
                            opacity={0.85}
                          />
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Color Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <>
                    <PieChart>
                      <Pie
                        data={analytics.categoryPreferences}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }
                        outerRadius={80}
                        dataKey="count"
                      >
                        {analytics.categoryPreferences.map((entry, index) => {
                          // Find a representative color hex for this category
                          const repColor =
                            analytics.popularFinalColors.find(
                              (c) => c.category === entry.category
                            )?.hex || `hsl(${index * 45}, 70%, 50%)`;
                          return <Cell key={`cell-${index}`} fill={repColor} />;
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} selections`,
                          name,
                        ]}
                      />
                    </PieChart>
                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 mt-4 justify-center">
                      {analytics.categoryPreferences.map((entry, index) => {
                        const repColor =
                          analytics.popularFinalColors.find(
                            (c) => c.category === entry.category
                          )?.hex || `hsl(${index * 45}, 70%, 50%)`;
                        return (
                          <div
                            key={entry.category}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="w-4 h-4 rounded border"
                              style={{ backgroundColor: repColor }}
                            />
                            <span className="text-sm capitalize">
                              {entry.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* HSL Distribution Area Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hue Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={analytics.huePreferences}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hue_range" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [value, "Frequency"]}
                        labelFormatter={(label) =>
                          `${label}°-${parseInt(label) + 30}°`
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="frequency"
                        stroke="#ff7300"
                        fill="#ff7300"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saturation Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={analytics.saturationPreferences}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="saturation_range" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [value, "Frequency"]}
                        labelFormatter={(label) =>
                          `${label}%-${parseInt(label) + 10}%`
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="frequency"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lightness Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={analytics.lightnessPreferences}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="lightness_range" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [value, "Frequency"]}
                        labelFormatter={(label) =>
                          `${label}%-${parseInt(label) + 10}%`
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="frequency"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Additional Cool Charts */}
        {analytics && (
          <div className="grid gap-6 mb-8">
            {/* Color Popularity vs Average Rank */}
            <Card>
              <CardHeader>
                <CardTitle>Color Popularity vs Average Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={analytics.popularFinalColors}>
                    <CartesianGrid />
                    <XAxis
                      type="number"
                      dataKey="frequency"
                      name="Popularity"
                      label={{
                        value: "Frequency",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="avgRank"
                      name="Average Rank"
                      reversed
                      domain={[1, 3]}
                      label={{
                        value: "Average Rank",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ payload }) => {
                        if (payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-4 h-4 rounded border"
                                  style={{ backgroundColor: data.hex }}
                                />
                                <span className="font-medium">{data.name}</span>
                              </div>
                              <div>Frequency: {data.frequency}</div>
                              <div>Average Rank: {data.avgRank.toFixed(2)}</div>
                              <div>Category: {data.category}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter
                      dataKey="frequency"
                      fill="#ff6b6b"
                      fillOpacity={0.7}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Color Categories with Visual Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Color Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.categoryPreferences
                    .slice(0, 8)
                    .map((category, index) => {
                      // Find representative colors for this category
                      const categoryColors = analytics.popularFinalColors
                        .filter((color) => color.category === category.category)
                        .slice(0, 5);

                      return (
                        <div
                          key={category.category}
                          className="flex items-center gap-4"
                        >
                          <div className="w-16 text-sm font-medium capitalize">
                            {category.category}
                          </div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-500"
                                style={{
                                  width: `${
                                    (category.count /
                                      analytics.categoryPreferences[0]?.count) *
                                      100 || 0
                                  }%`,
                                  backgroundColor: `hsl(${
                                    index * 45
                                  }, 70%, 60%)`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {categoryColors.map((color) => (
                              <div
                                key={color.hex}
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                          <div className="w-12 text-sm text-right">
                            {category.count}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
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
