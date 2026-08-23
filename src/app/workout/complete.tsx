import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getSessionById, getSessionSets, getSessionTotalVolume } from '@/database/queries/sessions';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings-store';
import type { WorkoutSession, WorkoutSet } from '@/types';
import { formatDuration, formatWeight } from '@/utils/format';
import { router, useLocalSearchParams } from 'expo-router';
import { Clock, Dumbbell, Trophy, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutCompleteScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const colors = useTheme();
  const { units } = useSettingsStore();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    loadData();
  }, [sessionId]);

  async function loadData() {
    const db = await getDatabase();
    const [s, ws, vol] = await Promise.all([
      getSessionById(db, sessionId!),
      getSessionSets(db, sessionId!),
      getSessionTotalVolume(db, sessionId!),
    ]);
    setSession(s);
    setSets(ws);
    setTotalVolume(vol);
  }

  const uniqueExercises = new Set(sets.map((s) => s.exerciseId)).size;
  const totalSets = sets.length;
  const totalReps = sets.reduce((sum, s) => sum + s.repsCompleted, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.content}>
            {/* Trophy */}
            <View style={styles.heroSection}>
              <View style={[styles.trophyCircle, { backgroundColor: colors.warningMuted }]}>
                <Trophy size={56} color={colors.warning} />
              </View>
              <Text style={[styles.headline, { color: colors.text }]}>
                Workout Complete
              </Text>
              <Text style={[styles.subline, { color: colors.textSecondary }]}>
                Great work. That's how it's done.
              </Text>
            </View>

            {/* Stats grid */}
            <View style={styles.statsGrid}>
              <StatCard
                icon={<Clock size={22} color={colors.primary} />}
                label="Duration"
                value={session?.duration ? formatDuration(session.duration) : '—'}
              />
              <StatCard
                icon={<Dumbbell size={22} color={colors.success} />}
                label="Exercises"
                value={String(uniqueExercises)}
              />
              <StatCard
                icon={<Zap size={22} color={colors.warning} />}
                label="Total Sets"
                value={String(totalSets)}
              />
              <StatCard
                icon={<Trophy size={22} color={colors.danger} />}
                label="Volume"
                value={formatWeight(totalVolume, units)}
              />
            </View>

            {/* Motivational message */}
            <Card padding={Spacing.five}>
              <Text style={[styles.quoteText, { color: colors.text }]}>
                {getMotivation(totalSets)}
              </Text>
            </Card>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            label="Back to Home"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.replace('/' as any)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const colors = useTheme();
  return (
    <Card style={styles.statCard} padding={Spacing.four}>
      {icon}
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </Card>
  );
}

function getMotivation(sets: number): string {
  if (sets === 0) return "Every step counts. See you next time.";
  if (sets < 5) return "Showing up is the hardest part. You did it.";
  if (sets < 12) return "Solid session. Consistency builds strength.";
  if (sets < 20) return "Strong work. Your future self thanks you.";
  return "Beast mode. That's how legends are made.";
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    flex: 1,
    padding: Spacing.five,
    gap: Spacing.six,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingTop: Spacing.seven,
  },
  trophyCircle: {
    width: 120,
    height: 120,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.heavy,
    textAlign: 'center',
  },
  subline: {
    fontSize: FontSize.base,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    gap: Spacing.one,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.heavy,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  quoteText: {
    fontSize: FontSize.base,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: Spacing.five,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
