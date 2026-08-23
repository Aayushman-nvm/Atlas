import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/modal';
import {
    FontSize, FontWeight, MaxContentWidth, Radius, Spacing
} from '@/constants/theme';
import { getDatabase } from '@/database/db';
import { getSplitById } from '@/database/queries/splits';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutStore } from '@/store/workout-store';
import type { WarmupExercise } from '@/types';
import { formatRestTimer } from '@/utils/format';
import { getWarmupsForSplit } from '@/utils/warmups';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, Clock, Timer, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WarmupScreen() {
  const { splitId, day } = useLocalSearchParams<{ splitId: string; day: string }>();
  const colors = useTheme();
  const { startWorkout } = useWorkoutStore();

  const [splitName, setSplitName] = useState('');
  const [warmups, setWarmups] = useState<WarmupExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadSplit();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [splitId]);

  async function loadSplit() {
    if (!splitId) return;
    const db = await getDatabase();
    const split = await getSplitById(db, splitId);
    if (!split) return;
    setSplitName(split.name);
    const ws = getWarmupsForSplit(split.name);
    setWarmups(ws);
    setCompleted(new Array(ws.length).fill(false));
  }

  function startTimer(seconds: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(seconds);
    setTimerActive(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setTimerActive(false);
          markCurrent();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function markCurrent() {
    setCompleted((prev) => {
      const next = [...prev];
      next[currentIndex] = true;
      return next;
    });
    if (currentIndex < warmups.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  async function proceedToWorkout() {
    if (!splitId) return;
    await startWorkout(splitId, parseInt(day ?? '1', 10));
    router.replace('/workout/index');
  }

  const current = warmups[currentIndex];
  const allDone = completed.every(Boolean);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Warmup</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{splitName}</Text>
          <Pressable
            onPress={() => setShowSkipModal(true)}
            style={[styles.skipBtn, { borderColor: colors.border }]}
          >
            <X size={18} color={colors.textSecondary} />
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Progress dots */}
            <View style={styles.dots}>
              {warmups.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: completed[i]
                        ? colors.success
                        : i === currentIndex
                        ? colors.primary
                        : colors.border,
                      width: i === currentIndex ? 24 : 10,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Current exercise */}
            {current && (
              <Card style={styles.exerciseCard} padding={Spacing.six}>
                <Text style={[styles.exerciseName, { color: colors.text }]}>
                  {current.name}
                </Text>
                <Text style={[styles.exerciseDesc, { color: colors.textSecondary }]}>
                  {current.description}
                </Text>

                <View style={styles.timerRow}>
                  <Clock size={18} color={colors.textSecondary} />
                  <Text style={[styles.duration, { color: colors.textSecondary }]}>
                    {Math.round(current.durationSeconds / 60)} min
                  </Text>
                </View>

                {timerActive ? (
                  <View style={styles.activeTimer}>
                    <Text style={[styles.timerValue, { color: colors.timerActive }]}>
                      {formatRestTimer(secondsLeft)}
                    </Text>
                    <Pressable
                      onPress={() => {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setTimerActive(false);
                        markCurrent();
                      }}
                      style={[styles.doneBtn, { backgroundColor: colors.success }]}
                    >
                      <Text style={styles.doneBtnText}>Done</Text>
                    </Pressable>
                  </View>
                ) : completed[currentIndex] ? (
                  <View style={styles.completedRow}>
                    <CheckCircle2 size={24} color={colors.success} />
                    <Text style={[styles.completedText, { color: colors.success }]}>Completed</Text>
                  </View>
                ) : (
                  <Button
                    label="Start Timer"
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<Timer size={20} color="#FFF" />}
                    onPress={() => startTimer(current.durationSeconds)}
                  />
                )}
              </Card>
            )}

            {/* Upcoming list */}
            <View style={styles.upcomingList}>
              {warmups.map((w, i) => {
                if (i === currentIndex) return null;
                return (
                  <View
                    key={i}
                    style={[
                      styles.upcomingRow,
                      { borderColor: colors.border, backgroundColor: colors.backgroundElement },
                    ]}
                  >
                    {completed[i] ? (
                      <CheckCircle2 size={18} color={colors.success} />
                    ) : (
                      <View style={[styles.upcomingNum, { backgroundColor: colors.border }]}>
                        <Text style={[styles.upcomingNumText, { color: colors.textSecondary }]}>
                          {i + 1}
                        </Text>
                      </View>
                    )}
                    <Text
                      style={[
                        styles.upcomingName,
                        {
                          color: completed[i] ? colors.textTertiary : colors.text,
                          textDecorationLine: completed[i] ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {w.name}
                    </Text>
                    <Text style={[styles.upcomingTime, { color: colors.textSecondary }]}>
                      {Math.round(w.durationSeconds / 60)}m
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            label={allDone ? 'Start Workout' : 'Skip Warmup & Start'}
            variant={allDone ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
            onPress={proceedToWorkout}
          />
        </View>
      </SafeAreaView>

      <ConfirmModal
        visible={showSkipModal}
        title="Skip Warmup?"
        message="Skipping warmup increases injury risk. Are you sure?"
        confirmLabel="Skip Anyway"
        cancelLabel="Go Back"
        onConfirm={() => { setShowSkipModal(false); proceedToWorkout(); }}
        onCancel={() => setShowSkipModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.heavy },
  headerSub: { fontSize: FontSize.base },
  skipBtn: {
    position: 'absolute',
    right: Spacing.five,
    top: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  skipText: { fontSize: FontSize.sm },
  scroll: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.five,
    paddingBottom: Spacing.six,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.five,
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.three },
  dot: { height: 10, borderRadius: Radius.full },
  exerciseCard: {},
  exerciseName: { fontSize: FontSize['2xl'], fontWeight: FontWeight.heavy, marginBottom: Spacing.two },
  exerciseDesc: { fontSize: FontSize.base, lineHeight: 22, marginBottom: Spacing.four },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.five },
  duration: { fontSize: FontSize.base },
  activeTimer: { alignItems: 'center', gap: Spacing.four },
  timerValue: { fontSize: FontSize['4xl'], fontWeight: FontWeight.heavy, fontVariant: ['tabular-nums'] },
  doneBtn: {
    paddingHorizontal: Spacing.seven,
    paddingVertical: Spacing.three,
    borderRadius: Radius.lg,
  },
  doneBtnText: { color: '#FFF', fontSize: FontSize.md, fontWeight: FontWeight.bold },
  completedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.two, paddingVertical: Spacing.three },
  completedText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  upcomingList: { gap: Spacing.two },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  upcomingNum: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingNumText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  upcomingName: { flex: 1, fontSize: FontSize.base },
  upcomingTime: { fontSize: FontSize.sm },
  footer: {
    padding: Spacing.five,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
