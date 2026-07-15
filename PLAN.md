# Atlas - Development Plan

> A fully offline React Native workout companion focused on reducing decision fatigue for beginners.
>
> This is **NOT** a fitness social app, calorie tracker, or AI coach.
>
> The goal is simple:
>
> **Open the app → Follow the screen → Finish your workout.**

---

# Core Philosophy

The app should answer only one question:

> **"What should I do next?"**

Every feature should reduce thinking inside the gym.

No unnecessary menus.
No unnecessary choices.
No internet.
No accounts.

---

# Tech Stack

## Framework

- React Native
- Expo

## Storage

- SQLite (expo-sqlite)

## State

- Zustand

## Navigation

- React Navigation

## Forms

- React Hook Form

## Icons

- Lucide Icons

## Notifications

- expo-notifications

## Animations

- react-native-reanimated

## Bottom Sheets

- @gorhom/bottom-sheet

---

# App Architecture

```
App

    Navigation

        Screens

            Components

                Hooks

                    Zustand Store

                        SQLite
```

Everything is local.

No backend.

No APIs.

---

# Database

## Exercises

Contains every exercise available in the app.

Fields

- id
- name
- category
- subCategory
- muscleGroup
- equipment
- tutorialUrl
- difficulty
- notes

---

## Splits

User-created workout plans.

Fields

- id
- name

Examples

- Push Pull Legs
- Arnold
- Bro Split
- Upper Lower
- PPLA

---

## SplitExercises

Connects exercises to a split.

Fields

- id
- splitId
- exerciseId
- day
- order
- sets
- reps
- restSeconds

---

## WorkoutSession

Fields

- id
- splitId
- startTime
- endTime
- duration

---

## WorkoutSets

Fields

- id
- sessionId
- exerciseId
- setNumber
- weight
- repsCompleted

---

## Settings

- theme
- strictMode
- units
- defaultRest

---

# First Launch

Seed database with

- Exercise library
- Tutorial links
- Categories
- Warmups
- Famous workout splits

Users NEVER create exercises.

Users ONLY create routines using existing exercises.

---

# Categories

Upper Body

- Chest
- Back
- Shoulders
- Biceps
- Triceps
- Forearms

Lower Body

- Quads
- Hamstrings
- Glutes
- Calves

Core

- Abs
- Obliques

Cardio

Warmups

---

# Warmups

Warmups are NOT customizable.

Every workout starts with warmups.

Warmups depend on workout type.

Example

Push

- Treadmill
- Arm Circles
- Band Pull Apart
- Shoulder Rotations

Pull

- Treadmill
- Scapular Pulls
- Band Rows

Legs

- Walk
- Hip Mobility
- Leg Swings
- Bodyweight Squats

Purpose

Reduce anxiety.

No thinking.

Just begin.

---

# Workout Flow

Home

↓

Today's Workout

↓

Warmups

↓

Exercise 1

↓

Exercise 2

↓

Exercise 3

↓

Workout Complete

---

# Focus Mode

Default mode.

Shows only current exercise.

Screen contains

- Exercise Name
- Previous Performance
- Sets
- Reps
- Weight
- Rest Timer
- Tutorial Button
- Notes
- Next Exercise Preview

Large buttons.

Minimal distractions.

---

# Overview Mode

Accessible from a single button.

Shows

Entire workout

Warmups

Exercise progress

Completed

Remaining

Jump between exercises (depending on strict mode)

Return back to Focus Mode anytime.

---

# Split Builder

User creates custom split.

Flow

Choose Category

↓

Multi-select Exercises

↓

Arrange Order

↓

Set Sets

↓

Set Reps

↓

Save

Exercises come ONLY from predefined library.

---

# Tutorial

Every exercise has

- YouTube URL

Click Tutorial

↓

Open YouTube

No embedded videos.

---

# Workout Timer

Automatically starts when workout begins.

Shows

Elapsed Time

Estimated Finish Time

---

# Rest Timer

Every exercise has rest duration.

When a set completes

↓

Rest timer starts automatically

↓

Notification

↓

Ready for next set

---

# Previous Workout

Each exercise shows

Previous Weight

Previous Reps

Previous Date

---

# History

Shows

Workout Date

Duration

Exercises Completed

Total Volume

---

# Analytics (Future)

Workout streak

PRs

Weekly volume

Workout frequency

Most trained muscle

Exercise frequency

---

# Theme

Support

- Light
- Dark

Toggle in Settings.

Remember last choice.

---

# Strictness System

Purpose

Remove decision fatigue.

Different users want different levels of flexibility.

Three levels are supported.

---

## 1. Flexible Mode

Default.

User may

✅ Skip exercises

✅ Jump anywhere

✅ Edit sets

✅ Edit reps

✅ Rearrange workout

Whenever changing workout structure, show confirmation modal.

Example

"Skip Incline Bench?"

"Are you sure?"

---

## 2. Strict Mode

Guided workout.

Rules

Warmups first.

Exercise order enforced.

Cannot jump ahead.

Must complete current exercise before next unlocks.

Can still edit

- Sets
- Reps
- Weight

Editing requires confirmation.

Confirmation

"You are changing today's planned workout.

Continue?"

---

## 3. Super Strict Mode

Maximum discipline.

Warmups mandatory.

Exercise order locked.

Cannot skip.

Cannot jump.

Cannot edit

- Sets
- Reps
- Exercise order

Only weight entry is allowed (for logging actual performance).

Once an exercise is completed

↓

Next unlocks.

Everything else remains locked.

---

# Confirmation Modals

Always confirm before

Skipping exercise

Editing sets

Editing reps

Deleting split

Resetting workout

Ending workout early

Examples

"Skip this exercise?"

"This may affect today's workout."

Continue

Cancel

---

# Settings

Theme

- Light
- Dark

Strictness

- Flexible
- Strict
- Super Strict

Units

- KG
- LB

Default Rest Time

Sound

Vibration

---

# Notifications

Rest Complete

Workout Finished

Optional reminder to continue after long inactivity.

---

# Folder Structure

src/

    assets/

    components/

    constants/

    database/

    hooks/

    navigation/

    screens/

    services/

    store/

    types/

    utils/

---

# Design Principles

Large touch targets.

Minimal typing.

One primary action per screen.

No clutter.

Everything reachable within one or two taps.

Designed to be usable while tired between sets.

---

# Non Goals

No accounts

No cloud sync

No subscriptions

No ads

No calorie tracking

No meal planner

No AI workout generation

No wearable integration

No social features

No chat

No leaderboard

No online dependency

---

# Guiding Principle

Whenever the user opens the app, they should never wonder:

"What do I do now?"

The app should always present exactly one clear next action until the workout is complete.