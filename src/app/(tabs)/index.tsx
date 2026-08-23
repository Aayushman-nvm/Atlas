import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FontSize, FontWeight, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getAllSessions } from '@/database/queries/sessions';
import { getAllSplits } from '@/database/queries/splits';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings-store';
import type { Split, WorkoutSession } from '@/types';
import { formatDate, formatDuration } from '@/utils/format';
import { router } from 'expo-router';
import { Calendar, ChevronRight, Dumbbell, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colors = useTheme();
  const { units } = useSettingsStore();
  const [splits, setSplits] = useState<Split[]>([]);
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const db = await getDatabase();
    const [allSplits, sessions] = await Promise.all([
      getAllSplits(db),
      getAllSessions(db),
    ]);
    setSplits(allSplits);
    setRecentSessions(sessions.slice(0, 3));
    // Set the first split as active by default if none chosen
    if (allSplits.length > 0 && !activeSplitId) {
      setActiveSplitId(allSplits[0].id);
    }
  }

  const activeSplit = splits.find((s) => s.id === activeSplitId);

  function startWorkout() {
    if (!activeSplitId) return;
    router.push({
      pathname: '/workout/warmup' as any,
      params: { splitId: activeSplitId, day: '1' },
    });
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                {getGreeting()}
              </Text>
              <Text style={[styles.headline, { color: colors.text }]}>
                Ready to train?
              </Text>
            </View>

            {/* Active Split Card */}
            <Card style={styles.heroCard} padding={Spacing.six}>
              <View style={styles.heroTop}>
                <View style={[styles.iconBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Dumbbell size={24} color={colors.primary} />
                </View>
                <View style={styles.heroText}>
                  <Text style={[styles.heroLabel, { color: colors.textSecondary }]}>
                    Today's Workout
                  </Text>
                  <Text style={[styles.heroSplit, { color: colors.text }]} numberOfLines={1}>
                    {activeSplit?.name ?? 'No split selected'}
                  </Text>
                </View>
              </View>

              <Button
                label="Start Workout"
                variant="primary"
                size="lg"
                fullWidth
                disabled={!activeSplitId}
                onPress={startWorkout}
              />
            </Card>

            {/* Split Selector */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Split</Text>
              {splits.map((split) => (
                <Pressable
                  key={split.id}
                  onPress={() => setActiveSplitId(split.id)}
                  style={({ pressed }) => [
                    styles.splitRow,
                    {
                      backgroundColor:
                        split.id === activeSplitId
                          ? colors.primaryMuted
                          : colors.backgroundElement,
                      borderColor:
                        split.id === activeSplitId ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: split.id === activeSplitId }}
                >
                  <View style={styles.splitRowInner}>
                    <View
                      style={[
                        styles.splitDot,
                        {
                          backgroundColor:
                            split.id === activeSplitId ? colors.primary : colors.border,
                        },
                      ]}
                    />
                    <View style={styles.splitInfo}>
                      <Text
                        style={[
                          styles.splitName,
                          {
                            color:
                              split.id === activeSplitId ? colors.primary : colors.text,
                            fontWeight:
                              split.id === activeSplitId
                                ? FontWeight.bold
                                : FontWeight.medium,
                          },
                        ]}
                      >
                        {split.name}
                      </Text>
                      {split.description ? (
                        <Text
                          style={[styles.splitDesc, { color: colors.textSecondary }]}
                          numberOfLines={1}
                        >
                          {split.description}
                        </Text>
                      ) : null}
                    </View>
                    {split.id === activeSplitId && (
                      <ChevronRight size={18} color={colors.primary} />
                    )}
                  </View>
                </Pressable>
              ))}
              <Button
                label="Create New Split"
                variant="ghost"
                size="sm"
                onPress={() => router.push('/splits/new' as any)}
              />
            </View>

            {/* Recent Workouts */}
            {recentSessions.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Recent
                  </Text>
                  <Pressable onPress={() => router.push('/(tabs)/history' as any)}>
                    <Text style={[styles.sectionLink, { color: colors.primary }]}>
                      View all
                    </Text>
                  </Pressable>
                </View>
                {recentSessions.map((session) => (
                  <Card key={session.id} padding={Spacing.four} style={styles.sessionCard}>
                    <View style={styles.sessionRow}>
                      <Calendar size={16} color={colors.textSecondary} />
                      <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                        {formatDate(session.startTime)}
                      </Text>
                      <Text style={[styles.sessionSplit, { color: colors.text }]}>
                        {session.split?.name ?? '—'}
                      </Text>
                      {session.duration != null && (
                        <View style={styles.sessionDuration}>
                          <TrendingUp size={14} color={colors.textSecondary} />
                          <Text style={[styles.sessionDurationText, { color: colors.textSecondary }]}>
                            {formatDuration(session.duration)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.seven,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.six,
  },
  header: { gap: Spacing.one },
  greeting: { fontSize: FontSize.base },
  headline: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.heavy,
  },
  heroCard: {},
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    marginBottom: Spacing.five,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { flex: 1 },
  heroLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  heroSplit: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, marginTop: 2 },
  section: { gap: Spacing.three },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  sectionLink: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  splitRow: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  splitRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  splitDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  splitInfo: { flex: 1 },
  splitName: { fontSize: FontSize.base },
  splitDesc: { fontSize: FontSize.sm, marginTop: 1 },
  sessionCard: { marginBottom: 0 },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sessionDate: { fontSize: FontSize.sm },
  sessionSplit: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  sessionDuration: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sessionDurationText: { fontSize: FontSize.sm },
});
