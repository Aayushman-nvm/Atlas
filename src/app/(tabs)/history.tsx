import { Card } from '@/components/ui/card';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getAllSessions, getSessionSets } from '@/database/queries/sessions';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings-store';
import type { WorkoutSession } from '@/types';
import { formatDate, formatDuration, formatWeight } from '@/utils/format';
import { useFocusEffect } from 'expo-router';
import { Calendar, Clock, Dumbbell, Zap } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SessionWithStats extends WorkoutSession {
  totalSets: number;
  totalVolume: number;
  exerciseCount: number;
}

export default function HistoryScreen() {
  const colors = useTheme();
  const { units } = useSettingsStore();
  const [sessions, setSessions] = useState<SessionWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  async function loadHistory() {
    setLoading(true);
    const db = await getDatabase();
    const all = await getAllSessions(db);

    const withStats: SessionWithStats[] = await Promise.all(
      all.map(async (session) => {
        const sets = await getSessionSets(db, session.id);
        const totalVolume = sets.reduce((sum, s) => sum + s.weight * s.repsCompleted, 0);
        const exerciseCount = new Set(sets.map((s) => s.exerciseId)).size;
        return {
          ...session,
          totalSets: sets.length,
          totalVolume,
          exerciseCount,
        };
      })
    );

    setSessions(withStats);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <Text style={[styles.title, { color: colors.text, padding: Spacing.five, paddingTop: Spacing.seven }]}>
            History
          </Text>
          <View style={styles.emptyState}>
            <Calendar size={56} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No workouts yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Complete your first workout to see your history here.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SessionCard session={item} units={units} />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

function SessionCard({
  session,
  units,
}: {
  session: SessionWithStats;
  units: 'kg' | 'lb';
}) {
  const colors = useTheme();

  return (
    <Card style={styles.sessionCard} padding={Spacing.four}>
      <View style={styles.sessionHeader}>
        <Text style={[styles.sessionDate, { color: colors.text }]}>
          {formatDate(session.startTime)}
        </Text>
        {session.split?.name && (
          <View style={[styles.splitBadge, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.splitBadgeText, { color: colors.primary }]}>
              {session.split.name}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <StatChip
          icon={<Clock size={14} color={colors.textSecondary} />}
          value={session.duration ? formatDuration(session.duration) : '—'}
        />
        <StatChip
          icon={<Dumbbell size={14} color={colors.textSecondary} />}
          value={`${session.exerciseCount} ex`}
        />
        <StatChip
          icon={<Zap size={14} color={colors.textSecondary} />}
          value={`${session.totalSets} sets`}
        />
        <StatChip
          icon={<Text style={{ fontSize: FontSize.xs, color: colors.textSecondary }}>vol</Text>}
          value={formatWeight(session.totalVolume, units)}
        />
      </View>
    </Card>
  );
}

function StatChip({ icon, value }: { icon: React.ReactNode; value: string }) {
  const colors = useTheme();
  return (
    <View style={[styles.statChip, { backgroundColor: colors.backgroundSelected }]}>
      {icon}
      <Text style={[styles.statChipText, { color: colors.textSecondary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.heavy,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },
  emptyText: { fontSize: FontSize.base },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.seven,
    gap: Spacing.three,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, textAlign: 'center' },
  emptySubtitle: { fontSize: FontSize.base, textAlign: 'center', lineHeight: 22 },
  listContent: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.seven,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.three,
  },
  sessionCard: {},
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sessionDate: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  splitBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  splitBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  statChipText: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
});
