import { query, getClient } from "./db";
import { GameSession, Color, RoundResult } from "@/types/game";
import { CURATED_COLORS } from "./colors";
import { ensureDbInitialized } from "./startup";

// Initialize colors in database from our curated set
export async function initializeColors(): Promise<void> {
  try {
    for (const color of CURATED_COLORS) {
      await query(
        `INSERT INTO colors (id, name, hex, hue, saturation, lightness, red, green, blue, category)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (hex) DO UPDATE SET
           name = EXCLUDED.name,
           hue = EXCLUDED.hue,
           saturation = EXCLUDED.saturation,
           lightness = EXCLUDED.lightness,
           red = EXCLUDED.red,
           green = EXCLUDED.green,
           blue = EXCLUDED.blue,
           category = EXCLUDED.category`,
        [
          color.name,
          color.hex,
          color.hsl.h,
          color.hsl.s,
          color.hsl.l,
          color.rgb.r,
          color.rgb.g,
          color.rgb.b,
          color.category,
        ]
      );
    }
    console.log("Colors initialized in database");
  } catch (error) {
    console.error("Error initializing colors:", error);
    throw error;
  }
}

// Get color by hex value
export async function getColorByHex(hex: string): Promise<Color | null> {
  try {
    const result = await query("SELECT * FROM colors WHERE hex = $1", [hex]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      hex: row.hex,
      hsl: { h: row.hue, s: row.saturation, l: row.lightness },
      rgb: { r: row.red, g: row.green, b: row.blue },
      selectionCount: 0, // This will be set based on session context
    };
  } catch (error) {
    console.error("Error getting color by hex:", error);
    throw error;
  }
}

// Save a complete game session
export async function saveGameSession(
  session: GameSession
): Promise<{ success: boolean; sessionId: string }> {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // Ensure database is initialized
    await ensureDbInitialized();

    // Insert or update game session
    await client.query(
      `INSERT INTO game_sessions (
        id, user_agent, screen_width, screen_height, start_time, completed_at,
        current_round, total_rounds, colors_per_round, game_phase
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        user_agent = EXCLUDED.user_agent,
        screen_width = EXCLUDED.screen_width,
        screen_height = EXCLUDED.screen_height,
        completed_at = EXCLUDED.completed_at,
        current_round = EXCLUDED.current_round,
        game_phase = EXCLUDED.game_phase,
        updated_at = NOW()`,
      [
        session.id,
        session.userAgent,
        session.screenSize?.width,
        session.screenSize?.height,
        session.gameState.startTime,
        session.completedAt,
        session.gameState.currentRound,
        session.gameState.totalRounds,
        session.gameState.colorsPerRound,
        session.gameState.gamePhase,
      ]
    );

    // Save round history
    for (const round of session.gameState.roundHistory) {
      // Insert round result
      const roundResult = await client.query(
        `INSERT INTO round_results (session_id, round_number, selected_color_id, time_spent, timestamp)
         VALUES ($1, $2, (SELECT id FROM colors WHERE hex = $3), $4, $5)
         RETURNING id`,
        [
          session.id,
          round.round,
          round.selectedColor.hex,
          round.timeSpent,
          round.timestamp,
        ]
      );

      const roundResultId = roundResult.rows[0].id;

      // Insert colors shown in this round
      for (let i = 0; i < round.colorsShown.length; i++) {
        await client.query(
          `INSERT INTO round_colors (round_result_id, color_id, position)
           VALUES ($1, (SELECT id FROM colors WHERE hex = $2), $3)`,
          [roundResultId, round.colorsShown[i].hex, i]
        );
      }
    }

    // Save selected colors with their selection counts
    for (const color of session.gameState.selectedColors) {
      await client.query(
        `INSERT INTO session_colors (session_id, color_id, selection_count)
         VALUES ($1, (SELECT id FROM colors WHERE hex = $2), $3)
         ON CONFLICT (session_id, color_id) DO UPDATE SET
           selection_count = EXCLUDED.selection_count`,
        [session.id, color.hex, color.selectionCount]
      );
    }

    // Save favorite colors
    if (session.gameState.favorites) {
      for (const color of session.gameState.favorites) {
        await client.query(
          `INSERT INTO favorite_colors (session_id, color_id)
           VALUES ($1, (SELECT id FROM colors WHERE hex = $2))
           ON CONFLICT (session_id, color_id) DO NOTHING`,
          [session.id, color.hex]
        );
      }
    }

    // Save final rankings
    if (session.gameState.finalTop3) {
      for (let i = 0; i < session.gameState.finalTop3.length; i++) {
        await client.query(
          `INSERT INTO final_rankings (session_id, color_id, rank)
           VALUES ($1, (SELECT id FROM colors WHERE hex = $2), $3)
           ON CONFLICT (session_id, rank) DO UPDATE SET
             color_id = EXCLUDED.color_id`,
          [session.id, session.gameState.finalTop3[i].hex, i + 1]
        );
      }
    }

    await client.query("COMMIT");
    console.log("Game session saved successfully");

    return { success: true, sessionId: session.id };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving game session:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get recent game results
export async function getGameResults(limit: number = 100) {
  try {
    // Ensure database is initialized
    await ensureDbInitialized();

    const result = await query(
      `SELECT 
        gs.id,
        gs.completed_at,
        gs.user_agent,
        gs.screen_width,
        gs.screen_height,
        gs.total_rounds,
        json_agg(
          json_build_object(
            'hex', c.hex,
            'name', c.name,
            'rank', fr.rank,
            'hsl', json_build_object('h', c.hue, 's', c.saturation, 'l', c.lightness),
            'rgb', json_build_object('r', c.red, 'g', c.green, 'b', c.blue),
            'selectionCount', COALESCE(sc.selection_count, 0)
          ) ORDER BY fr.rank
        ) as final_colors,
        (SELECT COUNT(*) FROM round_results WHERE session_id = gs.id) as round_history_count,
        (SELECT COUNT(*) FROM favorite_colors WHERE session_id = gs.id) as favorites_count
       FROM game_sessions gs
       LEFT JOIN final_rankings fr ON gs.id = fr.session_id
       LEFT JOIN colors c ON fr.color_id = c.id
       LEFT JOIN session_colors sc ON gs.id = sc.session_id AND c.id = sc.color_id
       WHERE gs.game_phase = 'complete' AND gs.completed_at IS NOT NULL
       GROUP BY gs.id, gs.completed_at, gs.user_agent, gs.screen_width, gs.screen_height, gs.total_rounds
       ORDER BY gs.completed_at DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map((row) => ({
      id: row.id,
      completedAt: row.completed_at,
      userAgent: row.user_agent,
      screenSize:
        row.screen_width && row.screen_height
          ? {
              width: row.screen_width,
              height: row.screen_height,
            }
          : undefined,
      totalRounds: row.total_rounds,
      finalColors: row.final_colors || [],
      roundHistory: row.round_history_count,
      favoritesCount: row.favorites_count,
    }));
  } catch (error) {
    console.error("Error getting game results:", error);
    throw error;
  }
}

// Get color analytics
export async function getColorAnalytics() {
  try {
    // Ensure database is initialized
    await ensureDbInitialized();

    // Get popular final colors
    const popularColorsResult = await query(
      `SELECT 
        c.hex,
        c.name,
        c.category,
        COUNT(fr.id) as frequency,
        AVG(fr.rank::float) as avg_rank,
        AVG(c.hue::float) as avg_hue,
        AVG(c.saturation::float) as avg_saturation,
        AVG(c.lightness::float) as avg_lightness
       FROM final_rankings fr
       JOIN colors c ON fr.color_id = c.id
       JOIN game_sessions gs ON fr.session_id = gs.id
       WHERE gs.game_phase = 'complete'
       GROUP BY c.id, c.hex, c.name, c.category, c.hue, c.saturation, c.lightness
       ORDER BY frequency DESC, avg_rank ASC
       LIMIT 20`
    );

    // Get hue preferences
    const hueResult = await query(
      `SELECT 
        (c.hue / 30) * 30 as hue_range,
        COUNT(*) as frequency
       FROM final_rankings fr
       JOIN colors c ON fr.color_id = c.id
       JOIN game_sessions gs ON fr.session_id = gs.id
       WHERE gs.game_phase = 'complete'
       GROUP BY (c.hue / 30) * 30
       ORDER BY hue_range`
    );

    // Get saturation preferences
    const saturationResult = await query(
      `SELECT 
        (c.saturation / 10) * 10 as saturation_range,
        COUNT(*) as frequency
       FROM final_rankings fr
       JOIN colors c ON fr.color_id = c.id
       JOIN game_sessions gs ON fr.session_id = gs.id
       WHERE gs.game_phase = 'complete'
       GROUP BY (c.saturation / 10) * 10
       ORDER BY saturation_range`
    );

    // Get lightness preferences
    const lightnessResult = await query(
      `SELECT 
        (c.lightness / 10) * 10 as lightness_range,
        COUNT(*) as frequency
       FROM final_rankings fr
       JOIN colors c ON fr.color_id = c.id
       JOIN game_sessions gs ON fr.session_id = gs.id
       WHERE gs.game_phase = 'complete'
       GROUP BY (c.lightness / 10) * 10
       ORDER BY lightness_range`
    );

    // Get color name preferences
    const namePreferencesResult = await query(
      `SELECT 
        c.name,
        SUM(sc.selection_count) as count
       FROM session_colors sc
       JOIN colors c ON sc.color_id = c.id
       JOIN game_sessions gs ON sc.session_id = gs.id
       WHERE gs.game_phase = 'complete'
       GROUP BY c.name
       ORDER BY count DESC
       LIMIT 15`
    );

    // Get category preferences
    const categoryPreferencesResult = await query(
      `SELECT 
        c.category,
        SUM(sc.selection_count) as count
       FROM session_colors sc
       JOIN colors c ON sc.color_id = c.id
       JOIN game_sessions gs ON sc.session_id = gs.id
       WHERE gs.game_phase = 'complete'
       GROUP BY c.category
       ORDER BY count DESC`
    );

    // Get total stats
    const statsResult = await query(
      `SELECT 
        COUNT(DISTINCT gs.id) as total_sessions,
        COUNT(fr.id) as total_colors,
        COUNT(DISTINCT rr.id) as total_rounds
       FROM game_sessions gs
       LEFT JOIN final_rankings fr ON gs.id = fr.session_id
       LEFT JOIN round_results rr ON gs.id = rr.session_id
       WHERE gs.game_phase = 'complete'`
    );

    const stats = statsResult.rows[0];

    return {
      popularFinalColors: popularColorsResult.rows.map((row) => ({
        hex: row.hex,
        name: row.name,
        category: row.category,
        frequency: parseInt(row.frequency),
        avgRank: parseFloat(row.avg_rank),
        avgHue: parseFloat(row.avg_hue),
        avgSaturation: parseFloat(row.avg_saturation),
        avgLightness: parseFloat(row.avg_lightness),
      })),
      huePreferences: hueResult.rows.map((row) => ({
        hue_range: parseInt(row.hue_range),
        frequency: parseInt(row.frequency),
      })),
      saturationPreferences: saturationResult.rows.map((row) => ({
        saturation_range: parseInt(row.saturation_range),
        frequency: parseInt(row.frequency),
      })),
      lightnessPreferences: lightnessResult.rows.map((row) => ({
        lightness_range: parseInt(row.lightness_range),
        frequency: parseInt(row.frequency),
      })),
      colorNamePreferences: namePreferencesResult.rows.map((row) => ({
        name: row.name,
        count: parseInt(row.count),
      })),
      categoryPreferences: categoryPreferencesResult.rows.map((row) => ({
        category: row.category,
        count: parseInt(row.count),
      })),
      totalSessions: parseInt(stats.total_sessions),
      totalColors: parseInt(stats.total_colors),
      totalRounds: parseInt(stats.total_rounds),
    };
  } catch (error) {
    console.error("Error getting color analytics:", error);
    throw error;
  }
}
