import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing, TouchTarget,
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getSplitById, getSplitExercises } from '@/database/queries/splits';
import { useTheme } from '@/hooks/use-theme';
import type { Split, SplitExercise } from '@/types';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ChevronLeft, ExternalLink } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DaySection {
  day: number;
  data: SplitExercise[];
}

export default function SplitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const [split, setSplit] = useState<Split | null>(null);
  const [sections, setSections] = useState<DaySection[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id])
  );

  async function loadData() {
    if (!id) return;
    const db = await getDatabase();
    const [s, exercises] = await Promise.all([
      getSplitById(db, id),
      getSplitExercises(db, id),
    ]);
    setSplit(s);

    // Group by day
    const dayMap = new Map<number, SplitExercise[]>();
    for (const ex of exercises) {
      const arr = dayMap.get(ex.day) ?? [];
      arr.push(ex);
      dayMap.set(ex.day, arr);
    }
    const secs: DaySection[] = Array.from(dayMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([day, data]) => ({ day, data }));
    setSections(secs);
  }

  if (!split) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={[styles.splitName, { color: colors.text }]} numberOfLines={1}>
              {split.name}
            </Text>
            {split.description ? (
              <Text style={[styles.splitDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                {split.description}
              </Text>
            ) : null}
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={({ section }) => (
            <View style={styles.dayHeader}>
              <Text style={[styles.dayLabel, { color: colors.text }]}>
                Day {section.day}
              </Text>
              <Text style={[styles.dayCount, { color: colors.textSecondary }]}>
                {section.data.length} exercise{section.data.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ExerciseRow item={item} />
          )}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Button
                label="Start This Workout"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() =>
                  router.push({
                    pathname: '/workout/warmup' as any,
                    params: { splitId: split.id, day: '1' },
                  })
                }
              />
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

function ExerciseRow({ item }: { item: SplitExercise }) {
  const colors = useTheme();
  const ex = item.exercise;

  return (
    <Card style={styles.exCard} padding={Spacing.four}>
      <View style={styles.exRow}>
        <View style={styles.exInfo}>
          <Text style={[styles.exName, { color: colors.text }]}>{ex?.name ?? '—'}</Text>
          <Text style={[styles.exMeta, { color: colors.textSecondary }]}>
            {item.sets} sets × {item.reps} reps · {item.restSeconds}s rest
          </Text>
          {ex?.muscleGroup && (
            <View style={[styles.muscleBadge, { backgroundColor: colors.backgroundSelected }]}>
              <Text style={[styles.muscleText, { color: colors.textSecondary }]}>
                {ex.muscleGroup}
              </Text>
            </View>
          )}
        </View>
        {ex?.tutorialUrl ? (
          <Pressable
            onPress={() => ex.tutorialUrl && WebBrowser.openBrowserAsync(ex.tutorialUrl)}
            style={({ pressed }) => [styles.tutorialBtn, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Watch tutorial"
          >
            <ExternalLink size={18} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  backBtn: {
    width: TouchTarget.comfortable,
    height: TouchTarget.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  splitName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  splitDesc: { fontSize: FontSize.sm, marginTop: 1 },
  listContent: {
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.seven,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.six,
    paddingBottom: Spacing.three,
  },
  dayLabel: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  dayCount: { fontSize: FontSize.sm },
  exCard: { marginBottom: Spacing.two },
  exRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.three },
  exInfo: { flex: 1, gap: Spacing.two },
  exName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  exMeta: { fontSize: FontSize.sm },
  muscleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  muscleText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  tutorialBtn: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { paddingTop: Spacing.five, gap: Spacing.three },
});
